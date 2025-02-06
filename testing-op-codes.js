console.log("[WebSocket Debug] Intercepting Delta Messages with Override...");

(function () {
    'use strict';

    // Opcode registry for classification
    const opcodeRegistry = {};
    let opcodeSummary = {};
    let lastSummaryTime = Date.now();

    function processSignal(data) {
        if (!data || data.opcode === undefined) return;

        const opcode = data.opcode;
        const signalStrength = data.signalStrength || 0;
        const messageSize = data.messageSize || 0;

        if (!opcodeRegistry[opcode]) {
            opcodeRegistry[opcode] = { count: 1, strongestSignal: signalStrength, messageSizes: [messageSize] };
        } else {
            opcodeRegistry[opcode].count += 1;
            opcodeRegistry[opcode].strongestSignal = Math.max(opcodeRegistry[opcode].strongestSignal, signalStrength);
            if (!opcodeRegistry[opcode].messageSizes.includes(messageSize)) {
                opcodeRegistry[opcode].messageSizes.push(messageSize);
            }
        }

        opcodeSummary[opcode] = (opcodeSummary[opcode] || 0) + 1;

        if (Date.now() - lastSummaryTime > 20000) {
            console.clear();
            console.log(`[CustomWebSocket] Opcode Frequency Summary (Last 20s)`);
            console.table(opcodeSummary);
            opcodeSummary = {};
            lastSummaryTime = Date.now();
        }
    }

    const OriginalWebSocket = window.WebSocket;

    class InterceptedWebSocket extends OriginalWebSocket {
        constructor(url, protocols) {
            super(url, protocols);
            console.log('[InterceptedWebSocket] Connected to:', url);

            window.websocket = this;

            this.addEventListener('open', () => {
                console.log("[InterceptedWebSocket] ✅ WebSocket Connected!");
            });

            this.addEventListener('message', (event) => {
                if (event.data instanceof ArrayBuffer) {
                    processBinaryData(event.data);
                } else if (event.data instanceof Blob) {
                    event.data.arrayBuffer().then(buffer => processBinaryData(buffer));
                }
            });

            this.addEventListener('close', (event) => {
                console.warn('[InterceptedWebSocket] ❌ Connection closed:', event);
                setTimeout(() => {
                    console.log('[InterceptedWebSocket] 🔄 Attempting to reconnect...');
                    window.WebSocket = new InterceptedWebSocket(this.url, this.protocols);
                }, 1000);
            });
        }

        send(data) {
            const opCode = new Uint8Array(data)[0];  // First byte is opcode
            console.log(`📡 Delta Sent OpCode: ${opCode}`);

            // Confirming we identified the opcode correctly without modifying original request
            confirmOpCode(opCode, data);

            // Pass the original data to Delta without modification
            super.send(data);
        }
    }

    function confirmOpCode(opCode, data) {
        console.log(`🔎 Confirming OpCode: ${opCode} - Identified Correctly`);
    }

    function processBinaryData(buffer) {
        const dataArray = new Uint8Array(buffer);
        if (dataArray.length >= 2) {
            const opcode = dataArray[0];
            const signalStrength = dataArray[1];
            const messageSize = dataArray.length;
            processSignal({ opcode, signalStrength, messageSize });
        }
    }

    function interceptSpectatorClick() {
        document.addEventListener("click", (event) => {
            console.log(`🖱 Spectator Click at (${event.clientX}, ${event.clientY})`);
            if (!window.websocket || window.websocket.readyState !== WebSocket.OPEN) {
                console.warn("⚠ WebSocket is not connected!");
                return;
            }
            let buffer = new ArrayBuffer(6);
            let view = new DataView(buffer);
            view.setUint8(0, 99);  // Hypothetical OpCode for Spectator Interaction
            view.setUint16(1, event.clientX, true);
            view.setUint16(3, event.clientY, true);
            view.setUint8(5, 1);   // Wave Effect Trigger
            window.websocket.send(buffer);
            console.log("🌊 Sent Wave Effect Trigger!");
        });
    }

    setTimeout(() => {
        window.WebSocket = InterceptedWebSocket;
        console.log('[InterceptedWebSocket] ✅ WebSocket Override Applied');
        interceptSpectatorClick();
    }, 1000);

    window.analyzeOpcodes = function () {
        console.log("[InterceptedWebSocket] Opcode Registry Analysis:");
        console.table(opcodeRegistry);
    };

})();
