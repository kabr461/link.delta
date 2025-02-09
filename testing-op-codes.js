console.log("[WebSocket Debug] Initializing WebSocket Analyzer...");

(function () {
    'use strict';

    let lastSummaryTime = Date.now();
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
            if (processMessageOpcode(data)) return; // Block processing if UJ detected
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
                    console.log("🚨 UJ detected! Blocking message.");
                    return true; // Signal to block this message
                }
            } catch (e) {
                console.warn("[Message Parsing Error]", e);
            }
        } else {
            console.warn("[Opcode 25] No message data found.");
        }
        return false;
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

    // === WebSocket SEND Override (Block Outgoing Messages) ===
    const originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function(data) {
        if (data instanceof ArrayBuffer) {
            let fullArray = new Uint8Array(data);
            if (fullArray.length >= 2 && fullArray[0] === 25) { // Only process opcode 25 messages
                let payload = fullArray.slice(2);
                let messageText = new TextDecoder("utf-8").decode(payload);
                if (messageText.includes("UJ")) {
                    console.log("🚨 UJ detected in outgoing ArrayBuffer message; Blocking message.");
                    return; // Block the message.
                }
            }
        } 
        else if (typeof data === "string") {
            if (data.includes("UJ")) {
                console.log("🚨 UJ detected in outgoing string message; Blocking message.");
                return; // Block the message.
            }
        } 
        else if (data instanceof Blob) {
            data.text().then(text => {
                if (text.includes("UJ")) {
                    console.log("🚨 UJ detected in outgoing Blob message; Blocking message.");
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

    // === WebSocket MESSAGE Override (Block Incoming Messages) ===
    const originalWebSocket = window.WebSocket;

    window.WebSocket = function (...args) {
        const wsInstance = new originalWebSocket(...args);

        wsInstance.addEventListener("message", (event) => {
            try {
                let data = event.data;

                // Handle ArrayBuffer (Binary)
                if (data instanceof ArrayBuffer) {
                    let fullArray = new Uint8Array(data);
                    if (fullArray.length >= 2 && fullArray[0] === 25) {
                        let payload = fullArray.slice(2);
                        let messageText = new TextDecoder("utf-8").decode(payload);
                        if (messageText.includes("UJ")) {
                            console.log("🚨 UJ detected in incoming ArrayBuffer message; Blocking message.");
                            event.stopImmediatePropagation();
                            return; // Block the message.
                        }
                    }
                } 
                // Handle String Messages
                else if (typeof data === "string") {
                    if (data.includes("UJ")) {
                        console.log("🚨 UJ detected in incoming string message; Blocking message.");
                        event.stopImmediatePropagation();
                        return; // Block the message.
                    }
                }
                // Handle Blob Messages (async check)
                else if (data instanceof Blob) {
                    data.text().then(text => {
                        if (text.includes("UJ")) {
                            console.log("🚨 UJ detected in incoming Blob message; Blocking message.");
                            event.stopImmediatePropagation();
                        } else {
                            wsInstance.dispatchEvent(new MessageEvent("message", { data }));
                        }
                    }).catch(e => {
                        console.error("Error reading Blob:", e);
                        wsInstance.dispatchEvent(new MessageEvent("message", { data }));
                    });
                    return;
                }

                wsInstance.dispatchEvent(new MessageEvent("message", { data })); // Forward normal messages

            } catch (error) {
                console.error("Error processing WebSocket message:", error);
            }
        });

        return wsInstance;
    };

    // Expose a global function to analyze opcodes if needed.
    window.analyzeOpcodes = function() {
        console.log("[CustomWebSocket] Opcode Registry Analysis:");
        console.table(opcodeRegistry);
    };

})();  
