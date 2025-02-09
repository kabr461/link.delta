console.log("[WebSocket Debug] Initializing...");

(function () {
    "use strict";

    // ---------------------------------------------------
    // 1) Tracking Incoming Opcodes
    // ---------------------------------------------------
    const opcodeRegistry = {};  // { opcode: { count, strongestSignal, messageSizes: [] } }
    let opcodeSummary = {};     // for a 10s summary
    let lastSummaryTime = Date.now();

    // Simple function to record opcode usage
    function trackOpcode(opcode, signalStrength, messageSize) {
        // Update opcode registry
        if (!opcodeRegistry[opcode]) {
            opcodeRegistry[opcode] = {
                count: 1,
                strongestSignal: signalStrength,
                messageSizes: [messageSize]
            };
        } else {
            opcodeRegistry[opcode].count++;
            opcodeRegistry[opcode].strongestSignal = Math.max(
                opcodeRegistry[opcode].strongestSignal,
                signalStrength
            );
            if (!opcodeRegistry[opcode].messageSizes.includes(messageSize)) {
                opcodeRegistry[opcode].messageSizes.push(messageSize);
            }
        }

        // Update per-10s summary
        if (!opcodeSummary[opcode]) {
            opcodeSummary[opcode] = 1;
        } else {
            opcodeSummary[opcode]++;
        }

        // Every 10s, print summary & reset
        if (Date.now() - lastSummaryTime > 10000) {
            console.clear();
            console.log("[CustomWebSocket] Opcode Frequency Summary (Last 10s):");
            console.table(opcodeSummary);
            opcodeSummary = {};
            lastSummaryTime = Date.now();
        }
    }

    // ---------------------------------------------------
    // 2) Process Incoming Binary Data
    //    (Assuming byte0=opcode, byte1=signal, rest=message)
    // ---------------------------------------------------
    function processBinaryData(buffer) {
        const dataArray = new Uint8Array(buffer);
        if (dataArray.length >= 2) {
            const opcode = dataArray[0];
            const signalStrength = dataArray[1];
            const rawMessage = buffer.slice(2);

            // Track usage
            trackOpcode(opcode, signalStrength, dataArray.length);

            // Log raw bytes if it’s opcode 25 (optional)
            if (opcode === 25) {
                console.log("[Incoming Opcode 25] Raw bytes:", new Uint8Array(rawMessage));
            }
        }
    }

    // ---------------------------------------------------
    // 3) Replace "UJ" (UTF-16 LE) with "up here!" (UTF-16 LE)
    // ---------------------------------------------------
    // "UJ" in UTF-16 LE = [85, 0, 74, 0]
    const UJ_UTF16 = [85, 0, 74, 0];
    // "up here!" in UTF-16 LE = [117,0,112,0,32,0,104,0,101,0,114,0,101,0,33,0]
    const UP_HERE_UTF16 = [117,0,112,0,32,0,104,0,101,0,114,0,101,0,33,0];

    function replaceUTF16_UJ(bytes) {
        const output = [];
        for (let i = 0; i < bytes.length; i++) {
            // Check for [85,0,74,0]
            if (
                i + 3 < bytes.length &&
                bytes[i]   === 85 && bytes[i+1] === 0 &&
                bytes[i+2] === 74 && bytes[i+3] === 0
            ) {
                // Push "up here!" in UTF-16
                output.push(...UP_HERE_UTF16);
                i += 3; // Skip next 3 bytes
            } else {
                output.push(bytes[i]);
            }
        }
        return new Uint8Array(output);
    }

    // Keep original WebSocket reference
    const OriginalWebSocket = window.WebSocket;

    // ---------------------------------------------------
    // 4) Custom WebSocket Override
    // ---------------------------------------------------
    class CustomWebSocket extends OriginalWebSocket {
        constructor(url, protocols) {
            super(url, protocols);
            console.log("[CustomWebSocket] Connecting to:", url);

            // Listen for incoming messages
            this.addEventListener("message", (event) => {
                if (event.data instanceof ArrayBuffer) {
                    processBinaryData(event.data);
                } else if (event.data instanceof Blob) {
                    event.data.arrayBuffer().then(processBinaryData);
                }
            });

            // Auto-reconnect on close
            this.addEventListener("close", (evt) => {
                console.warn("[CustomWebSocket] Connection closed:", evt);
                setTimeout(() => {
                    console.log("[CustomWebSocket] Reconnecting...");
                    window.WebSocket = new CustomWebSocket(this.url, this.protocols);
                }, 1000);
            });
        }

        // Intercept and modify outgoing messages
        send(data) {
            // If it's binary, do a raw byte-level replacement
            if (data instanceof ArrayBuffer) {
                const originalBytes = new Uint8Array(data);
                const replacedBytes = replaceUTF16_UJ(originalBytes);

                // Log if the data changed
                if (
                    replacedBytes.length !== originalBytes.length ||
                    !replacedBytes.every((val, idx) => val === originalBytes[idx])
                ) {
                    console.log("[send()] Replaced 'UJ' -> 'up here!':", replacedBytes);
                }

                // Send the modified data
                super.send(replacedBytes.buffer);
            } else {
                // Otherwise, send as normal (e.g., string data)
                super.send(data);
            }
        }
    }

    // Apply the override after a short delay
    setTimeout(() => {
        window.WebSocket = CustomWebSocket;
        console.log("[CustomWebSocket] Override Applied. UTF-16 'UJ' → 'up here!' in outgoing data.");
    }, 1000);

    // Optional helper to analyze opcode data in console
    window.analyzeOpcodes = function () {
        console.log("[CustomWebSocket] Opcode Registry Analysis:");
        console.table(opcodeRegistry);
    };
})();
