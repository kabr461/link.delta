console.log("[WebSocket Debug] Initializing WebSocket Analyzer...");

(function () {
    'use strict';

    // ------------------------------------------------
    // 1. Opcode Registry and Frequency Tracking
    // ------------------------------------------------
    const opcodeRegistry = {};       // Detailed info per opcode
    let opcodeSummary = {};          // Frequency summary for a time window
    let lastSummaryTime = Date.now();
    const loggedOpcodes = new Set(); // To log a new opcode only once

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

        // Special handling for opcode 25 (Message Sending)
        if (opcode === 25) {
            processMessageOpcode(data);
        }

        // Record signal strength and message size
        const signalStrength = data.signalStrength || 0;
        const messageSize = data.messageSize || 0;

        if (!opcodeRegistry[opcode]) {
            opcodeRegistry[opcode] = {
                count: 1,
                strongestSignal: signalStrength,
                messageSizes: [messageSize]
            };
        } else {
            opcodeRegistry[opcode].count += 1;
            opcodeRegistry[opcode].strongestSignal = Math.max(opcodeRegistry[opcode].strongestSignal, signalStrength);
            if (!opcodeRegistry[opcode].messageSizes.includes(messageSize)) {
                opcodeRegistry[opcode].messageSizes.push(messageSize);
            }
        }

        opcodeSummary[opcode] = (opcodeSummary[opcode] || 0) + 1;

        // Every 10 seconds, clear and print an opcode summary.
        if (Date.now() - lastSummaryTime > 10000) {
            console.clear();
            console.log(`[CustomWebSocket] Opcode Frequency Summary (Last 10s)`);
            console.table(opcodeSummary);
            opcodeSummary = {};
            lastSummaryTime = Date.now();
        }
    }

    // ------------------------------------------------
    // 3. Process Opcode 25 (Message Sending) – Decoding
    // ------------------------------------------------
    function processMessageOpcode(data) {
        if (data.rawMessage) {
            // Create a full Uint8Array view of the received data.
            const fullBytes = new Uint8Array(data.rawMessage);
            console.log("Full received bytes:", 
                Array.from(fullBytes)
                    .map(b => b.toString(16).padStart(2, '0'))
                    .join(" "));

            // Create a view for the payload by skipping the first 2 header bytes.
            const payloadBytes = fullBytes.subarray(2);
            console.log("Payload bytes (skipping first 2 bytes):", 
                Array.from(payloadBytes)
                    .map(b => b.toString(16).padStart(2, '0'))
                    .join(" "));

            try {
                // --- Option 1: Decode using UTF-8 (default) ---
                let messageText = new TextDecoder("utf-8").decode(payloadBytes);
                console.log(`[Message Sent decoded as UTF-8] ${messageText}`);

                // --- Optional: If UTF-8 produces garbled text, try UTF-16LE ---
                /*
                let messageTextUTF16 = new TextDecoder("utf-16le").decode(payloadBytes);
                console.log(`[Message Sent decoded as UTF-16LE] ${messageTextUTF16}`);
                */

                // (Optional) Clean the decoded message to remove non-printable ASCII.
                const cleanedMessage = messageText.replace(/[^\x20-\x7E]/g, "");
                if (cleanedMessage.includes("UJ")) {
                    console.log("UJ detected in cleaned message!");
                }
            } catch (e) {
                console.warn("[Message Parsing Error]", e);
            }
        } else {
            console.warn("[Opcode 25] No message data found.");
        }
    }

    // ------------------------------------------------
    // 4. Custom WebSocket Class to Intercept Messages
    // ------------------------------------------------
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
                    window.WebSocket = new CustomWebSocket(this.url, this.protocols);
                }, 1000);
            });
        }
    }

    // ------------------------------------------------
    // 5. Process Incoming Binary Data from the WebSocket
    // ------------------------------------------------
    function processBinaryData(buffer) {
        const fullArray = new Uint8Array(buffer);
        // Ensure there are at least 2 bytes for header info.
        if (fullArray.length >= 2) {
            const opcode = fullArray[0];
            const signalStrength = fullArray[1];
            // Create a new ArrayBuffer for the payload (skipping the first 2 bytes).
            const rawMessage = buffer.byteLength > 2 ? buffer.slice(2) : new ArrayBuffer(0);
            processSignal({ opcode, signalStrength, messageSize: fullArray.length, rawMessage });
        }
    }

    // ------------------------------------------------
    // 6. Apply the Custom WebSocket Override
    // ------------------------------------------------
    setTimeout(() => {
        window.WebSocket = CustomWebSocket;
        console.log('[CustomWebSocket] WebSocket Override Applied');
    }, 1000);

    // Expose a global function to review the opcode registry.
    window.analyzeOpcodes = function () {
        console.log("[CustomWebSocket] Opcode Registry Analysis:");
        console.table(opcodeRegistry);
    };

})();
