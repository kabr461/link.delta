console.log("[WebSocket Debug] Initializing WebSocket Analyzer...");

(function () {
    "use strict";

    // --- CONFIG: The UTF-16 sequences we want to match/replace ---
    // "UJ" in UTF-16 Little Endian = [85, 0, 74, 0]
    const UJ_UTF16 = [85, 0, 74, 0];
    // "up here!" in UTF-16 Little Endian:
    //   u (117,0), p (112,0), ' ' (32,0), h (104,0), e (101,0),
    //   r (114,0), e (101,0), ! (33,0)
    const UP_HERE_UTF16 = [117,0,112,0,32,0,104,0,101,0,114,0,101,0,33,0];

    /**
     * Search a Uint8Array for every occurrence of [85,0,74,0]
     * and replace it with the bytes for "up here!" in UTF-16.
     */
    function replaceUTF16_UJ(bytes) {
        const output = [];
        for (let i = 0; i < bytes.length; i++) {
            // Check if we match the four-byte sequence U(85,0) + J(74,0)
            if (
                i + 3 < bytes.length &&
                bytes[i]   === 85 && bytes[i+1] === 0 && // 'U' => [85,0]
                bytes[i+2] === 74 && bytes[i+3] === 0    // 'J' => [74,0]
            ) {
                // Push the UTF-16 bytes for "up here!"
                output.push(...UP_HERE_UTF16);
                i += 3; // Skip the next 3 bytes (we already handled them)
            } else {
                // Otherwise, just copy the original byte
                output.push(bytes[i]);
            }
        }
        return new Uint8Array(output);
    }

    // We’ll keep a simple registry & summary for demonstration (optional)
    const opcodeRegistry = {};
    let opcodeSummary = {};
    let lastSummaryTime = Date.now();

    function trackOpcode(opcode, signalStrength, messageSize) {
        // Update registry
        if (!opcodeRegistry[opcode]) {
            opcodeRegistry[opcode] = { count: 1, strongestSignal: signalStrength, messageSizes: [messageSize] };
        } else {
            opcodeRegistry[opcode].count++;
            opcodeRegistry[opcode].strongestSignal = Math.max(opcodeRegistry[opcode].strongestSignal, signalStrength);
            if (!opcodeRegistry[opcode].messageSizes.includes(messageSize)) {
                opcodeRegistry[opcode].messageSizes.push(messageSize);
            }
        }

        // Update summary
        if (!opcodeSummary[opcode]) {
            opcodeSummary[opcode] = 1;
        } else {
            opcodeSummary[opcode]++;
        }

        // Print summary every 10s
        if (Date.now() - lastSummaryTime > 10000) {
            console.clear();
            console.log("[CustomWebSocket] Opcode Frequency Summary (Last 10s)");
            console.table(opcodeSummary);
            opcodeSummary = {};
            lastSummaryTime = Date.now();
        }
    }

    /**
     * Process incoming binary data:
     * - We assume first byte is opcode, second is signal
     * - Rest is message.
     */
    function processBinaryData(buffer) {
        const dataArray = new Uint8Array(buffer);
        if (dataArray.length >= 2) {
            const opcode = dataArray[0];
            const signalStrength = dataArray[1];
            const rawMessage = buffer.slice(2);

            // Log opcode usage & summary (optional)
            trackOpcode(opcode, signalStrength, dataArray.length);

            // If you want to see the raw message:
            if (opcode === 25) {
                console.log("[Incoming Opcode 25] Raw bytes:", new Uint8Array(rawMessage));
            }
        }
    }

    // Save the original WebSocket reference
    const OriginalWebSocket = window.WebSocket;

    /**
     * Custom WebSocket that overrides 'send()' to do our replacement.
     */
    class CustomWebSocket extends OriginalWebSocket {
        constructor(url, protocols) {
            super(url, protocols);
            console.log("[CustomWebSocket] Connecting to:", url);

            // Listen for messages
            this.addEventListener('message', (event) => {
                if (event.data instanceof ArrayBuffer) {
                    processBinaryData(event.data);
                } else if (event.data instanceof Blob) {
                    event.data.arrayBuffer().then(buffer => processBinaryData(buffer));
                }
            });

            // Attempt to auto-reconnect
            this.addEventListener('close', (event) => {
                console.warn("[CustomWebSocket] Connection closed:", event);
                setTimeout(() => {
                    console.log("[CustomWebSocket] Attempting to reconnect...");
                    window.WebSocket = new CustomWebSocket(this.url, this.protocols);
                }, 1000);
            });
        }

        /**
         * Intercept and modify outgoing data before sending.
         */
        send(data) {
            // If it's an ArrayBuffer, do our byte-level replacement
            if (data instanceof ArrayBuffer) {
                const originalBytes = new Uint8Array(data);

                // --- OPTIONAL: If you only want to modify if it's opcode 25 in the FIRST byte:
                // if (originalBytes[0] === 25) { ... }

                // We'll do a universal approach: replace "UJ" in UTF-16 anywhere in the buffer.
                const replacedBytes = replaceUTF16_UJ(originalBytes);

                // If changed, log it
                if (
                    replacedBytes.length !== originalBytes.length ||
                    !replacedBytes.every((b, i) => b === originalBytes[i])
                ) {
                    console.log("[send()] 'UJ' → 'up here!' replaced in outgoing binary:", replacedBytes);
                }

                // Send the modified version
                super.send(replacedBytes.buffer);
            } else {
                // If it's a string or something else, just pass along
                super.send(data);
            }
        }
    }

    // Override the global WebSocket after a short delay
    setTimeout(() => {
        window.WebSocket = CustomWebSocket;
        console.log("[CustomWebSocket] WebSocket Override Applied");
    }, 1000);

    // Helper for debugging in the console
    window.analyzeOpcodes = function () {
        console.log("[CustomWebSocket] Opcode Registry Analysis:");
        console.table(opcodeRegistry);
    };

})();
