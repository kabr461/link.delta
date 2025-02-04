console.log("[WebSocket Debug] Initializing WebSocket override...");

(function () {
    'use strict';

    const OriginalWebSocket = window.WebSocket;

    class CustomWebSocket extends OriginalWebSocket {
        constructor(url, protocols) {
            super(url, protocols);
            console.log('[CustomWebSocket] Connecting to:', url);

            this.addEventListener('open', () => {
                console.log('[CustomWebSocket] Connection opened:', url);
            });

            this.addEventListener('message', (event) => {
                // If the data is a string, assume it's JSON.
                if (typeof event.data === 'string') {
                    try {
                        const jsonData = JSON.parse(event.data);
                        console.log('[CustomWebSocket] Received JSON Data:', jsonData);
                        // You can process the JSON data here if needed.
                    } catch (e) {
                        console.error('[CustomWebSocket] JSON parse error:', e);
                    }
                }
                // If the data is a Blob, convert it to an ArrayBuffer first.
                else if (event.data instanceof Blob) {
                    event.data.arrayBuffer().then(buffer => {
                        processBinaryData(buffer);
                    });
                }
                // If it's already an ArrayBuffer, process it directly.
                else if (event.data instanceof ArrayBuffer) {
                    processBinaryData(event.data);
                }
                else {
                    console.warn('[CustomWebSocket] Received data in an unexpected format:', event.data);
                }
            });

            this.addEventListener('error', (error) => {
                console.error('[CustomWebSocket] Error:', error);
            });

            this.addEventListener('close', (event) => {
                console.warn('[CustomWebSocket] Connection closed:', event);
                setTimeout(() => {
                    console.log('[CustomWebSocket] Attempting to reconnect...');
                    window.WebSocket = new CustomWebSocket(this.url, this.protocols);
                }, 3000);
            });
        }

        send(data) {
            if (this.readyState === WebSocket.OPEN) {
                console.log('[CustomWebSocket] Sending:', data);
                super.send(data);
            } else {
                console.warn('[CustomWebSocket] Tried to send data while WebSocket was not open:', data);
            }
        }

        close(code, reason) {
            console.log('[CustomWebSocket] Closing connection:', code, reason);
            super.close(code, reason);
        }
    }

    // A simple function to process binary data.
    function processBinaryData(buffer) {
        const dataArray = new Uint8Array(buffer);
        console.log("[CustomWebSocket] Received Binary Data:", dataArray);
        // Further binary data processing can be added here.
    }

    // Override the native WebSocket after a short delay.
    setTimeout(() => {
        window.WebSocket = CustomWebSocket;
        console.log('[CustomWebSocket] Override Applied');
    }, 1000);

})();
