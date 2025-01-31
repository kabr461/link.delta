console.log("[WebSocket Debug] Initializing WebSocket override...");

(function () {
    'use strict';

    const OriginalWebSocket = window.WebSocket;

    class CustomWebSocket extends OriginalWebSocket {
        constructor(url, protocols) {
            console.log('[CustomWebSocket] Connecting to:', url);
            super(url, protocols);

            this.addEventListener('open', () => {
                console.log('[CustomWebSocket] Connection opened:', url);
            });

            this.addEventListener('message', (event) => {
                if (event.data instanceof Blob) {
                    event.data.arrayBuffer().then(buffer => {
                        console.log('[CustomWebSocket] Received Binary Data:', new Uint8Array(buffer));
                    });
                } else {
                    console.log('[CustomWebSocket] Received:', event.data);
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
                console.warn('[CustomWebSocket] Attempted to send data while WebSocket was not open:', data);
            }
        }

        close(code, reason) {
            console.log('[CustomWebSocket] Closing connection:', code, reason);
            super.close(code, reason);
        }
    }

    setTimeout(() => {
        window.WebSocket = CustomWebSocket;
        console.log('[CustomWebSocket] Override Applied');
    }, 1000);

})();
