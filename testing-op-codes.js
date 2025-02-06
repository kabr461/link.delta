console.log("[WebSocket Debug] Initializing WebSocket Analyzer...");

(function () {
    'use strict';

    // Opcode registry for classification
    const opcodeRegistry = {};  // Stores opcode occurrences
    let opcodeSummary = {};  // Tracks opcodes per second
    let lastSummaryTime = Date.now();

    function processSignal(data) {
        if (!data || data.opcode === undefined) return;

        const opcode = data.opcode;
        const signalStrength = data.signalStrength || 0;
        const messageSize = data.messageSize || 0;

        // Track opcode frequency & strength
        if (!opcodeRegistry[opcode]) {
            opcodeRegistry[opcode] = { count: 1, strongestSignal: signalStrength, messageSizes: [messageSize] };
        } else {
            opcodeRegistry[opcode].count += 1;
            opcodeRegistry[opcode].strongestSignal = Math.max(opcodeRegistry[opcode].strongestSignal, signalStrength);
            if (!opcodeRegistry[opcode].messageSizes.includes(messageSize)) {
                opcodeRegistry[opcode].messageSizes.push(messageSize);
            }
        }

        // Track per-second summary
        opcodeSummary[opcode] = (opcodeSummary[opcode] || 0) + 1;

        // Print summary every 20 seconds
        if (Date.now() - lastSummaryTime > 20000) {
            console.clear();
            console.log(`[CustomWebSocket] Opcode Frequency Summary (Last 20s)`);
            console.table(opcodeSummary);
            opcodeSummary = {};
            lastSummaryTime = Date.now();
        }
    }

    const OriginalWebSocket = window.WebSocket;

    class CustomWebSocket extends OriginalWebSocket {
        constructor(url, protocols) {
            super(url, protocols);
            console.log('[CustomWebSocket] Connecting to:', url);

            // Store global WebSocket reference
            window.websocket = this;

            this.addEventListener('open', () => {
                console.log("[CustomWebSocket] ✅ WebSocket Connected!");
            });

            this.addEventListener('message', (event) => {
                if (event.data instanceof ArrayBuffer) {
                    processBinaryData(event.data);
                } else if (event.data instanceof Blob) {
                    event.data.arrayBuffer().then(buffer => processBinaryData(buffer));
                }
            });

            this.addEventListener('close', (event) => {
                console.warn('[CustomWebSocket] ❌ Connection closed:', event);
                setTimeout(() => {
                    console.log('[CustomWebSocket] 🔄 Attempting to reconnect...');
                    window.WebSocket = new CustomWebSocket(this.url, this.protocols);
                }, 1000);
            });
        }
    }

    function processBinaryData(buffer) {
        const dataArray = new Uint8Array(buffer);
        if (dataArray.length >= 2) {
            const opcode = dataArray[0];  // First byte = opcode
            const signalStrength = dataArray[1]; // Second byte = signal
            const messageSize = dataArray.length;
            processSignal({ opcode, signalStrength, messageSize });
        }
    }

    // Function to send a test ping request
    function sendPing() {
        if (!window.websocket || window.websocket.readyState !== WebSocket.OPEN) {
            console.warn("⚠ WebSocket is not connected! Waiting...");
            setTimeout(sendPing, 1000);
            return;
        }
        let buffer = new ArrayBuffer(5);
        let view = new DataView(buffer);
        view.setUint8(0, 226);  // OpCode for Ping
        view.setUint32(1, Date.now(), true);
        window.websocket.send(buffer);
        console.log("📡 Sent Ping Request...");
    }

    // Function to test all opcodes (0-255)
    function testAllOpcodes() {
        if (!window.websocket || window.websocket.readyState !== WebSocket.OPEN) {
            console.warn("⚠ WebSocket is not connected! Waiting...");
            setTimeout(testAllOpcodes, 1000);
            return;
        }
        console.log("📡 Sending test requests for all op codes...");
        for (let i = 0; i < 256; i++) {
            let buffer = new ArrayBuffer(1);
            let view = new DataView(buffer);
            view.setUint8(0, i);
            window.websocket.send(buffer);
            console.log(`✅ Sent test request for OpCode: ${i}`);
        }
    }

    // Apply override
    setTimeout(() => {
        window.WebSocket = CustomWebSocket;
        console.log('[CustomWebSocket] WebSocket Override Applied');
    }, 1000);

    // Helper functions for debugging
    window.analyzeOpcodes = function () {
        console.log("[CustomWebSocket] Opcode Registry Analysis:");
        console.table(opcodeRegistry);
    };

    window.sendPing = sendPing;
    window.testAllOpcodes = testAllOpcodes;

})();
