console.log("[WebSocket Debug] Initializing WebSocket Analyzer...");

(function () {
  'use strict';

  // Opcode registry for classification
  const opcodeRegistry = {};
  let opcodeSummary = {};
  let lastSummaryTime = Date.now();
  const loggedOpcodes = new Set();
  const messageLogLimit = 10; // Limit message logs to avoid console spam
  let messageLogCount = 0;

  function logOpcodeOnce(opcode) {
    if (!loggedOpcodes.has(opcode)) {
      console.log(`[WebSocket] New Opcode Detected: ${opcode}`);
      loggedOpcodes.add(opcode);
    }
  }

  function processSignal(data) {
    if (!data || data.opcode === undefined) return;
    const opcode = data.opcode;
    logOpcodeOnce(opcode);

    // Special handling for opcode 25 (Message Sending)
    if (opcode === 25) {
      processMessageOpcode(data);
    }

    const signalStrength = data.signalStrength || 0;
    const messageSize = data.messageSize || 0;

    if (!opcodeRegistry[opcode]) {
      opcodeRegistry[opcode] = { count: 1, strongestSignal: signalStrength, messageSizes: [messageSize] };
    } else {
      opcodeRegistry[opcode].count += 1;
      opcodeRegistry[opcode].strongestSignal = Math.max(opcodeRegistry[opcode].strongestSignal, signalStrength);
      if (!opcodeRegistry[opcode].messageSizes.includes(messageSize)) {
        opcodeRegistry[opcode].messageSizes.push(messageSize);
      }
    }

    if (!opcodeSummary[opcode]) {
      opcodeSummary[opcode] = 1;
    } else {
      opcodeSummary[opcode] += 1;
    }

    // Summarize data every 30 seconds (reduce spam)
    if (Date.now() - lastSummaryTime > 30000) {
      console.clear();
      console.log(`[WebSocket Analyzer] Opcode Frequency Summary (Last 30s)`);
      console.table(opcodeSummary);
      opcodeSummary = {};
      lastSummaryTime = Date.now();
    }
  }

  function processMessageOpcode(data) {
    if (data.rawMessage && messageLogCount < messageLogLimit) {
      try {
        const messageText = new TextDecoder("utf-8").decode(data.rawMessage);
        const cleanedMessage = messageText.replace(/[^\x20-\x7E]/g, ""); // Remove non-printable characters
        
        if (cleanedMessage.length > 0) {
          console.log(`[WebSocket] Message Sent: ${cleanedMessage}`);
          messageLogCount++;
        }

        // Detect player-related messages
        if (cleanedMessage.toLowerCase().includes("player")) {
          console.log("[WebSocket] Player Info Detected:", cleanedMessage);
        }
      } catch (e) {
        console.warn("[WebSocket] Message Parsing Error:", e);
      }
    }
  }

  // Override the native WebSocket
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

      this.addEventListener('close', (event) => {
        console.warn('[CustomWebSocket] Connection closed:', event);
        setTimeout(() => {
          console.log('[CustomWebSocket] Attempting to reconnect...');
          window.WebSocket = new CustomWebSocket(url, protocols);
        }, 1000);
      });
    }
  }

  function processBinaryData(buffer) {
    const dataArray = new Uint8Array(buffer);
    if (dataArray.length >= 2) {
      const opcode = dataArray[0];
      const signalStrength = dataArray[1];
      const rawMessage = buffer.slice(2); // Extract the message part
      processSignal({ opcode, signalStrength, messageSize: dataArray.length, rawMessage });
    }
  }

  // Apply the WebSocket override after a short delay
  setTimeout(() => {
    window.WebSocket = CustomWebSocket;
    console.log('[CustomWebSocket] WebSocket Override Applied');
  }, 1000);

  // Expose a function to display the current opcode registry
  window.analyzeOpcodes = function () {
    console.log("[CustomWebSocket] Opcode Registry Analysis:");
    console.table(opcodeRegistry);
  };

})(); 
