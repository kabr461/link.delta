(function() {
    'use strict';

    console.log("Minimal Delta Observer loaded.");

    // Save reference to the original WebSocket constructor.
    const OriginalWebSocket = window.WebSocket;

    // Override the constructor to add our listener, but do not alter existing behavior.
    window.WebSocket = function(url, protocols) {
        const ws = new OriginalWebSocket(url, protocols);

        // Add a passive listener that logs incoming messages.
        ws.addEventListener('message', function(event) {
            // If the data is binary, decode it carefully.
            if (event.data instanceof ArrayBuffer) {
                try {
                    const dataString = new TextDecoder("utf-8").decode(event.data);
                    console.log("Observed WebSocket message (binary):", dataString);
                } catch (e) {
                    console.error("Error decoding binary message:", e);
                }
            } else {
                console.log("Observed WebSocket message:", event.data);
            }
            // Do not alter or stop propagation—just observe.
        }, { passive: true });

        return ws;
    };

    // Ensure the prototype remains intact.
    window.WebSocket.prototype = OriginalWebSocket.prototype;
})();
