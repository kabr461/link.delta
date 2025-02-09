console.log("[WebSocket Debug] Initializing WebSocket Analyzer...");

(function () {
    'use strict';

    // --- Global Variables and Configuration ---
    // Registry to track opcodes and frequency statistics.
    const opcodeRegistry = {};
    let opcodeSummary = {};
    let lastSummaryTime = Date.now();
    const loggedOpcodes = new Set();

    // Configure the TextDecoder.
    // By default, we assume UTF-8 encoding.
    let decoder = new TextDecoder("utf-8");

    // Uncomment one of these lines if you suspect a different encoding:
    // decoder = new TextDecoder("utf-16le"); // Use if the data is in UTF-16 little-endian.
    // decoder = new TextDecoder("shift_jis"); // Use if the data is encoded in Shift_JIS.

    // --- Helper Functions ---
    // Logs each new opcode only once.
    function logOpcodeOnce(opcode) {
        if (!loggedOpcodes.has(opcode)) {
            console.log(`Opcode ${opcode} detected for the first time.`);
            loggedOpcodes.add(opcode);
        }
    }

    // Processes a decoded signal object.
    function processSignal(data) {
        if (!data || data.opcode === undefined) return;

        const opcode = data.opcode;
        logOpcodeOnce(opcode);

        // Special handling for opcode 25: Message Sending.
        if (opcode === 25) {
            processMessageOpcode(data);
        }

        const signalStrength = data.signalStrength || 0;
        const messageSize = data.messageSize || 0;

        // Update the opcode registry.
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

        // Update the opcode summary.
        if (!opcodeSummary[opcode]) {
            opcodeSummary[opcode] = 1;
        } else {
            opcodeSummary[opcode] += 1;
        }

        // Every 10 seconds, log a summary of opcode frequencies.
        if (Date.now() - lastSummaryTime > 30000) {
            console.clear();
            console.log("[CustomWebSocket] Opcode Frequency Summary (Last 10s)");
            console.table(opcodeSummary);
            opcodeSummary = {};
            lastSummaryTime = Date.now();
        }
    }

    // Processes messages for opcode 25.
    function processMessageOpcode(data) {
        if (data.rawMessage) {
            try {
                // --- Debugging Step: Log Raw Bytes ---
                // Convert the raw message into a hexadecimal string for inspection.
                const byteArray = new Uint8Array(data.rawMessage);
                const hexBytes = Array.from(byteArray)
                    .map(b => b.toString(16).padStart(2, '0'))
                    .join(' ');
                console.log("Raw Bytes:", hexBytes);

                // --- Decode the Message ---
                // Use the configured TextDecoder to decode the raw bytes.
                const messageText = decoder.decode(data.rawMessage);
                console.log(`[Message Sent] ${messageText}`);

                // --- Optional: Clean the Message ---
                // Remove extra spaces, line breaks, and non-standard ASCII characters.
                const cleanedMessage = messageText.replace(/[^\x20-\x7E]/g, "");
                // For instance, check if the cleaned message contains a specific substring.
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

    // --- Custom WebSocket Implementation ---
    const OriginalWebSocket = window.WebSocket;

    class CustomWebSocket extends OriginalWebSocket {
        constructor(url, protocols) {
            super(url, protocols);
            console.log("[CustomWebSocket] Connecting to:", url);

            // Listen for incoming messages.
            this.addEventListener('message', (event) => {
                // Process binary data whether it's an ArrayBuffer or a Blob.
                if (event.data instanceof ArrayBuffer) {
                    processBinaryData(event.data);
                } else if (event.data instanceof Blob) {
                    event.data.arrayBuffer().then(buffer => processBinaryData(buffer));
                }
            });

            // Automatically try to reconnect on connection close.
            this.addEventListener('close', (event) => {
                console.warn("[CustomWebSocket] Connection closed:", event);
                setTimeout(() => {
                    console.log("[CustomWebSocket] Attempting to reconnect...");
                    window.WebSocket = new CustomWebSocket(this.url, this.protocols);
                }, 1000);
            });
        }
    }

    // Process binary data received over the WebSocket.
    // Assumes the first byte is the opcode and the second byte is the signal strength.
    // The remaining bytes constitute the raw message payload.
    function processBinaryData(buffer) {
        const dataArray = new Uint8Array(buffer);
        if (dataArray.length >= 2) {
            const opcode = dataArray[0];
            const signalStrength = dataArray[1];
            // Extract message payload starting from the 3rd byte.
            const rawMessage = buffer.slice(2);
            processSignal({ opcode, signalStrength, messageSize: dataArray.length, rawMessage });
        }
    }

    // Override the native WebSocket after a short delay.
    setTimeout(() => {
        window.WebSocket = CustomWebSocket;
        console.log("[CustomWebSocket] WebSocket Override Applied");
    }, 1000);

    // Expose a function to analyze the opcode registry.
    window.analyzeOpcodes = function () {
        console.log("[CustomWebSocket] Opcode Registry Analysis:");
        console.table(opcodeRegistry);
    };
})();
