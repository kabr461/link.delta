console.log("[WebSocket Debug] Initializing...");

(function () {
    "use strict";

    // ---------------------------------------------------
    // 1) Tracking Incoming Opcodes
    // ---------------------------------------------------
    const opcodeRegistry = {};  // { opcode: { count, strongestSignal, messageSizes: [] } }
    let opcodeSummary = {};     // for a 10s summary
    let lastSummaryTime = Date.now();

    function trackOpcode(opcode, signalStrength, messageSize) {
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

        if (!opcodeSummary[opcode]) {
            opcodeSummary[opcode] = 1;
        } else {
            opcodeSummary[opcode]++;
        }

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

            trackOpcode(opcode, signalStrength, dataArray.length);

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
            // Check for the sequence [85, 0, 74, 0]
            if (
                i + 3 < bytes.length &&
                bytes[i]   === 85 && bytes[i+1] === 0 &&
                bytes[i+2] === 74 && bytes[i+3] === 0
            ) {
                console.debug("[replaceUTF16_UJ] Found 'UJ' at index", i);
                output.push(...UP_HERE_UTF16);
                i += 3; // Skip the next 3 bytes as they form part of "UJ"
            } else {
                output.push(bytes[i]);
            }
        }
        return new Uint8Array(output);
    }

    // ---------------------------------------------------
    // 4) Custom WebSocket Override
    // ---------------------------------------------------
    const OriginalWebSocket = window.WebSocket;
    class CustomWebSocket extends OriginalWebSocket {
        constructor(url, protocols) {
            super(url, protocols);
            console.log("[CustomWebSocket] Connecting to:", url);

            this.addEventListener("message", (event) => {
                if (event.data instanceof ArrayBuffer) {
                    processBinaryData(event.data);
                } else if (event.data instanceof Blob) {
                    event.data.arrayBuffer().then(processBinaryData);
                }
            });

            this.addEventListener("close", (evt) => {
                console.warn("[CustomWebSocket] Connection closed:", evt);
                setTimeout(() => {
                    console.log("[CustomWebSocket] Reconnecting...");
                    window.WebSocket = new CustomWebSocket(this.url, this.protocols);
                }, 1000);
            });
        }

        send(data) {
            // Process binary data to perform byte-level replacement.
            if (data instanceof ArrayBuffer) {
                const originalBytes = new Uint8Array(data);
                
                // If the opcode (first byte) is 25, log the outgoing data before replacement.
                if (originalBytes[0] === 25) {
                    console.debug("[send opcode 25] Original message bytes:", originalBytes);
                }

                const replacedBytes = replaceUTF16_UJ(originalBytes);
                
                // Log the replaced bytes for opcode 25 messages.
                if (originalBytes[0] === 25) {
                    console.debug("[send opcode 25] Modified message bytes:", replacedBytes);
                }
                
                // Log if any replacement has occurred.
                if (
                    replacedBytes.length !== originalBytes.length ||
                    !replacedBytes.every((val, idx) => val === originalBytes[idx])
                ) {
                    console.log("[send()] Replaced 'UJ' -> 'up here!':", replacedBytes);
                }
                
                super.send(replacedBytes.buffer);
            } else {
                // Warn if the data is not binary (i.e., a string), since the replacement won't be applied.
                console.warn("[send()] Outgoing data is not binary. No replacement performed.");
                super.send(data);
            }
        }
    }

    // Apply the override after a short delay.
    setTimeout(() => {
        window.WebSocket = CustomWebSocket;
        console.log("[CustomWebSocket] Override Applied. Outgoing binary data will have UTF-16 'UJ' replaced with 'up here!'.");
    }, 1000);

    // Optional helper to analyze opcode data in the console.
    window.analyzeOpcodes = function () {
        console.log("[CustomWebSocket] Opcode Registry Analysis:");
        console.table(opcodeRegistry);
    };
})();
