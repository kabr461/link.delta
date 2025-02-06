// ----- CSP Warning/Error Filter -----
// Override console.warn and console.error to hide warnings about the refused gstatic.com script.
(function() {
  const origWarn = console.warn;
  const origError = console.error;
  console.warn = function(...args) {
    if (args[0] && typeof args[0] === "string" &&
        (args[0].includes("Content Security Policy") ||
         args[0].includes("Refused to load the script"))) {
      return;
    }
    origWarn.apply(console, args);
  };
  console.error = function(...args) {
    if (args[0] && typeof args[0] === "string" &&
        (args[0].includes("Content Security Policy") ||
         args[0].includes("Refused to load the script"))) {
      return;
    }
    origError.apply(console, args);
  };
})();

console.log("[WebSocket Debug] Intercepting Delta Messages with Team Wave Effect (Smart Handling + Blob Conversion + CSP Filtering)...");

(function () {
    'use strict';

    // ----- Configuration & Global Variables -----
    var teamId = 1234; // Example team ID

    // Stores detected opcodes and their data.
    var opcodeRegistry = {};
    // Tracks opcode frequency over a session.
    var opcodeSummary = {};
    var lastSummaryTime = Date.now();

    // Holds the dynamically detected click opcode.
    var dynamicClickOpcode = null;

    // ----- Helper Functions -----

    // getDataView: Returns a DataView if the input is an ArrayBuffer or a typed array; otherwise returns null.
    function getDataView(data) {
        if (data instanceof ArrayBuffer) {
            return new DataView(data);
        }
        if (ArrayBuffer.isView(data)) {
            return new DataView(data.buffer, data.byteOffset, data.byteLength);
        }
        return null;
    }

    // ----- Message Processing Functions -----

    // processSignal: Processes an incoming binary message.
    // data is an object: { opcode, messageSize, rawData }
    function processSignal(data) {
        var view = getDataView(data.rawData);
        if (!data || typeof data.opcode === 'undefined' || !view) return;
        var opcode = data.opcode;
        try {
            // Copy the binary data into an array.
            var bytes = Array.from(new Uint8Array(view.buffer, view.byteOffset, view.byteLength));
            if (!opcodeRegistry[opcode]) {
                opcodeRegistry[opcode] = {
                    count: 1,
                    messages: [bytes],
                    functionType: classifyOpCode(opcode, data.rawData)
                };
            } else {
                opcodeRegistry[opcode].count += 1;
                opcodeRegistry[opcode].messages.push(bytes);
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

    // registerOpCode: Records an outgoing message's opcode and bytes.
    function registerOpCode(opCode, data) {
        var view = getDataView(data);
        if (!view) return; // Skip if data isn’t valid.
        try {
            var bytes = Array.from(new Uint8Array(view.buffer, view.byteOffset, view.byteLength));
            if (!opcodeRegistry[opCode]) {
                opcodeRegistry[opCode] = {
                    count: 1,
                    messages: [bytes],
                    functionType: classifyOpCode(opCode, data)
                };
            } else {
                opcodeRegistry[opCode].count += 1;
                opcodeRegistry[opCode].messages.push(bytes);
            }
            console.log("🔎 Captured OpCode: " + opCode + " - Stored in Lookup Table");
        } catch (e) {
            console.error("Error registering opcode:", e);
        }
    }

    // classifyOpCode: Determines the type of message based on its payload.
    function classifyOpCode(opCode, data) {
        var view = getDataView(data);
        if (!view) return "Unknown Action";
        try {
            if (view.byteLength === 8) {
                var x = view.getUint16(1, true);
                var y = view.getUint16(3, true);
                if (x >= 0 && x <= window.innerWidth && y >= 0 && y <= window.innerHeight) {
                    if (dynamicClickOpcode === null) {
                        dynamicClickOpcode = opCode;
                        console.log("Dynamically detected click opcode (via classification):", dynamicClickOpcode);
                    }
                    return "Spectator Click (Dynamic)";
                }
            }
            if (view.byteLength > 10) {
                return "Movement / Interaction";
            }
            if (view.byteLength === 2) {
                return "Ping / Network Sync";
            }
            return "Unknown Action";
        } catch (e) {
            console.error("Error classifying opcode:", e);
            return "Error in Classification";
        }
    }

    // ----- WebSocket Wrapper -----

    var OriginalWebSocket = window.WebSocket;

    // InterceptedWebSocket: Wraps the native WebSocket instance.
    function InterceptedWebSocket(url, protocols) {
        var ws = new OriginalWebSocket(url, protocols);
        this._ws = ws;
        // Initialize reconnection attempts.
        this._reconnectionAttempts = 0;
        console.log("[InterceptedWebSocket] Connected to: " + url);

        // Forward the "open" event.
        ws.addEventListener("open", function (e) {
            console.log("[InterceptedWebSocket] ✅ WebSocket Connected!");
            // Reset reconnection attempts on successful connection.
            this._reconnectionAttempts = 0;
            if (typeof this.onopen === "function") {
                this.onopen(e);
            }
        }.bind(this));

        // Forward the "message" event.
        ws.addEventListener("message", function (event) {
            // If a Blob is received, convert it to an ArrayBuffer.
            if (event.data instanceof Blob) {
                event.data.arrayBuffer().then(function (buffer) {
                    processBinaryData(buffer);
                    // Create a new event with data replaced by the ArrayBuffer.
                    var newEvent = Object.assign({}, event, { data: buffer });
                    if (typeof this.onmessage === "function") {
                        this.onmessage(newEvent);
                    }
                }.bind(this)).catch(function (err) {
                    console.error("Error converting Blob to ArrayBuffer:", err);
                });
                return;
            }
            processBinaryData(event.data);
            if (typeof this.onmessage === "function") {
                this.onmessage(event);
            }
        }.bind(this));

        // On "close", attempt to reconnect with exponential backoff.
        ws.addEventListener("close", function (event) {
            console.warn("[InterceptedWebSocket] ❌ Connection closed:", event);
            if (typeof this.onclose === "function") {
                this.onclose(event);
            }
            // Increase reconnection attempts and compute delay (max 30s).
            this._reconnectionAttempts++;
            var delay = Math.min(30000, 1000 * Math.pow(2, this._reconnectionAttempts));
            setTimeout(function () {
                try {
                    console.log("[InterceptedWebSocket] 🔄 Attempting to reconnect... Delay:", delay, "ms");
                    var newSocket = new InterceptedWebSocket(url, protocols);
                    // Adopt the new connection.
                    this._ws = newSocket._ws;
                    this._reconnectionAttempts = newSocket._reconnectionAttempts;
                } catch (e) {
                    console.error("Error during reconnect:", e);
                }
            }.bind(this), delay);
        }.bind(this));

        // Forward "error" events.
        ws.addEventListener("error", function (event) {
            console.error("[InterceptedWebSocket] Error:", event);
            if (typeof this.onerror === "function") {
                this.onerror(event);
            }
        }.bind(this));
    }

    // Override the send method.
    InterceptedWebSocket.prototype.send = function (data) {
        try {
            // Process only binary data.
            if (!(data instanceof ArrayBuffer || ArrayBuffer.isView(data))) {
                this._ws.send(data);
                return;
            }
            var u8 = data instanceof ArrayBuffer
                        ? new Uint8Array(data)
                        : new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
            var opCode = u8[0];

            // If the message is exactly 8 bytes, it might be a click event.
            if (((data instanceof ArrayBuffer && data.byteLength === 8) ||
                 (ArrayBuffer.isView(data) && data.byteLength === 8))) {
                var view = getDataView(data);
                if (view) {
                    var x = view.getUint16(1, true);
                    var y = view.getUint16(3, true);
                    if (x >= 0 && x <= window.innerWidth && y >= 0 && y <= window.innerHeight) {
                        if (dynamicClickOpcode === null) {
                            dynamicClickOpcode = opCode;
                            console.log("Dynamically detected click opcode:", dynamicClickOpcode);
                        }
                        if (opCode === dynamicClickOpcode) {
                            console.log("Detected click event. Triggering team wave effect.");
                            // Send an extra message in the official protocol format.
                            sendTeamWaveEffect();
                        }
                    }
                }
            }
            registerOpCode(opCode, data);
            this._ws.send(data);
        } catch (e) {
            console.error("Error in send override:", e);
        }
    };

    // Forward event listener methods.
    InterceptedWebSocket.prototype.addEventListener = function () {
        this._ws.addEventListener.apply(this._ws, arguments);
    };
    InterceptedWebSocket.prototype.removeEventListener = function () {
        this._ws.removeEventListener.apply(this._ws, arguments);
    };

    // Expose some properties.
    Object.defineProperty(InterceptedWebSocket.prototype, "readyState", {
        get: function () { return this._ws.readyState; }
    });
    Object.defineProperty(InterceptedWebSocket.prototype, "bufferedAmount", {
        get: function () { return this._ws.bufferedAmount; }
    });

    // ----- Incoming Data Processing -----

    // processBinaryData: Called when binary data is received.
    function processBinaryData(buffer) {
        if (!(buffer instanceof ArrayBuffer)) return;
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

    // ----- Extra Action: Team Wave Effect -----

    // sendTeamWaveEffect: Sends an extra message in the protocol format Agar.io accepts.
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
                    view.setUint8(0, 229);   // Official opcode for wave effect.
                    view.setUint8(1, 1);     // Enable flag.
                    view.setUint8(2, 1);     // Wave type.
                    view.setUint32(3, teamId, true); // Team ID (32-bit little-endian).
                    window.websocket.send(buffer);
                    console.log("🌊 Sent Team Wave Effect Trigger for Team ID:", teamId);
                } catch (e) {
                    console.error("Error sending team wave effect message:", e);
                }
            }, 500);
        } catch (e) {
            console.error("Error in sendTeamWaveEffect:", e);
        }
    }

    // ----- Document Click Interception -----

    // interceptSpectatorClick: When the user clicks the document, trigger the extra wave effect.
    function interceptSpectatorClick() {
        document.addEventListener("click", function (event) {
            try {
                console.log("🖱 Document click intercepted at (", event.clientX, ",", event.clientY, ")");
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

    // ----- Initialization -----

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

    // Expose a diagnostic method.
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
