(function() {
    'use strict';

    console.log("WebSocket Hook Injected for Opcode Discovery");

    const originalSend = WebSocket.prototype.send;
    const originalOnMessage = WebSocket.prototype.onmessage;

    WebSocket.prototype.send = function(data) {
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

        originalSend.call(this, data);
    };

    WebSocket.prototype.onmessage = function(event) {
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

        if (originalOnMessage) {
            originalOnMessage.call(this, event);
        }
    };

    const oldWebSocket = window.WebSocket;
    window.WebSocket = function(url, protocols) {
        console.log("[WebSocket] Intercepting WebSocket Creation:", url);
        const socket = new oldWebSocket(url, protocols);
        window.hiddenGameSocket = socket;
        return socket;
    };

})();
