console.log("[WebSocket Debug] Initializing WebSocket Opcode Finder...");

(function () {
    'use strict';

    const OriginalWebSocket = window.WebSocket;
    let opcodeLogs = new Set(); // Stores unique opcodes
    let loggedOpcodes = new Map(); // Stores opcodes with sample payloads
    let gameWebSocket = null;
    let parseWebSocket = null;
    let readOnlyWebSocket = null;

    class OpcodeFinderWebSocket extends OriginalWebSocket {
        constructor(url, protocols) {
            super(url, protocols);
            console.log('[OpcodeFinderWebSocket] Connecting to:', url);

            // Categorize WebSocket type
            if (url.includes("parse")) {
                parseWebSocket = this;
                console.log("[WebSocket] Identified as **Parse Command WebSocket** (Handles chat & commands).");
            } else if (url.includes("delta") || url.includes("protocol")) {
                gameWebSocket = this;
                console.log("[WebSocket] Identified as **Game Action WebSocket** (Handles waves, movement).");
            } else {
                readOnlyWebSocket = this;
                console.log("[WebSocket] Identified as **Read-Only WebSocket** (Receives game updates).");
            }

            this.addEventListener('open', () => {
                console.log('[OpcodeFinderWebSocket] Connection opened:', url);
            });

            this.addEventListener('message', (event) => {
                if (event.data instanceof Blob) {
                    event.data.arrayBuffer().then(buffer => {
                        let dataArray = new Uint8Array(buffer);
                        let opcode = dataArray[0];
                        let payloadSample = dataArray.slice(1, 10); // First 10 bytes of payload

                        if (!opcodeLogs.has(opcode)) {
                            opcodeLogs.add(opcode);
                            loggedOpcodes.set(opcode, payloadSample);
                            console.log(`[OpcodeFinderWebSocket] New Opcode Detected: ${opcode}, Sample Payload:`, payloadSample);
                        }
                    });
                } else {
                    try {
                        let jsonData = JSON.parse(event.data);
                        console.log("[OpcodeFinderWebSocket] Received JSON Data:", jsonData);
                    } catch (e) {
                        // console.warn("[OpcodeFinderWebSocket] Received Unknown Data:", event.data);
                    }
                }
            });

            this.addEventListener('error', (error) => {
                console.error('[OpcodeFinderWebSocket] Error:', error);
            });

            this.addEventListener('close', (event) => {
                console.warn('[OpcodeFinderWebSocket] Connection closed:', event);
                setTimeout(() => {
                    console.log('[OpcodeFinderWebSocket] Attempting to reconnect...');
                    new OpcodeFinderWebSocket(this.url, this.protocols);
                }, 3000);
            });
        }

        send(data) {
            if (this.readyState === WebSocket.OPEN) {
                super.send(data);
            }
        }

        close(code, reason) {
            console.log('[OpcodeFinderWebSocket] Closing connection:', code, reason);
            super.close(code, reason);
        }
    }

    setTimeout(() => {
        window.WebSocket = OpcodeFinderWebSocket;
        console.log('[OpcodeFinderWebSocket] Opcode Finder Override Applied');
    }, 1000);

    // Function to get stored opcodes
    window.getOpcodeLogs = function () {
        console.log("[OpcodeFinderWebSocket] Stored Opcodes:", Array.from(opcodeLogs));
        return loggedOpcodes;
    };
})();

// Secondary WebSocket Hook for Additional Debugging
(function() {
    let originalWebSocket = window.WebSocket;

    if (!originalWebSocket) {
        console.log("WebSocket not found, retrying...");
        setTimeout(arguments.callee, 3000);
        return;
    }

    window.WebSocket = function(url, protocols) {
        console.log("Intercepted WebSocket Connection:", url);
        let ws = new originalWebSocket(url, protocols);

        ws.addEventListener("message", function(event) {
            if (!(event.data instanceof ArrayBuffer)) return;
            
            let data = new DataView(event.data);
            let opcode = data.getUint8(0);  // First byte is opcode

            if (!opcodeLogs.has(opcode)) {
                opcodeLogs.add(opcode);
                console.log("Received New Opcode:", opcode, "Raw Data:", new Uint8Array(event.data));
            }
        });

        return ws;
    };

    console.log("WebSocket Hook Installed!");
})();
