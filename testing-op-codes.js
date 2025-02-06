console.log("[WebSocket Debug] Intercepting Delta Messages with Team Wave Effect...");

(function () {
    'use strict';

    // Define your team identifier (this should be set dynamically in a real scenario)
    const teamId = 1234; // Example team ID

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
            console.log([CustomWebSocket] Opcode Frequency Summary (Last 20s));
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
            const opCode = new Uint8Array(data)[0];  // First byte is the opcode
            registerOpCode(opCode, data);

            // When the opcode matches the spectator click code, trigger the team wave effect
            if (opCode === detectedSpectatorClickOpCode()) {
                console.log("🖱 Spectator Click Detected!");
                // Instead of a local-only effect, send a team wave effect message
                sendTeamWaveEffect();
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
        console.log(🔎 Captured OpCode: ${opCode} - Now stored in Lookup Table);
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
        return 99; // Confirmed Spectator Click OpCode (example)
    }

    // Modified function: sendTeamWaveEffect includes team ID in the payload.
    function sendTeamWaveEffect() {
        if (!window.websocket || window.websocket.readyState !== WebSocket.OPEN) {
            console.warn("⚠ WebSocket not connected! Cannot send team wave effect.");
            return;
        }

        setTimeout(() => { // Add a small delay to avoid rapid validation issues
            // Create a buffer with 7 bytes:
            // Byte 0: Wave effect opcode (hypothetical, e.g., 229)
            // Byte 1: Enable flag
            // Byte 2: Wave type
            // Bytes 3-6: Team ID (32-bit integer, little-endian)
            let buffer = new ArrayBuffer(7);
            let view = new DataView(buffer);
            view.setUint8(0, 229);   // Hypothetical opcode for Wave Effect (needs confirmation)
            view.setUint8(1, 1);     // Enable flag
            view.setUint8(2, 1);     // Wave type
            view.setUint32(3, teamId, true);  // Team ID (4 bytes in little-endian)

            window.websocket.send(buffer);
            console.log(🌊 Sent Team Wave Effect Trigger for Team ID: ${teamId});
        }, 500);
    }

    // Process incoming binary data and extract opcode information.
    function processBinaryData(buffer) {
        const dataArray = new Uint8Array(buffer);
        if (dataArray.length >= 2) {
            const opcode = dataArray[0];
            processSignal({ opcode, messageSize: dataArray.length, rawData: buffer });
        }
    }

    // Modify spectator click event to also send team ID with the click event
    function interceptSpectatorClick() {
        document.addEventListener("click", (event) => {
            console.log(🖱 Spectator Click at (${event.clientX}, ${event.clientY}));
            if (!window.websocket || window.websocket.readyState !== WebSocket.OPEN) {
                console.warn("⚠ WebSocket is not connected!");
                return;
            }

            // Create a buffer with 8 bytes:
            // Byte 0: Spectator click opcode (e.g., 99)
            // Bytes 1-2: X coordinate (16-bit, little-endian)
            // Bytes 3-4: Y coordinate (16-bit, little-endian)
            // Byte 5: Custom wave effect trigger flag
            // Bytes 6-7: Team ID (16-bit, little-endian; adjust size as needed)
            let buffer = new ArrayBuffer(8);
            let view = new DataView(buffer);
            view.setUint8(0, detectedSpectatorClickOpCode());
            view.setUint16(1, event.clientX, true);
            view.setUint16(3, event.clientY, true);
            view.setUint8(5, 1); // Custom wave effect trigger flag
            view.setUint16(6, teamId, true); // Attach team ID

            window.websocket.send(buffer);
            console.log(🖱 Sent Spectator Click Event with Team ID: ${teamId});
        });
    }

    // Override the global WebSocket after a delay to ensure the page has loaded
    setTimeout(() => {
        window.WebSocket = InterceptedWebSocket;
        console.log('[InterceptedWebSocket] ✅ WebSocket Override Applied');
        interceptSpectatorClick();
    }, 1000);

    // Expose a method to analyze opcodes in the console if needed
    window.analyzeOpcodes = function () {
        console.log("[InterceptedWebSocket] Opcode Registry Analysis:");
        console.table(opcodeRegistry);
    };

})();
