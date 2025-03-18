(function() {
    const OriginalWebSocket = window.WebSocket;

    class CustomWebSocket extends OriginalWebSocket {
        constructor(url, protocols) {
            super(url, protocols);
            console.log('[CustomWebSocket] Connecting to:', url);

            this.addEventListener('message', (event) => {
                if (event.data instanceof ArrayBuffer) {
                    console.log('[WebSocket Received Binary]:', new Uint8Array(event.data));
                } else if (event.data instanceof Blob) {
                    event.data.arrayBuffer().then(buffer => {
                        console.log('[WebSocket Received Blob]:', new Uint8Array(buffer));
                    });
                } else {
                    console.log('[WebSocket Received]:', event.data);
                }
            });

            this.send = new Proxy(this.send, {
                apply: function(target, thisArg, argumentsList) {
                    let data = argumentsList[0];

                    if (typeof data === "string") {
                        console.log('[WebSocket Sent]:', data);
                    } else if (data instanceof ArrayBuffer) {
                        console.log('[WebSocket Sent Binary]:', new Uint8Array(data));
                    }

                    return target.apply(thisArg, argumentsList);
                }
            });
        }
    }

    window.WebSocket = CustomWebSocket;
})();
