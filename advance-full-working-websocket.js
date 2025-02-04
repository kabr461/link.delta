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
                // Handle Blob data by converting it to an ArrayBuffer.
                if (event.data instanceof Blob) {
                    event.data.arrayBuffer().then(buffer => {
                        processBinaryData(buffer);
                    });
                }
                // If it's already an ArrayBuffer, process it directly.
                else if (event.data instanceof ArrayBuffer) {
                    processBinaryData(event.data);
                }
                else {
                    console.warn("[CustomWebSocket] Received data in an unexpected format:", event.data);
                }
            });

            this.addEventListener('error', (error) => {
                console.error('[CustomWebSocket] Error:', error);
            });

            this.addEventListener('close', (event) => {
                console.warn('[CustomWebSocket] Connection closed:', event);
                // Attempt to reconnect after 3 seconds
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

    // Simple binary data processing function
    function processBinaryData(buffer) {
        const dataArray = new Uint8Array(buffer);
        console.log("[CustomWebSocket] Received Binary Data:", dataArray);
        // Further processing can be done here as needed.
    }

    // Override the native WebSocket after a short delay
    setTimeout(() => {
        window.WebSocket = CustomWebSocket;
        console.log('[CustomWebSocket] Override Applied');
    }, 1000);

})();
