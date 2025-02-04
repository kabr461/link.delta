(function() {
    const OriginalWebSocket = window.WebSocket;
    let activeSockets = [];

    class CustomWebSocket extends OriginalWebSocket {
        constructor(url, protocols) {
            super(url, protocols);
            this.url = url;
            this.protocols = protocols;
            this.binaryType = 'arraybuffer';

            console.log(`[WebSocket] Created: ${url}`);

            // Store the active socket instance
            activeSockets.push(this);

            this.addEventListener('open', () => {
                console.log('[WebSocket] Connected:', this.url);
            });

            this.addEventListener('message', (event) => {
                if (event.data instanceof ArrayBuffer) {
                    let dataView = new DataView(event.data);
                    let opcode = dataView.getUint8(0); // Get first byte as opcode
                    console.log(`[RECEIVE] Opcode: ${opcode}`, new Uint8Array(event.data));
                } else {
                    console.log('[RECEIVE] Non-binary message intercepted:', event.data);
                }
            });

            this.addEventListener('error', (error) => {
                console.warn('[WebSocket] Error:', error);
            });

            this.addEventListener('close', (event) => {
                console.warn('[WebSocket] Closed:', event.code, event.reason);
                activeSockets = activeSockets.filter(socket => socket !== this);
                if (!event.wasClean) {
                    setTimeout(() => {
                        console.log('[WebSocket] Reconnecting...');
                        new CustomWebSocket(this.url, this.protocols);
                    }, 3000);
                }
            });
        }

        send(data) {
            if (this.readyState === WebSocket.OPEN) {
                console.log('[SEND] Sending:', data);
                OriginalWebSocket.prototype.send.call(this, data);
            } else {
                console.warn('[SEND] Attempted to send while WebSocket is not open:', data);
            }
        }

        close(code = 1000, reason = '') {
            console.log(`[WebSocket] Closing: ${this.url}`);
            super.close(code, reason);
        }
    }

    window.WebSocket = CustomWebSocket;
})();
