console.log("[WebSocket Debug] Initializing WebSocket Analyzer...");

(function () {
    'use strict';

    // Opcode registry for classification
    const opcodeRegistry = {};  // { opcode: { name: string | null, strongestSignal: number, count: number, messageSizes: [] } }

    // Tracking common message patterns
    const messagePatterns = {}; // { messageSize: [opcode1, opcode2, ...] }

    // Allow manual opcode naming
    window.setOpcodeName = function(opcode, name) {
        if (opcodeRegistry.hasOwnProperty(opcode)) {
            opcodeRegistry[opcode].name = name;
            console.log(`[CustomWebSocket] Opcode ${opcode} renamed to: ${name}`);
        } else {
            opcodeRegistry[opcode] = { name: name, strongestSignal: -Infinity, count: 0, messageSizes: [] };
            console.log(`[CustomWebSocket] Opcode ${opcode} registered with name: ${name}`);
        }
    };

    function processSignal(data) {
        if (!data || data.opcode === undefined) return;

        const opcode = data.opcode;
        const signalStrength = data.signalStrength || 0;
        const messageSize = data.messageSize || 0;

        if (!opcodeRegistry[opcode]) {
            opcodeRegistry[opcode] = { name: null, strongestSignal: signalStrength, count: 1, messageSizes: [messageSize] };
            console.log(`[CustomWebSocket] New opcode detected: ${opcode}, first seen with size ${messageSize}`);
        } else {
            opcodeRegistry[opcode].count += 1;
            opcodeRegistry[opcode].strongestSignal = Math.max(opcodeRegistry[opcode].strongestSignal, signalStrength);
            if (!opcodeRegistry[opcode].messageSizes.includes(messageSize)) {
                opcodeRegistry[opcode].messageSizes.push(messageSize);
            }
        }

        // Track message patterns based on size
        if (!messagePatterns[messageSize]) {
            messagePatterns[messageSize] = [];
        }
        if (!messagePatterns[messageSize].includes(opcode)) {
            messagePatterns[messageSize].push(opcode);
        }
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
            processSignal({ opcode, signalStrength, messageSize });

            console.log(`[CustomWebSocket] Opcode ${opcode} | Size ${messageSize} | Data:`, dataArray);
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

        console.log("[CustomWebSocket] Message Pattern Analysis:");
        console.table(messagePatterns);
    };

})();
