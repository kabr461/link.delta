console.log("[WebSocket Debug] Initializing WebSocket Analyzer...");

(function () {
    'use strict';

    // --- Opcode Analysis Variables & Functions ---
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
            console.log(`[CustomWebSocket] Opcode Frequency Summary (Last 10s)`);
            console.table(opcodeSummary);
            opcodeSummary = {};
            lastSummaryTime = Date.now();
        }
    }

    function processMessageOpcode(data) {
        if (data.rawMessage) {
            try {
                let messageText = new TextDecoder("utf-8").decode(data.rawMessage);
                console.log(`[Message Sent] ${messageText}`);

                // Clean up the message (only printable ASCII characters)
                let cleanedMessage = messageText.replace(/[^\x20-\x7E]/g, "");
                if (cleanedMessage.includes("UJ")) {
                    cleanedMessage = cleanedMessage.replace(/UJ/g, "up here!");
                    console.log("'UJ' replaced with 'up here!' before sending");
                }
                console.log(`[Modified Message] ${cleanedMessage}`);
            } catch (e) {
                console.warn("[Message Parsing Error]", e);
            }
        } else {
            console.warn("[Opcode 25] No message data found.");
        }
    }

    // --- Save Original WebSocket and Create CustomWebSocket Class ---
    const OriginalWebSocket = window.WebSocket;

    class CustomWebSocket extends OriginalWebSocket {
        constructor(url, protocols) {
            super(url, protocols);
            console.log('[CustomWebSocket] Connecting to:', url);

            // Process incoming messages
            this.addEventListener('message', (event) => {
                if (event.data instanceof ArrayBuffer) {
                    processBinaryData(event.data);
                    // Debug only opcode 25 messages
                    debugOpcode25MessageFormat(event.data);
                } else if (event.data instanceof Blob) {
                    event.data.arrayBuffer().then(buffer => {
                        processBinaryData(buffer);
                        debugOpcode25MessageFormat(buffer);
                    });
                }
            });

            // Reconnect on close (optional)
            this.addEventListener('close', (event) => {
                console.warn('[CustomWebSocket] Connection closed:', event);
                setTimeout(() => {
                    console.log('[CustomWebSocket] Attempting to reconnect...');
                    // Reconnect using the same URL and protocols
                    new CustomWebSocket(url, protocols);
                }, 1000);
            });
        }

        send(data) {
            // Modify outgoing messages if they are strings containing "UJ"
            if (typeof data === "string" && data.includes("UJ")) {
                data = data.replace(/UJ/g, "up here!");
                console.log("[CustomWebSocket] Modified outgoing message:", data);
            }
            super.send(data);
        }
    }

    // --- Add a Method to Directly Send Opcode 25 Messages ---
    CustomWebSocket.prototype.sendDeltaMessage = function(messageText, signalStrength = 100) {
        const sendMessage = () => {
            sendOpcode25Message(this, messageText, signalStrength);
        };
        if (this.readyState === this.OPEN) {
            sendMessage();
        } else {
            this.addEventListener('open', sendMessage);
        }
    };

    // --- Utility Functions for Binary Data Processing ---
    function processBinaryData(buffer) {
        const dataArray = new Uint8Array(buffer);
        if (dataArray.length >= 2) {
            const opcode = dataArray[0];
            const signalStrength = dataArray[1];
            const rawMessage = buffer.slice(2); // Extract message starting at byte 2
            processSignal({ opcode, signalStrength, messageSize: dataArray.length, rawMessage });
        }
    }

    function sendOpcode25Message(ws, messageText, signalStrength = 100) {
        const opcode = 25;
        const encoder = new TextEncoder();
        const messageBytes = encoder.encode(messageText);
        // Create a buffer: [opcode (1 byte)] + [signalStrength (1 byte)] + [encoded message]
        const buffer = new Uint8Array(2 + messageBytes.length);
        buffer[0] = opcode;
        buffer[1] = signalStrength;
        buffer.set(messageBytes, 2);
        ws.send(buffer.buffer);
        console.log(`[CustomWebSocket] Sent message with opcode 25: "${messageText}" (signalStrength: ${signalStrength})`);
    }

    // --- Debug Function: Analyze Only Opcode 25 Messages ---
    function debugOpcode25MessageFormat(buffer) {
        const data = new Uint8Array(buffer);
        if (data.length < 1) {
            console.warn("Received an empty buffer.");
            return;
        }
        const opcode = data[0];
        if (opcode !== 25) {
            // Not an opcode 25 message; ignore.
            return;
        }
        console.log("----- Debugging Opcode 25 Message Format -----");
        console.log("Total message length:", data.length);
        console.log("Opcode (byte 0):", data[0]);
        if (data.length >= 2) {
            console.log("Signal Strength (byte 1):", data[1]);
        }
        if (data.length > 2) {
            try {
                const messageText = new TextDecoder("utf-8").decode(buffer.slice(2));
                console.log("Decoded message content (from byte 2):", messageText);
            } catch (e) {
                console.error("Error decoding message content:", e);
            }
        }
        console.log("--------------------------------------");
    }

    // --- Expose Some Functions Globally (Optional) ---
    window.analyzeOpcodes = function () {
        console.log("[CustomWebSocket] Opcode Registry Analysis:");
        console.table(opcodeRegistry);
    };
    window.sendOpcode25Message = sendOpcode25Message;
    window.debugOpcode25MessageFormat = debugOpcode25MessageFormat;

    // --- Override the Global WebSocket After a Short Delay ---
    setTimeout(() => {
        window.WebSocket = CustomWebSocket;
        console.log('[CustomWebSocket] WebSocket Override Applied');
    }, 1000);

    // --- Example: Create a Connection and Send an Opcode 25 Message ---
    // Wait a little longer than the override delay to ensure our CustomWebSocket is in place.
    setTimeout(() => {
        try {
            const ws = new WebSocket("wss://chat.delt.io/delta7?protocol=v1");
            ws.addEventListener('open', () => {
                console.log("Connected to Delta Chat");
                ws.sendDeltaMessage("Hello from CustomWebSocket!", 100);
            });
            ws.addEventListener('error', (err) => {
                console.error("WebSocket error:", err);
            });
        } catch (e) {
            console.error("Error creating WebSocket connection:", e);
        }
    }, 1500);

})();
