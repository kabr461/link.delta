console.log("[WebSocket Debug] Initializing WebSocket Opcode Finder...");

(function () {
    'use strict';

    const OriginalWebSocket = window.WebSocket;
    let opcodeLogs = []; // Stores received opcodes and data

    class OpcodeFinderWebSocket extends OriginalWebSocket {
        constructor(url, protocols) {
            super(url, protocols);
            console.log('[OpcodeFinderWebSocket] Connecting to:', url);

            this.addEventListener('open', () => {
                console.log('[OpcodeFinderWebSocket] Connection opened:', url);
            });

            this.addEventListener('message', (event) => {
                if (event.data instanceof Blob) {
                    event.data.arrayBuffer().then(buffer => {
                        let dataArray = new Uint8Array(buffer);
                        let opcode = dataArray[0]; // First byte is typically the opcode

                        console.log("[OpcodeFinderWebSocket] Received Binary Data:", dataArray);
                        console.log("[OpcodeFinderWebSocket] Opcode:", opcode);

                        opcodeLogs.push({ opcode, data: dataArray });
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
    }

    setTimeout(() => {
        window.WebSocket = OpcodeFinderWebSocket;
        console.log('[OpcodeFinderWebSocket] Opcode Finder Override Applied');
    }, 1000);

    // Function to retrieve stored opcode logs
    window.getOpcodeLogs = function () {
        console.log("[OpcodeFinderWebSocket] Stored Opcodes:", opcodeLogs);
        return opcodeLogs;
    };
})();
