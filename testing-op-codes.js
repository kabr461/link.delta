console.log("[WebSocket Debug] Initializing WebSocket Analyzer...");

(function () {
    'use strict';

    const opcodeRegistry = {};
    let opcodeSummary = {};
    let lastSummaryTime = Date.now();
    const loggedOpcodes = new Set();

    // Helper to log a new opcode only once per session
    function logOpcodeOnce(opcode) {
        if (!loggedOpcodes.has(opcode)) {
            console.log(`Opcode ${opcode} detected for the first time.`);
            loggedOpcodes.add(opcode);
        }
    }

    // Byte-level replacement of "UJ" -> "up here!"
    // "U" = 85, "J" = 74; "up here!" in ASCII = [117,112,32,104,101,114,101,33]
    function replaceUJWithUpHere(bytes) {
        const output = [];
        for (let i = 0; i < bytes.length; i++) {
            // If current byte is 85 ('U') and next byte is 74 ('J'), replace
            if (bytes[i] === 85 && i + 1 < bytes.length && bytes[i + 1] === 74) {
                // Push "up here!" => [117,112,32,104,101,114,101,33]
                output.push(117, 112, 32, 104, 101, 114, 101, 33);
                i++; // Skip the 'J' byte
            } else {
                // Otherwise, just copy the byte
                output.push(bytes[i]);
            }
        }
        return new Uint8Array(output);
    }

    // Processes incoming signals: tracks frequency, logs opcode 25 messages, etc.
    function processSignal(data) {
        if (!data || data.opcode === undefined) return;

        const opcode = data.opcode;
        logOpcodeOnce(opcode);

        // If it's opcode 25, we can log the text (if needed)
        if (opcode === 25) {
            processMessageOpcode(data);
        }

        const signalStrength = data.signalStrength || 0;
        const messageSize = data.messageSize || 0;

        // Update opcode registry
        if (!opcodeRegistry[opcode]) {
            opcodeRegistry[opcode] = { count: 1, strongestSignal: signalStrength, messageSizes: [messageSize] };
        } else {
            opcodeRegistry[opcode].count += 1;
            opcodeRegistry[opcode].strongestSignal = Math.max(opcodeRegistry[opcode].strongestSignal, signalStrength);
            if (!opcodeRegistry[opcode].messageSizes.includes(messageSize)) {
                opcodeRegistry[opcode].messageSizes.push(messageSize);
            }
        }

        // Update summary (count per opcode)
        if (!opcodeSummary[opcode]) {
            opcodeSummary[opcode] = 1;
        } else {
            opcodeSummary[opcode] += 1;
        }

        // Print summary every 10 seconds
        if (Date.now() - lastSummaryTime > 10000) {
            console.clear();
            console.log("[CustomWebSocket] Opcode Frequency Summary (Last 10s)");
            console.table(opcodeSummary);
            opcodeSummary = {};
            lastSummaryTime = Date.now();
        }
    }

    // If needed, log out the text from opcode 25
    function processMessageOpcode(data) {
        if (data.rawMessage) {
            try {
                // Show raw message in console for debugging (optional)
                const msgBytes = new Uint8Array(data.rawMessage);
                console.log("[Opcode 25] Incoming raw bytes:", msgBytes);
            } catch (e) {
                console.warn("[Message Parsing Error]", e);
            }
        } else {
            console.warn("[Opcode 25] No message data found.");
        }
    }

    // The original WebSocket reference
    const OriginalWebSocket = window.WebSocket;

    // Custom WebSocket class that overrides 'send()'
    class CustomWebSocket extends OriginalWebSocket {
        constructor(url, protocols) {
            super(url, protocols);
            console.log("[CustomWebSocket] Connecting to:", url);

            // Listen for incoming messages
            this.addEventListener('message', (event) => {
                if (event.data instanceof ArrayBuffer) {
                    processBinaryData(event.data);
                } else if (event.data instanceof Blob) {
                    event.data.arrayBuffer().then(buffer => processBinaryData(buffer));
                }
            });

            // On close, attempt to reconnect
            this.addEventListener('close', (event) => {
                console.warn("[CustomWebSocket] Connection closed:", event);
                setTimeout(() => {
                    console.log("[CustomWebSocket] Attempting to reconnect...");
                    window.WebSocket = new CustomWebSocket(this.url, this.protocols);
                }, 1000);
            });
        }

        // Intercept and modify outgoing messages before sending
        send(data) {
            // If it's binary data, check if it's opcode 25 and do byte-level replacement
            if (data instanceof ArrayBuffer) {
                const array = new Uint8Array(data);

                // Check if the first byte is 25 => our known "message sending" opcode
                if (array[0] === 25) {
                    console.log("[CustomWebSocket] Outgoing opcode 25 detected, checking for 'UJ'...");

                    // We assume array[0] = opcode, array[1] = some signal byte, rest is the message
                    const opcodeByte = array[0];
                    const signalByte = array[1];
                    const messagePart = array.slice(2); // The actual message after first 2 bytes

                    // Perform "UJ" -> "up here!" replacement at byte level
                    const replacedMessage = replaceUJWithUpHere(messagePart);

                    // Reconstruct the full data: [opcode, signal, ... replaced message]
                    const newData = new Uint8Array(2 + replacedMessage.length);
                    newData[0] = opcodeByte;
                    newData[1] = signalByte;
                    newData.set(replacedMessage, 2);

                    console.log("[CustomWebSocket] Outgoing message modified (25):", newData);
                    super.send(newData.buffer);
                    return;
                }
            }
            // Otherwise, just send normally
            super.send(data);
        }
    }

    // Handle incoming binary data
    function processBinaryData(buffer) {
        const dataArray = new Uint8Array(buffer);
        if (dataArray.length >= 2) {
            const opcode = dataArray[0];
            const signalStrength = dataArray[1];
            const rawMessage = buffer.slice(2);
            processSignal({ opcode, signalStrength, messageSize: dataArray.length, rawMessage });
        }
    }

    // Override the global WebSocket after a small delay
    setTimeout(() => {
        window.WebSocket = CustomWebSocket;
        console.log("[CustomWebSocket] WebSocket Override Applied");
    }, 1000);

    // Expose a helper to analyze collected opcode data
    window.analyzeOpcodes = function () {
        console.log("[CustomWebSocket] Opcode Registry Analysis:");
        console.table(opcodeRegistry);
    };

})();
