console.log("[WebSocket Debug] Intercepting Delta Messages with Team Wave Effect (Advanced Wrapped Version)...");

(function () {
    'use strict';

    // Define your team identifier (set dynamically in a real scenario)
    var teamId = 1234; // Example team ID

    // Opcode registry for dynamic classification and tracking
    var opcodeRegistry = {};  // Stores detected opcodes and their data
    var opcodeSummary = {};   // Tracks opcode frequency over a session
    var lastSummaryTime = Date.now();

    // Variable to hold the dynamically detected click opcode.
    var dynamicClickOpcode = null;

    // Helper: create a DataView from data that might be an ArrayBuffer or a typed array.
    function getDataView(data) {
        if (data instanceof ArrayBuffer) {
            return new DataView(data);
        } else if (ArrayBuffer.isView(data)) {
            return new DataView(data.buffer, data.byteOffset, data.byteLength);
        } else {
            throw new Error("Data is not an ArrayBuffer or ArrayBuffer view.");
        }
    }

    // Process each decoded signal from incoming binary data.
    function processSignal(data) {
        if (!data || typeof data.opcode === 'undefined') return;
        var opcode = data.opcode;
        try {
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
                console.log("[CustomWebSocket] Opcode Frequency Summary (Last 20s)");
                console.table(opcodeSummary);
                opcodeSummary = {};
                lastSummaryTime = Date.now();
            }
        } catch (e) {
            console.error("Error processing signal:", e);
        }
    }

    // Save the original WebSocket so we can wrap it.
    var OriginalWebSocket = window.WebSocket;

    // Our wrapper for WebSocket using composition.
    function InterceptedWebSocket(url, protocols) {
        // Create a new native WebSocket instance.
        var ws = new OriginalWebSocket(url, protocols);
        this._ws = ws;

        console.log("[InterceptedWebSocket] Connected to: " + url);

        // Forward native events from the underlying socket.
        ws.addEventListener("open", function (e) {
            console.log("[InterceptedWebSocket] ✅ WebSocket Connected!");
            if (typeof this.onopen === "function") {
                this.onopen(e);
            }
        }.bind(this));

        ws.addEventListener("message", function (event) {
            try {
                if (event.data instanceof ArrayBuffer) {
                    processBinaryData(event.data);
                } else if (event.data instanceof Blob) {
                    event.data.arrayBuffer().then(function (buffer) {
                        processBinaryData(buffer);
                    }).catch(function (err) {
                        console.error("Error converting Blob to ArrayBuffer:", err);
                    });
                }
            } catch (e) {
                console.error("Error processing WebSocket message:", e);
            }
            if (typeof this.onmessage === "function") {
                this.onmessage(event);
            }
        }.bind(this));

        ws.addEventListener("close", function (event) {
            console.warn("[InterceptedWebSocket] ❌ Connection closed:", event);
            if (typeof this.onclose === "function") {
                this.onclose(event);
            }
            // Use setTimeout to attempt a reconnect after 1 second.
            setTimeout(function () {
                try {
                    console.log("[InterceptedWebSocket] 🔄 Attempting to reconnect...");
                    var newSocket = new InterceptedWebSocket(url, protocols);
                    this._ws = newSocket._ws;
                } catch (e) {
                    console.error("Error during reconnect:", e);
                }
            }.bind(this), 1000);
        }.bind(this));

        ws.addEventListener("error", function (event) {
            console.error("[InterceptedWebSocket] Error:", event);
            if (typeof this.onerror === "function") {
                this.onerror(event);
            }
        }.bind(this));
    }

    // Override the send method. When an 8-byte message (likely a click) is sent,
    // trigger the additional wave effect while still sending the original delta message.
    InterceptedWebSocket.prototype.send = function (data) {
        try {
            // Create a Uint8Array view of the data.
            var u8 = data instanceof ArrayBuffer ? new Uint8Array(data) : new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
            var opCode = u8[0];

            // Heuristic: if data is 8 bytes long, it may be a click event.
            if ( (data instanceof ArrayBuffer && data.byteLength === 8) ||
                 (ArrayBuffer.isView(data) && data.byteLength === 8) ) {
                var view = getDataView(data);
                var x = view.getUint16(1, true);
                var y = view.getUint16(3, true);
                if (x >= 0 && x <= window.innerWidth &&
                    y >= 0 && y <= window.innerHeight) {
                    if (dynamicClickOpcode === null) {
                        dynamicClickOpcode = opCode;
                        console.log("Dynamically detected click opcode:", dynamicClickOpcode);
                    }
                    if (opCode === dynamicClickOpcode) {
                        console.log("Detected click event. Triggering wave effect (additional energy).");
                        sendTeamWaveEffect();
                        // The original delta message is still sent.
                    }
                }
            }
            registerOpCode(opCode, data);
            this._ws.send(data);
        } catch (e) {
            console.error("Error in send override:", e);
        }
    };

    // Forward addEventListener and removeEventListener methods.
    InterceptedWebSocket.prototype.addEventListener = function () {
        this._ws.addEventListener.apply(this._ws, arguments);
    };
    InterceptedWebSocket.prototype.removeEventListener = function () {
        this._ws.removeEventListener.apply(this._ws, arguments);
    };

    // Expose some properties (readyState, bufferedAmount) from the underlying WebSocket.
    Object.defineProperty(InterceptedWebSocket.prototype, "readyState", {
        get: function () { return this._ws.readyState; }
    });
    Object.defineProperty(InterceptedWebSocket.prototype, "bufferedAmount", {
        get: function () { return this._ws.bufferedAmount; }
    });

    // Register the outgoing opcode and store its message for tracking.
    function registerOpCode(opCode, data) {
        try {
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
            console.log("🔎 Captured OpCode: " + opCode + " - Stored in Lookup Table");
        } catch (e) {
            console.error("Error registering opcode:", e);
        }
    }

    // Classify the opcode based on the payload.
    function classifyOpCode(opCode, data) {
        try {
            var view = getDataView(data);
            if (data.byteLength === 8 || (ArrayBuffer.isView(data) && data.byteLength === 8)) {
                var x = view.getUint16(1, true);
                var y = view.getUint16(3, true);
                if (x >= 0 && x <= window.innerWidth &&
                    y >= 0 && y <= window.innerHeight) {
                    if (dynamicClickOpcode === null) {
                        dynamicClickOpcode = opCode;
                        console.log("Dynamically detected click opcode (via classification):", dynamicClickOpcode);
                    }
                    return "Spectator Click (Dynamic)";
                }
            }
            if (data.byteLength > 10 || (ArrayBuffer.isView(data) && data.byteLength > 10)) {
                return "Movement / Interaction";
            }
            if (data.byteLength === 2 || (ArrayBuffer.isView(data) && data.byteLength === 2)) {
                return "Ping / Network Sync";
            }
            return "Unknown Action";
        } catch (e) {
            console.error("Error classifying opcode:", e);
            return "Error in Classification";
        }
    }

    // Send a team wave effect message (additional energy) without interfering with the delta message.
    function sendTeamWaveEffect() {
        try {
            if (!window.websocket || window.websocket.readyState !== OriginalWebSocket.OPEN) {
                console.warn("⚠ WebSocket not connected! Cannot send team wave effect.");
                return;
            }
            setTimeout(function () {
                try {
                    var buffer = new ArrayBuffer(7);
                    var view = new DataView(buffer);
                    view.setUint8(0, 229);   // Hypothetical opcode for Wave Effect.
                    view.setUint8(1, 1);     // Enable flag.
                    view.setUint8(2, 1);     // Wave type.
                    view.setUint32(3, teamId, true);  // Team ID in little-endian.
                    window.websocket.send(buffer);
                    console.log("🌊 Sent Team Wave Effect Trigger for Team ID: " + teamId);
                } catch (e) {
                    console.error("Error sending wave effect message:", e);
                }
            }, 500);
        } catch (e) {
            console.error("Error in sendTeamWaveEffect:", e);
        }
    }

    // Process incoming binary data to extract opcode details.
    function processBinaryData(buffer) {
        try {
            var dataArray = new Uint8Array(buffer);
            if (dataArray.length >= 2) {
                var opcode = dataArray[0];
                processSignal({ opcode: opcode, messageSize: dataArray.length, rawData: buffer });
            }
        } catch (e) {
            console.error("Error processing binary data:", e);
        }
    }

    // Intercept document click events and trigger the wave effect.
    function interceptSpectatorClick() {
        document.addEventListener("click", function (event) {
            try {
                console.log("🖱 Document click intercepted at (" + event.clientX + ", " + event.clientY + ")");
                if (!window.websocket || window.websocket.readyState !== OriginalWebSocket.OPEN) {
                    console.warn("⚠ WebSocket is not connected!");
                    return;
                }
                sendTeamWaveEffect();
            } catch (e) {
                console.error("Error intercepting document click:", e);
            }
        });
    }

    // Override the global WebSocket after a short delay.
    setTimeout(function () {
        try {
            window.WebSocket = InterceptedWebSocket;
            console.log("[InterceptedWebSocket] ✅ WebSocket Override Applied");
            interceptSpectatorClick();
        } catch (e) {
            console.error("Error during WebSocket override:", e);
        }
    }, 1000);

    // Expose a diagnostic method to analyze the opcode registry.
    window.analyzeOpcodes = function () {
        console.log("[InterceptedWebSocket] Opcode Registry Analysis:");
        console.table(opcodeRegistry);
    };

    // Expose the active socket for debugging.
    Object.defineProperty(window, "websocket", {
        get: function () {
            return window.WebSocket ? window.WebSocket.prototype._ws : null;
        }
    });
})();
