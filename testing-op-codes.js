(function() {
    'use strict';

    console.log("WebSocket Hook Injected for Opcode Discovery");

    // Save original WebSocket prototype methods
    const OriginalWebSocket = window.WebSocket;
    const originalSend = WebSocket.prototype.send;

    // Override WebSocket constructor safely
    window.WebSocket = function(url, protocols) {
        const socket = new OriginalWebSocket(url, protocols);
        console.log("[WebSocket] Created:", url);

        // Bind the original send method safely
        socket.send = function(data) {
            if (data instanceof ArrayBuffer || data instanceof Uint8Array) {
                try {
                    const view = new DataView(data);
                    const opcode = view.getUint8(0);
                    console.log("[SEND] Opcode:", opcode, "Raw Data:", new Uint8Array(data));
                } catch (error) {
                    console.warn("[SEND] Error reading WebSocket data:", error);
                }
            } else {
                console.warn("[SEND] Non-binary message intercepted:", data);
            }
            return originalSend.apply(socket, arguments);
        }.bind(socket);

        // Intercept messages received from the server
        socket.addEventListener('message', function(event) {
            if (event.data instanceof ArrayBuffer) {
                try {
                    const view = new DataView(event.data);
                    const opcode = view.getUint8(0);
                    console.log("[RECEIVE] Opcode:", opcode, "Raw Data:", new Uint8Array(event.data));
                } catch (error) {
                    console.warn("[RECEIVE] Error reading WebSocket data:", error);
                }
            } else {
                console.warn("[RECEIVE] Non-binary message intercepted:", event.data);
            }
        });

        return socket;
    };

    // Restore the WebSocket prototype for safety
    window.WebSocket.prototype = OriginalWebSocket.prototype;

})();
