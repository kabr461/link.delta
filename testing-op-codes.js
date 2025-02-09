console.log("[WebSocket Debug] Initializing WebSocket Analyzer...");

(function () {
    'use strict';

    let lastSummaryTime = Date.now();

    // Opcode registry for classification
    const opcodeRegistry = {};
    let opcodeSummary = {};
    const loggedOpcodes = new Set();

    function logOpcodeOnce(opcode) {
        if (!loggedOpcodes.has(opcode)) {
            console.log(`Opcode ${opcode} detected for the first time.`);
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
        if (Date.now() - lastSummaryTime > 10000) {
            console.clear();
            console.log("[CustomWebSocket] Opcode Frequency Summary (Last 10s)");
            console.table(opcodeSummary);
            opcodeSummary = {};
            lastSummaryTime = Date.now();
        }
    }

    function processMessageOpcode(data) {
        if (data.rawMessage) {
            try {
                const messageText = new TextDecoder("utf-8").decode(data.rawMessage);
                console.log(`[Message Sent] ${messageText}`);
                // Normalize message (if needed)
                const cleanedMessage = messageText.replace(/[^\x20-\x7E]/g, "");
                if (cleanedMessage.includes("UJ")) {
                    console.log("UJ detected!");
                }
            } catch (e) {
                console.warn("[Message Parsing Error]", e);
            }
        } else {
            console.warn("[Opcode 25] No message data found.");
        }
    }

    function processBinaryData(buffer) {
        const dataArray = new Uint8Array(buffer);
        if (dataArray.length >= 2) {
            const opcode = dataArray[0];
            const signalStrength = dataArray[1];
            const rawMessage = buffer.slice(2);
            processSignal({ opcode, signalStrength, messageSize: dataArray.length, rawMessage });
        }
    }

    // --- Override WebSocket.prototype.send early ---
    const originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function(data) {
        // Process ArrayBuffer messages (assumed to contain a two-byte header with opcode)
        if (data instanceof ArrayBuffer) {
            let fullArray = new Uint8Array(data);
            if (fullArray.length >= 2 && fullArray[0] === 25) { // Only for opcode 25
                let payload = fullArray.slice(2);
                let messageText = new TextDecoder("utf-8").decode(payload);
                if (messageText.includes("UJ")) {
                    console.log("UJ detected in outgoing ArrayBuffer message; blocking message.");
                    return; // Block the message.
                }
            }
            originalSend.call(this, data);
            return;
        }
        // Process string messages
        if (typeof data === "string") {
            if (data.includes("UJ")) {
                console.log("UJ detected in outgoing string message; blocking message.");
                return;
            }
            originalSend.call(this, data);
            return;
        }
        // Process Blob messages asynchronously
        if (data instanceof Blob) {
            data.text().then(text => {
                if (text.includes("UJ")) {
                    console.log("UJ detected in outgoing Blob message; blocking message.");
                    // Block message: do not call originalSend.
                } else {
                    originalSend.call(this, data);
                }
            }).catch(e => {
                console.error("Error reading Blob:", e);
                originalSend.call(this, data);
            });
            return;
        }
        // For any other data type, send as-is.
        originalSend.call(this, data);
    };

    // --- Override addEventListener for "message" to process incoming messages ---
    const originalAddEventListener = WebSocket.prototype.addEventListener;
    WebSocket.prototype.addEventListener = function(type, listener, options) {
        if (type === "message") {
            const newListener = function(event) {
                if (event.data instanceof ArrayBuffer) {
                    processBinaryData(event.data);
                } else if (event.data instanceof Blob) {
                    event.data.arrayBuffer().then(buffer => processBinaryData(buffer));
                }
                listener.call(this, event);
            };
            originalAddEventListener.call(this, type, newListener, options);
        } else {
            originalAddEventListener.call(this, type, listener, options);
        }
    };

    // Expose a global function to analyze opcodes.
    window.analyzeOpcodes = function() {
        console.log("[CustomWebSocket] Opcode Registry Analysis:");
        console.table(opcodeRegistry);
    };

})();
