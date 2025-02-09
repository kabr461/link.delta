console.log("[WebSocket Debug] Initializing WebSocket Analyzer...");

(function() {
  'use strict';

  // ------------------------------------------------
  // 1. Opcode Registry and Frequency Tracking
  // ------------------------------------------------
  const opcodeRegistry = {};
  let opcodeSummary = {};
  let lastSummaryTime = Date.now();
  const loggedOpcodes = new Set();
  function logOpcodeOnce(opcode) {
    if (!loggedOpcodes.has(opcode)) {
      console.log(`Opcode ${opcode} detected for the first time.`);
      loggedOpcodes.add(opcode);
    }
  }

  // ------------------------------------------------
  // 2. Process Incoming Signal Data
  // ------------------------------------------------
  function processSignal(data) {
    if (!data || data.opcode === undefined) return;
    const opcode = data.opcode;
    logOpcodeOnce(opcode);

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

    opcodeSummary[opcode] = (opcodeSummary[opcode] || 0) + 1;
    if (Date.now() - lastSummaryTime > 30000) {
      console.clear();
      console.log("[CustomWebSocket] Opcode Frequency Summary (Last 30s)");
      console.table(opcodeSummary);
      opcodeSummary = {};
      lastSummaryTime = Date.now();
    }
  }

  // Decode the incoming UTF-16LE payload for display
  function processMessageOpcode(data) {
    if (data.rawMessage) {
      const fullBytes = new Uint8Array(data.rawMessage);
      const payloadBytes = fullBytes.subarray(2);
      let messageText = "";
      for (let i = 0; i < payloadBytes.length; i += 2) {
        const code = payloadBytes[i] + (payloadBytes[i+1] << 8);
        messageText += String.fromCharCode(code);
      }
      console.log(`[Message Received] ${messageText}`);
    }
  }

  // ------------------------------------------------
  // 3. Custom WebSocket Class to Intercept Messages
  // ------------------------------------------------
  const OriginalWebSocket = window.WebSocket;
  class CustomWebSocket extends OriginalWebSocket {
    constructor(url, protocols) {
      super(url, protocols);
      this.addEventListener('message', (event) => {
        if (event.data instanceof ArrayBuffer) {
          processBinaryData(event.data);
        } else if (event.data instanceof Blob) {
          event.data.arrayBuffer().then(buffer => processBinaryData(buffer));
        }
      });
      this.addEventListener('close', (event) => {
        setTimeout(() => {
          window.WebSocket = new CustomWebSocket(this.url, this.protocols);
        }, 1000);
      });
    }
    send(data) {
      if (data instanceof ArrayBuffer) {
        const modifiedData = modifyMessageBeforeSend(data);
        super.send(modifiedData);
      } else {
        super.send(data);
      }
    }
  }

  // ------------------------------------------------
  // 4. Modify Outgoing Messages for opcode 25 (UTF-16LE)
  // ------------------------------------------------
  function modifyMessageBeforeSend(buffer) {
    const fullArray = new Uint8Array(buffer);
    if (fullArray.length < 2) return buffer;
    // Only process if opcode (first byte) equals 25 (0x19)
    if (fullArray[0] !== 25) return buffer;
    const header = fullArray.slice(0, 2);
    const payload = fullArray.slice(2);
    let found = false;
    const result = [];
    // Scan payload in 2-byte steps (UTF-16LE code units)
    for (let i = 0; i < payload.length;) {
      if (i <= payload.length - 4 &&
          payload[i]   === 0x55 && payload[i+1] === 0x00 &&
          payload[i+2] === 0x4A && payload[i+3] === 0x00) {
        console.log(`UJ detected at payload index ${i}`);
        console.log(`Replacing UJ at payload index ${i}`);
        found = true;
        // Replacement for "up there!" in UTF-16LE:
        // "u": 75 00, "p": 70 00, " ": 20 00, "t": 74 00, "h": 68 00,
        // "e": 65 00, "r": 72 00, "e": 65 00, "!": 21 00
        const replacement = [0x75,0x00,0x70,0x00,0x20,0x00,0x74,0x00,0x68,0x00,0x65,0x00,0x72,0x00,0x65,0x00,0x21,0x00];
        result.push(...replacement);
        i += 4;
      } else {
        result.push(payload[i]);
        i++;
      }
    }
    if (!found) return buffer;
    const newPayload = new Uint8Array(result);
    const newBuffer = new Uint8Array(header.length + newPayload.length);
    newBuffer.set(header, 0);
    newBuffer.set(newPayload, header.length);
    console.log("Modified outgoing chat message.");
    return newBuffer.buffer;
  }

  function processBinaryData(buffer) {
    const fullArray = new Uint8Array(buffer);
    if (fullArray.length >= 2) {
      const opcode = fullArray[0];
      const signalStrength = fullArray[1];
      const rawMessage = buffer.byteLength > 2 ? buffer.slice(2) : new ArrayBuffer(0);
      processSignal({ opcode, signalStrength, messageSize: fullArray.length, rawMessage });
    }
  }

  // ------------------------------------------------
  // 5. Apply the Custom WebSocket Override after 1s
  // ------------------------------------------------
  setTimeout(() => {
    window.WebSocket = CustomWebSocket;
    console.log("[CustomWebSocket] WebSocket Override Applied");
  }, 1000);

  // Expose a global function for opcode analysis.
  window.analyzeOpcodes = function() {
    console.log("[CustomWebSocket] Opcode Registry Analysis:");
    console.table(opcodeRegistry);
  };
})();
