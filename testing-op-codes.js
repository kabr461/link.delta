console.log("[WebSocket Debug] Initializing...");

(function () {
    "use strict";

    // ---------------------------------------------------
    // 1) Tracking Incoming Opcodes
    // ---------------------------------------------------
    const opcodeRegistry = {};
    let opcodeSummary = {};
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
    // ---------------------------------------------------
    function processBinaryData(buffer) {
        const dataArray = new Uint8Array(buffer);
        if (dataArray.length >= 2) {
            const opcode = dataArray[0];
            const signalStrength = dataArray[1];
            const rawMessage = buffer.slice(2);

            // Track usage
            trackOpcode(opcode, signalStrength, dataArray.length);

            // Log raw bytes if opcode 25
            if (opcode === 25) {
                console.log("[Incoming Opcode 25] Raw bytes:", new Uint8Array(rawMessage));
            }
        }
    }

    // ---------------------------------------------------
    // 3) Replace "UJ" (UTF-16 LE) with "up here!" (UTF-16 LE) - with debug
    // ---------------------------------------------------
    const UJ_UTF16 = [85, 0, 74, 0]; // 'U'(85,0) 'J'(74,0)
    const UP_HERE_UTF16 = [117,0,112,0,32,0,104,0,101,0,114,0,101,0,33,0]; // "up here!"

    function replaceUTF16_UJ(bytes) {
        const output = [];
        let replacedSomething = false;

        for (let i = 0; i < bytes.length; i++) {
            // Debug: show each 4-byte chunk we check
            if (i + 3 < bytes.length) {
                const chunk = [bytes[i], bytes[i+1], bytes[i+2], bytes[i+3]];
                // e.g. [85,0,74,0] ...
                // console.log("[Debug] Checking 4-byte chunk at index", i, chunk);
            }

            if (
                i + 3 < bytes.length &&
                bytes[i]   === 85 && bytes[i+1] === 0 &&  // 'U'
                bytes[i+2] === 74 && bytes[i+3] === 0      // 'J'
            ) {
                console.log("[Debug] Found 'UJ' at index", i, "Replacing with 'up here!'...");
                output.push(...UP_HERE_UTF16);
                i += 3; 
                replacedSomething = true;
            } else {
                output.push(bytes[i]);
            }
        }

        return {
            replacedBytes: new Uint8Array(output),
            replaced: replacedSomething
        };
    }

    // ---------------------------------------------------
    // Original WebSocket and override
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
            console.log("[send()] Called with:", data);
            if (data instanceof ArrayBuffer) {
                const originalBytes = new Uint8Array(data);
                console.log("[send()] Outgoing raw bytes:", originalBytes);

                // Perform replacement
                const { replacedBytes, replaced } = replaceUTF16_UJ(originalBytes);

                if (replaced) {
                    console.log("[send()] Replaced 'UJ' -> 'up here!':", replacedBytes);
                } else {
                    console.log("[send()] No 'UJ' found, sending as-is.");
                }

                super.send(replacedBytes.buffer);
            } else {
                // If it's a string or something else
                console.log("[send()] Non-binary data, sending as-is.");
                super.send(data);
            }
        }
    }

    // ---------------------------------------------------
    // Override global WebSocket
    // ---------------------------------------------------
    setTimeout(() => {
        window.WebSocket = CustomWebSocket;
        console.log("[CustomWebSocket] Override Applied. Tracking opcodes + replacing 'UJ' in UTF-16 LE.");
    }, 1000);

    // Optional helper
    window.analyzeOpcodes = function () {
        console.log("[CustomWebSocket] Opcode Registry Analysis:");
        console.table(opcodeRegistry);
    };
})();
