console.log("[WebSocket Debug] Initializing WebSocket Analyzer for Player Data...");

// Dynamically load pako.js for potential decompression (if needed)
(function loadPako() {
  const script = document.createElement("script");
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/pako/2.0.4/pako.min.js";
  script.onload = () => console.log("[WebSocket] pako.js loaded successfully.");
  script.onerror = () => console.warn("[WebSocket] Failed to load pako.js.");
  document.head.appendChild(script);
})();

(function() {
  'use strict';

  // This array will store a simplified log of messages
  const messageLog = [];
  // A simple heuristic: Look for alphanumeric strings 3 to 16 characters long
  const playerNameRegex = /\b[A-Za-z0-9_-]{3,16}\b/g;

  // Intercept WebSocket messages
  const OriginalWebSocket = window.WebSocket;
  class CustomWebSocket extends OriginalWebSocket {
    constructor(url, protocols) {
      super(url, protocols);
      console.log('[CustomWebSocket] Connecting to:', url);

      this.addEventListener('message', (event) => {
        if (event.data instanceof ArrayBuffer) {
          processBinaryData(event.data);
        } else if (event.data instanceof Blob) {
          event.data.arrayBuffer().then(buffer => processBinaryData(buffer));
        }
      });

      // Auto-reconnect on close (if needed)
      this.addEventListener('close', (event) => {
        console.warn('[CustomWebSocket] Connection closed:', event);
        setTimeout(() => {
          console.log('[CustomWebSocket] Attempting to reconnect...');
          window.WebSocket = new CustomWebSocket(url, protocols);
        }, 1000);
      });
    }
  }

  // Override the native WebSocket
  setTimeout(() => {
    window.WebSocket = CustomWebSocket;
    console.log('[CustomWebSocket] WebSocket Override Applied');
  }, 1000);

  // Attempt XOR decoding with a list of possible keys
  function xorDecode(buffer, key) {
    let result = "";
    for (let i = 0; i < buffer.length; i++) {
      result += String.fromCharCode(buffer[i] ^ key);
    }
    return result;
  }

  function tryXORDecodings(buffer) {
    const possibleKeys = [0x55, 0xA3, 0x5F, 0x10, 0x99];
    let results = [];
    possibleKeys.forEach(key => {
      try {
        const decoded = xorDecode(buffer, key);
        results.push({ key, decoded });
      } catch (e) {
        console.warn("XOR decoding error with key", key, e);
      }
    });
    return results;
  }

  // Check if data is compressed (by looking for a gzip header)
  function isCompressed(buffer) {
    return buffer[0] === 0x1F && buffer[1] === 0x8B;
  }

  function decompressData(buffer) {
    try {
      if (typeof pako === "undefined") {
        console.warn("[Decompression] pako.js not loaded.");
        return null;
      }
      if (!isCompressed(buffer)) return null;
      return pako.inflate(buffer, { to: 'string' });
    } catch (e) {
      console.warn("[Decompression Failed]", e);
      return null;
    }
  }

  // Process a binary packet
  function processBinaryData(buffer) {
    const dataArray = new Uint8Array(buffer);
    if (dataArray.length < 2) return; // Not enough data

    // Assume the first byte is the dynamic opcode; the rest is payload
    const opcode = dataArray[0];
    const payload = buffer.slice(2);

    // Record a simple log entry with opcode and payload length
    messageLog.push({ opcode, length: dataArray.length, raw: payload });

    // Try basic UTF-8 decoding
    let decodedText = "";
    try {
      decodedText = new TextDecoder("utf-8").decode(payload);
    } catch (e) {
      decodedText = "";
    }

    // Try XOR decoding with possible keys
    const xorResults = tryXORDecodings(new Uint8Array(payload));

    // Try decompression (if it looks compressed)
    let decompressedText = decompressData(new Uint8Array(payload));

    // Combine potential candidate texts
    let candidateTexts = [decodedText];
    xorResults.forEach(result => candidateTexts.push(result.decoded));
    if (decompressedText) candidateTexts.push(decompressedText);

    // For each candidate text, check for potential player names
    candidateTexts.forEach(text => {
      if (text && text.length > 0) {
        const matches = text.match(playerNameRegex);
        if (matches && matches.length > 0) {
          console.log(`[Player Data Candidate] from opcode ${opcode}:`, matches);
        }
      }
    });
  }

  // Expose the collected message log for further offline analysis
  window.getMessageLog = function() {
    return messageLog;
  };

  console.log("WebSocket Analyzer initialized. Use window.getMessageLog() to inspect captured messages.");
})();
