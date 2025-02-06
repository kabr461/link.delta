console.log("[WebSocket Debug] Intercepting Delta Messages with OpCode Classification and Spectator Wave Effect...");

(function () {
    'use strict';

    // Opcode registry for dynamic classification
    let opcodeRegistry = {};  // Stores all detected op codes dynamically
    let opcodeSummary = {};   // Tracks opcode frequency in the session
    let lastSummaryTime = Date.now();

    function processSignal(data) {
        if (!data || data.opcode === undefined) return;

        const opcode = data.opcode;
        const messageSize = data.messageSize || 0;

        if (!opcodeRegistry[opcode]) {
            opcodeRegistry[opcode] = {
                count: 1,
                messages: [Array.from(new Uint8Array(data.rawData))],
                functionType: classifyOpCode(opcode, data.rawData)
            };
        } else {
            opcodeRegistry[opcode].count += 1;
            opcodeRegistry[opcode].messages.push(Array.from(new Uint8Array(data.rawData)));
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
            registerOpCode(opCode, data);

            // Modify spectator clicks to add a wave effect without breaking the game
            if (opCode === detectedSpectatorClickOpCode()) {
                console.log("🌊 Adding Wave Effect to Spectator Click!");
                data = modifyForWaveEffect(data);
            }

            super.send(data);
        }
    }

    function registerOpCode(opCode, data) {
        if (!opcodeRegistry[opCode]) {
            opcodeRegistry[opCode] = {
                count: 1,
                messages: [Array.from(new Uint8Array(data))],
                functionType: classifyOpCode(opCode, data)
            };
        } else {
            opcodeRegistry[opCode].count += 1;
            opcodeRegistry[opCode].messages.push(Array.from(new Uint8Array(data)));
        }
        console.log(`🔎 Captured OpCode: ${opCode} - Now stored in Lookup Table`);
    }

    function classifyOpCode(opCode, data) {
        if (data.length === 6 && opCode === detectedSpectatorClickOpCode()) {
            return "Spectator Click (Possible Wave)";
        }
        if (data.length > 10) {
            return "Movement / Interaction";
        }
        if (data.length === 2) {
            return "Ping / Network Sync";
        }
        return "Unknown Action";
    }

    function detectedSpectatorClickOpCode() {
        return 99; // Hypothetical OpCode - Needs confirmation
    }

    function modifyForWaveEffect(data) {
        let buffer = new ArrayBuffer(data.byteLength + 2);
        let view = new DataView(buffer);
        let originalData = new Uint8Array(data);

        for (let i = 0; i < originalData.length; i++) {
            view.setUint8(i, originalData[i]);
        }

        view.setUint8(originalData.length, 200); // Custom wave effect trigger
        view.setUint8(originalData.length + 1, 1); // Enable

        return buffer;
    }

    function processBinaryData(buffer) {
        const dataArray = new Uint8Array(buffer);
        if (dataArray.length >= 2) {
            const opcode = dataArray[0];
            processSignal({ opcode, messageSize: dataArray.length, rawData: buffer });
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
            view.setUint8(0, detectedSpectatorClickOpCode());  // Use detected spectator click op code
            view.setUint16(1, event.clientX, true);
            view.setUint16(3, event.clientY, true);
            view.setUint8(5, 1);   // Custom wave effect trigger

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
