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
                // Normalize message: remove extra spaces, line breaks, etc.
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

    // === Early Override of WebSocket.prototype.send ===
    const originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function(data) {
        // Check if data is an ArrayBuffer (binary message)
        if (data instanceof ArrayBuffer) {
            let fullArray = new Uint8Array(data);
            if (fullArray.length >= 2 && fullArray[0] === 25) { // Only process opcode 25 messages
                let payload = fullArray.slice(2);
                let messageText = new TextDecoder("utf-8").decode(payload);
                if (messageText.includes("UJ")) {
                    console.log("UJ detected in outgoing ArrayBuffer message; blocking message.");
                    return; // Block the message.
                }
            }
        }
        // Check if data is a string
        else if (typeof data === "string") {
            if (data.includes("UJ")) {
                console.log("UJ detected in outgoing string message; blocking message.");
                return; // Block the message.
            }
        }
        // Check if data is a Blob (asynchronously)
        else if (data instanceof Blob) {
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
        originalSend.call(this, data);
    };

    console.log("[CustomWebSocket] WebSocket.send override installed.");

    // === Optional: Override addEventListener for "message" to process incoming messages ===
    // (Your existing functions already handle incoming messages via processBinaryData.)
    const OriginalWebSocket = window.WebSocket; // (Preserve original for your CustomWebSocket below, if needed)

    // === Apply any additional overrides or create a custom WebSocket class if required ===
    // For now, we simply let the early send() override work.

    // Expose a global function to analyze opcodes if needed.
    window.analyzeOpcodes = function() {
        console.log("[CustomWebSocket] Opcode Registry Analysis:");
        console.table(opcodeRegistry);
    };

})();
