console.log("[WebSocket Debug] Intercepting Delta Messages with Team Wave Effect (Robust Version)...");

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

    // Process each decoded signal from incoming binary data
    function processSignal(data) {
        if (!data || typeof data.opcode === 'undefined') return;
        var opcode = data.opcode;
        try {
            // Update opcode registry with details and count
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

            // Update frequency summary
            opcodeSummary[opcode] = (opcodeSummary[opcode] || 0) + 1;

            // Every 20 seconds, clear the console and show a summary
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

    // Save the original WebSocket so we can extend it
    var OriginalWebSocket = window.WebSocket;

    // Custom WebSocket class that intercepts messages and send events
    var InterceptedWebSocket = function (url, protocols) {
        try {
            OriginalWebSocket.call(this, url, protocols);
            console.log("[InterceptedWebSocket] Connected to: " + url);
            window.websocket = this;
        } catch (e) {
            console.error("Error during WebSocket initialization:", e);
        }

        this.addEventListener("open", function () {
            console.log("[InterceptedWebSocket] ✅ WebSocket Connected!");
        });

        this.addEventListener("message", function (event) {
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
        });

        this.addEventListener("close", function (event) {
            console.warn("[InterceptedWebSocket] ❌ Connection closed:", event);
            setTimeout(function () {
                try {
                    console.log("[InterceptedWebSocket] 🔄 Attempting to reconnect...");
                    window.websocket = new InterceptedWebSocket(url, protocols);
                } catch (e) {
                    console.error("Error during reconnection attempt:", e);
                }
            }, 1000);
        });
    };

    // Inherit from OriginalWebSocket
    InterceptedWebSocket.prototype = Object.create(OriginalWebSocket.prototype);
    InterceptedWebSocket.prototype.constructor = InterceptedWebSocket;

    // Override the send method to intercept outgoing messages.
    // If the outgoing message uses the dynamically detected click opcode,
    // rewrite it as a wave effect.
    InterceptedWebSocket.prototype.send = function (data) {
        try {
            var u8 = new Uint8Array(data);
            var opCode = u8[0];

            // Heuristic: if data is 8 bytes long, interpret it as a potential click event
            if (data.byteLength === 8) {
                var view = new DataView(data);
                var x = view.getUint16(1, true);
                var y = view.getUint16(3, true);

                // Validate coordinates against typical screen dimensions
                if (x >= 0 && x <= window.innerWidth &&
                    y >= 0 && y <= window.innerHeight) {

                    // If we haven't stored the click opcode, do so now.
                    if (dynamicClickOpcode === null) {
                        dynamicClickOpcode = opCode;
                        console.log("Dynamically detected click opcode:", dynamicClickOpcode);
                    }
                    // If the message is a click event, rewrite it as a wave effect.
                    if (opCode === dynamicClickOpcode) {
                        console.log("Detected click event. Rewriting it to a wave effect.");
                        sendTeamWaveEffect();
                        return; // Do not send the original click event.
                    }
                }
            }
            // Record the opcode and send the message normally.
            registerOpCode(opCode, data);
            OriginalWebSocket.prototype.send.call(this, data);
        } catch (e) {
            console.error("Error in send override:", e);
        }
    };

    // Register the outgoing opcode and store its message for tracking
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

    // Classify the opcode based on the length and content of its data payload.
    // This function uses a heuristic: if the message is 8 bytes long and the
    // coordinates (bytes 1-4) fall within typical screen bounds, classify it as a click.
    function classifyOpCode(opCode, data) {
        try {
            var view = new DataView(data);
            if (data.byteLength === 8) {
                var x = view.getUint16(1, true);
                var y = view.getUint16(3, true);
                if (x >= 0 && x <= window.innerWidth &&
                    y >= 0 && y <= window.innerHeight) {
                    // Dynamically store the click opcode if not already set.
                    if (dynamicClickOpcode === null) {
                        dynamicClickOpcode = opCode;
                        console.log("Dynamically detected click opcode (via classification):", dynamicClickOpcode);
                    }
                    return "Spectator Click (Dynamic)";
                }
            }
            if (data.byteLength > 10) {
                return "Movement / Interaction";
            }
            if (data.byteLength === 2) {
                return "Ping / Network Sync";
            }
            return "Unknown Action";
        } catch (e) {
            console.error("Error classifying opcode:", e);
            return "Error in Classification";
        }
    }

    // Send a team wave effect message that includes the team ID.
    // This function rewrites the click event into a wave effect.
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
                    view.setUint8(0, 229);   // Hypothetical opcode for Wave Effect
                    view.setUint8(1, 1);     // Enable flag
                    view.setUint8(2, 1);     // Wave type
                    view.setUint32(3, teamId, true);  // Team ID in little-endian
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

    // Process incoming binary data to extract the opcode and other details
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
    // This ensures that even if a click message is generated by user input,
    // we rewrite it as a wave effect.
    function interceptSpectatorClick() {
        document.addEventListener("click", function (event) {
            try {
                console.log("🖱 Document click intercepted at (" + event.clientX + ", " + event.clientY + ")");
                if (!window.websocket || window.websocket.readyState !== OriginalWebSocket.OPEN) {
                    console.warn("⚠ WebSocket is not connected!");
                    return;
                }
                // Directly send the wave effect message instead of the click.
                sendTeamWaveEffect();
            } catch (e) {
                console.error("Error intercepting document click:", e);
            }
        });
    }

    // Override the global WebSocket after a short delay to ensure the page is loaded
    setTimeout(function () {
        try {
            window.WebSocket = InterceptedWebSocket;
            console.log("[InterceptedWebSocket] ✅ WebSocket Override Applied");
            interceptSpectatorClick();
        } catch (e) {
            console.error("Error during WebSocket override:", e);
        }
    }, 1000);

    // Expose a method to analyze the opcode registry for diagnostics via the console
    window.analyzeOpcodes = function () {
        console.log("[InterceptedWebSocket] Opcode Registry Analysis:");
        console.table(opcodeRegistry);
    };
})();
