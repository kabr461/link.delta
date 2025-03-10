(function() {
  console.log("Injecting Delta-like client...");

  // --- pako Polling Mechanism with Timeout ---
  let pakoWaitTime = 0;
  const maxPakoWaitTime = 5000; // Maximum wait time of 5 seconds
  const pakoIntervalId = setInterval(function() {
    pakoWaitTime += 100;
    if (typeof pako !== "undefined") {
      console.log("pako is available.");
      clearInterval(pakoIntervalId);
      runAdditionalCode();
    } else if (pakoWaitTime >= maxPakoWaitTime) {
      console.error("pako did not load within the expected time.");
      clearInterval(pakoIntervalId);
    } else {
      // Log less frequently (every 1000ms)
      if (pakoWaitTime % 1000 === 0) {
        console.log("Waiting for pako to load...");
      }
    }
  }, 100);

  function runAdditionalCode() {
    console.log("Running additional code now that pako is loaded.");
    // Place additional code here...
  }

  // --- Capture Setup for Translated Data ---
  const capturedMessages = [];
  const captureDuration = 10000; // 10 seconds
  const captureEndTime = Date.now() + captureDuration;
  
  // Function to export captured messages as a JSON file
  function exportCapturedMessages() {
    if (capturedMessages.length === 0) {
      console.warn("No messages were captured.");
      return;
    }
    const dataStr = JSON.stringify(capturedMessages, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'translated_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log("Exported captured translated messages.");
  }
  
  // Schedule export after 10 seconds
  setTimeout(exportCapturedMessages, captureDuration);

  // --- Dynamic Opcode Mapping Initialization ---

  // Simulate an obfuscated array (Delta's m() returns a long array of strings)
  function getMappingArray() {
    return [
      "686255LrqtKP", "CdtBy", "accHg", "1365gBFmLM", "Message", "encode", "XrzDJ", "shpzH", "XHYGU", "toPrimitiv",
      // ... more entries would exist in the real code ...
      "dummy1", "dummy2", "dummy3", "dummy4", "dummy5", "dummy6", "dummy7", "dummy8", "dummy9", "dummy10"
    ];
  }
  
  // Mimics Delta's internal deobfuscation function 'e'
  function deobfuscate(index, mappingArray) {
    return mappingArray[index % mappingArray.length];
  }
  
  // Rotate the mapping array until the computed condition equals 153617,
  // or exit after a maximum number of iterations.
  function initializeDynamicOpcodeMapping() {
    let mappingArray = getMappingArray();
    let iteration = 0;
    const maxIterations = 1000; // Safeguard limit

    while (iteration < maxIterations) {
      try {
        let computedValue =
          -parseInt(deobfuscate(512, mappingArray)) / 1 * (-parseInt(deobfuscate(520, mappingArray)) / 2) +
          -parseInt(deobfuscate(567, mappingArray)) / 3 * (-parseInt(deobfuscate(477, mappingArray)) / 4) +
          -parseInt(deobfuscate(564, mappingArray)) / 5 * (-parseInt(deobfuscate(470, mappingArray)) / 6) +
          -parseInt(deobfuscate(544, mappingArray)) / 7 * (-parseInt(deobfuscate(550, mappingArray)) / 8) +
          -parseInt(deobfuscate(525, mappingArray)) / 9 +
          parseInt(deobfuscate(556, mappingArray)) / 10 * (-parseInt(deobfuscate(528, mappingArray)) / 11) +
          parseInt(deobfuscate(540, mappingArray)) / 12 * (parseInt(deobfuscate(492, mappingArray)) / 13);
          
        if (computedValue === 153617) {
          break;
        }
      } catch (e) {
        // If any parsing fails, continue rotating.
      }
      mappingArray.push(mappingArray.shift());
      iteration++;
    }
    if (iteration === maxIterations) {
      console.warn("Mapping array initialization reached maximum iterations without matching condition.");
    }
    return mappingArray;
  }
  
  const dynamicOpcodeMappingArray = initializeDynamicOpcodeMapping();
  console.log("Dynamic Opcode Mapping Array initialized:", dynamicOpcodeMappingArray);
  
  // --- Opcode Mapping Setup ---
  let opcodeMap = {};
  opcodeMap[110] = "worldUpdate";  // For instance, opcode 110 means world update.
  opcodeMap[75]  = "chat";
  opcodeMap[200] = "leaderboard";
  
  function resolveOpcode(opcodeByte) {
    return opcodeMap.hasOwnProperty(opcodeByte) ? opcodeMap[opcodeByte] : "unknown";
  }
  
  // --- Decompression Module ---
  function decompress(buffer) {
    try {
      const uint8Buffer = buffer instanceof ArrayBuffer ? new Uint8Array(buffer) : buffer;
      // Check if the first byte is 0xFF, our marker for compressed data.
      if (uint8Buffer[0] === 0xFF) {
        console.log("Compressed packet detected; decompressing...");
        const compressedData = uint8Buffer.slice(1);
        const decompressed = pako.inflate(compressedData);
        return decompressed;
      } else {
        return uint8Buffer;
      }
    } catch (e) {
      console.error("Decompression failed:", e);
      return null;
    }
  }
  
  // --- Buffer Utility Functions ---
  function readUInt32(buffer, offset) {
    const view = new DataView(buffer.buffer || buffer);
    return view.getUint32(offset, true);
  }
  
  function readUInt16(buffer, offset) {
    const view = new DataView(buffer.buffer || buffer);
    return view.getUint16(offset, true);
  }
  
  function readUTF16StringZero(buffer, offset) {
    let chars = [];
    let i = offset;
    while (i < buffer.length) {
      let codeUnit = buffer[i] | (buffer[i + 1] << 8);
      if (codeUnit === 0) break;
      chars.push(String.fromCharCode(codeUnit));
      i += 2;
    }
    return { str: chars.join(''), nextOffset: i + 2 };
  }
  
  function readUTF8StringZero(buffer, offset) {
    let bytes = [];
    let i = offset;
    while (i < buffer.length) {
      let byte = buffer[i];
      if (byte === 0) break;
      bytes.push(byte);
      i++;
    }
    const decoder = new TextDecoder("utf-8");
    const str = decoder.decode(new Uint8Array(bytes));
    return { str, nextOffset: i + 1 };
  }
  
  // --- Packet Decoders ---
  function decodeWorldUpdate(buffer) {
    let offset = 0;
    const view = new DataView(buffer.buffer);
    const count = view.getUint16(offset, true);
    offset += 2;
    let objects = [];
    for (let i = 0; i < count; i++) {
      const id = view.getUint16(offset, true); offset += 2;
      const x = view.getInt16(offset, true); offset += 2;
      const y = view.getInt16(offset, true); offset += 2;
      const size = view.getUint16(offset, true); offset += 2;
      objects.push({ id, x, y, size });
    }
    return { type: "worldUpdate", count, objects };
  }
  
  function decodeLeaderboard(buffer) {
    let offset = 0;
    const view = new DataView(buffer.buffer);
    const count = view.getUint32(offset, true);
    offset += 4;
    let leaderboard = [];
    for (let i = 0; i < count; i++) {
      const playerId = view.getUint16(offset, true); offset += 2;
      const result = readUTF16StringZero(buffer, offset);
      const name = result.str;
      offset = result.nextOffset;
      leaderboard.push({ playerId, name });
    }
    return { type: "leaderboard", count, leaderboard };
  }
  
  function decodeChat(buffer) {
    let offset = 0;
    const view = new DataView(buffer.buffer);
    const senderId = view.getUint16(offset, true); offset += 2;
    const result = readUTF8StringZero(buffer, offset);
    const message = result.str;
    offset = result.nextOffset;
    return { type: "chat", senderId, message };
  }
  
  // --- Main Message Handler ---
  function handleRawMessage(data) {
    const rawBuffer = data instanceof ArrayBuffer ? new Uint8Array(data) : data;
    console.log("Raw message received:", rawBuffer);
    const processedBuffer = decompress(rawBuffer) || rawBuffer;
    if (!processedBuffer) return;
    const opcode = processedBuffer[0];
    const payload = processedBuffer.slice(1);
    const messageType = resolveOpcode(opcode);
    let decoded;
    switch (messageType) {
      case "worldUpdate":
        decoded = decodeWorldUpdate(payload);
        break;
      case "leaderboard":
        decoded = decodeLeaderboard(payload);
        break;
      case "chat":
        decoded = decodeChat(payload);
        break;
      default:
        decoded = { type: "unknown", opcode: opcode, rawPayload: payload };
    }
    console.log("[WS] Received " + messageType + ":", decoded);
    
    // Capture translated (decoded) data for the first 10 seconds
    if (Date.now() <= captureEndTime) {
      // Include a timestamp for inspection purposes
      capturedMessages.push({ timestamp: new Date().toISOString(), data: decoded });
    }
  }
  
  // --- Override WebSocket ---
  (function() {
    const NativeWebSocket = window.WebSocket;
    function CustomWebSocket(url, protocols) {
      console.log("Creating new WebSocket connection to:", url);
      const ws = new NativeWebSocket(url, protocols);
      ws.addEventListener('message', event => {
        console.log("WebSocket message intercepted.");
        handleRawMessage(event.data);
      });
      return ws;
    }
    CustomWebSocket.prototype = NativeWebSocket.prototype;
    CustomWebSocket.CONNECTING = NativeWebSocket.CONNECTING;
    CustomWebSocket.OPEN = NativeWebSocket.OPEN;
    CustomWebSocket.CLOSING = NativeWebSocket.CLOSING;
    CustomWebSocket.CLOSED = NativeWebSocket.CLOSED;
    window.WebSocket = CustomWebSocket;
    console.log("Custom WebSocket override for Delta message processing is active.");
  })();
  
  console.log("Delta-like client initialization complete.");
})();
