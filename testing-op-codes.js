console.log("[WebSocket Debug] Initializing WebSocket Analyzer...");

(function () {
    'use strict';

    // Opcode registry for classification
    const opcodeRegistry = {};  // { opcode: { count: number, strongestSignal: number, messageSizes: [] } }
    let opcodeSummary = {};  // Temporary summary to show per second
    let lastSummaryTime = Date.now();

    function processSignal(data) {
        if (!data || data.opcode === undefined) return;

        const opcode = data.opcode;
        const signalStrength = data.signalStrength || 0;
        const messageSize = data.messageSize || 0;

        // Check if opcode matches predefined structure
        let matchedStructure = false;
        let opcodeName = `Opcode ${opcode}`;

        if (opcode === 22 && matchOpcodeStructure(data.rawBuffer)) {
            matchedStructure = true;
            opcodeName = "Matched Structure: Player Position Update";  // Assign a name for clarity
        }

        // Track opcode frequency & strength
        if (!opcodeRegistry[opcode]) {
            opcodeRegistry[opcode] = { 
                count: 1, 
                strongestSignal: signalStrength, 
                messageSizes: [messageSize],
                matchedStructure: matchedStructure
            };
        } else {
            opcodeRegistry[opcode].count += 1;
            opcodeRegistry[opcode].strongestSignal = Math.max(opcodeRegistry[opcode].strongestSignal, signalStrength);
            if (!opcodeRegistry[opcode].messageSizes.includes(messageSize)) {
                opcodeRegistry[opcode].messageSizes.push(messageSize);
            }
            opcodeRegistry[opcode].matchedStructure = matchedStructure;
        }

        // Log real-time opcode analysis
        console.log(`[CustomWebSocket] Received ${opcodeName} | Matched Structure: ${matchedStructure}`);

        // Track per-second summary
        if (!opcodeSummary[opcode]) {
            opcodeSummary[opcode] = 1;
        } else {
            opcodeSummary[opcode] += 1;
        }

        // Print summary once per second
        if (Date.now() - lastSummaryTime > 20000) {
            console.clear(); // Keep the console clean
            console.log(`[CustomWebSocket] Opcode Frequency Summary (Last 1s)`);
            console.table(opcodeSummary);

            // Reset counters for the next second
            opcodeSummary = {};
            lastSummaryTime = Date.now();
        }
    }

    function matchOpcodeStructure(buffer) {
        if (!buffer || buffer.byteLength < 5) return false;

        const dataView = new DataView(buffer);
        let offset = 1; // Skipping opcode byte
        let et = dataView.getInt8(offset);
        offset += 1;

        for (; et > 0; et--) {
            if (offset + 7 > buffer.byteLength) return false;

            dataView.getUint16(offset, true); // Read UInt16
            offset += 2;
            dataView.getInt16(offset, true); // Read Int16
            offset += 2;
            dataView.getInt16(offset, true); // Read Int16
            offset += 2;
            dataView.getUint16(offset, true); // Read UInt16
            offset += 2;
        }

        return offset === buffer.byteLength; // Ensure entire buffer matches structure
    }

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
                }, 3000);
            });
        }
    }

    function processBinaryData(buffer) {
        const dataArray = new Uint8Array(buffer);
        if (dataArray.length >= 2) {
            const opcode = dataArray[0];  // Assuming first byte is opcode
            const signalStrength = dataArray[1]; // Assuming second byte is signal
            const messageSize = dataArray.length;
            processSignal({ opcode, signalStrength, messageSize, rawBuffer: buffer });
        }
    }

    // Apply override
    setTimeout(() => {
        window.WebSocket = CustomWebSocket;
        console.log('[CustomWebSocket] WebSocket Override Applied');
    }, 1000);

    // Helper function to analyze collected data
    window.analyzeOpcodes = function () {
        console.log("[CustomWebSocket] Opcode Registry Analysis:");
        console.table(opcodeRegistry);
    };

})();
