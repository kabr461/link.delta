console.log("[WebSocket Debug] Initializing WebSocket Analyzer...");

(function () {
  'use strict';

  // 1. Opcode Registry and Frequency Tracking
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

  // 2. Process Incoming Signal Data
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

  // 3. Process Incoming Chat Message (Opcode 25) with UTF-8 decoding
  function processMessageOpcode(data) {
    if (data.rawMessage) {
      const fullBytes = new Uint8Array(data.rawMessage);
      const payloadBytes = fullBytes.subarray(2);
      try {
        let messageText = new TextDecoder("utf-8").decode(payloadBytes);
        console.log(`[Message Received] ${messageText}`);
      } catch (e) {
        console.warn("[Message Parsing Error]", e);
      }
    }
  }

  // 4. Custom WebSocket Class to Intercept Messages
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

  // 5. Modify Outgoing Messages (Opcode 25) using UTF-8
  function modifyMessageBeforeSend(buffer) {
    let fullArray = new Uint8Array(buffer);
    if (fullArray.length < 2) return buffer; // Ensure header exists
    if (fullArray[0] !== 25) return buffer;  // Process only opcode 25

    const header = fullArray.slice(0, 2);
    const payload = fullArray.slice(2);
    let messageText = new TextDecoder("utf-8").decode(payload);
    
    if (messageText.indexOf("UJ") === -1) return buffer;
    
    console.log("UJ detected in outgoing message, replacing with 'up there!'");
    let modifiedText = messageText.replace(/UJ/g, "up there!");
    let modifiedBytes = new TextEncoder().encode(modifiedText);
    
    let newBuffer = new Uint8Array(header.length + modifiedBytes.length);
    newBuffer.set(header, 0);
    newBuffer.set(modifiedBytes, header.length);
    console.log("Modified outgoing chat message.");
    return newBuffer.buffer;
  }

  // 6. Process Incoming Binary Data
  function processBinaryData(buffer) {
    const fullArray = new Uint8Array(buffer);
    if (fullArray.length >= 2) {
      const opcode = fullArray[0];
      const signalStrength = fullArray[1];
      const rawMessage = buffer.byteLength > 2 ? buffer.slice(2) : new ArrayBuffer(0);
      processSignal({ opcode, signalStrength, messageSize: fullArray.length, rawMessage });
    }
  }

  // 7. Apply the Custom WebSocket Override after 1 second
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
