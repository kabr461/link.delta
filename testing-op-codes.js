console.log("[WebSocket Debug] Initializing WebSocket Opcode Finder...");

(function () {
    'use strict';

    const OriginalWebSocket = window.WebSocket;
    let opcodeLogs = [];
    let gameWebSocket = null;
    let parseWebSocket = null;
    let readOnlyWebSocket = null;

    class OpcodeFinderWebSocket extends OriginalWebSocket {
        constructor(url, protocols) {
            super(url, protocols);
            console.log('[OpcodeFinderWebSocket] Connecting to:', url);

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

                        // Avoid duplicate logs
                        if (!opcodeLogs.some(log => log.opcode === opcode)) {
                            console.log("[OpcodeFinderWebSocket] Opcode:", opcode, "Data:", dataArray);
                            opcodeLogs.push({ opcode, data: dataArray });
                        }
                    });
                } else {
                    try {
                        let jsonData = JSON.parse(event.data);
                        console.log("[OpcodeFinderWebSocket] Received JSON Data:", jsonData);
                        opcodeLogs.push({ type: "JSON", data: jsonData });
                    } catch (e) {
                        console.warn("[OpcodeFinderWebSocket] Received Unknown Data:", event.data);
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
                    window.WebSocket = new OpcodeFinderWebSocket(this.url, this.protocols);
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

    window.getOpcodeLogs = function () {
        console.log("[OpcodeFinderWebSocket] Stored Opcodes:", opcodeLogs);
        return opcodeLogs;
    };
})();
