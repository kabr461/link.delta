(function() {
    'use strict';

    console.log("WebSocket Hook Injected");

    // Store the original WebSocket send function
    const originalSend = WebSocket.prototype.send;

    WebSocket.prototype.send = function(data) {
        if (data instanceof ArrayBuffer || data instanceof Uint8Array) {
            const view = new DataView(data);
            const opcode = view.getUint8(0); // First byte = opcode
            console.log("Intercepted WebSocket Send: Opcode =", opcode, "Data:", new Uint8Array(data));

            // Modify click opcode if detected (replace 99 with actual click opcode)
            if (opcode === 99) {
                console.log("Modifying Click Data to Send Wave!");

                let modifiedData = new Uint8Array(data.byteLength);
                modifiedData.set(new Uint8Array(data));

                modifiedData[0] = 150; // Change opcode to custom wave action

                data = modifiedData.buffer;
            }
        }
        originalSend.call(this, data);
    };

    document.addEventListener("mousedown", function(event) {
        console.log("Mouse Click at:", event.clientX, event.clientY);

        if (window.hiddenGameSocket) {
            console.log("Sending Wave Action!");

            let waveMessage = new Uint8Array(13);
            let view = new DataView(waveMessage.buffer);

            view.setUint8(0, 150); // Custom wave opcode
            view.setFloat32(1, event.clientX, true); // X position
            view.setFloat32(5, event.clientY, true); // Y position
            view.setFloat32(9, 2.5, true); // Duration

            window.hiddenGameSocket.send(waveMessage.buffer);
        } else {
            console.log("No active WebSocket found.");
        }
    }, true);

    // Hook into WebSocket creation to track the active socket
    const oldWebSocket = window.WebSocket;
    window.WebSocket = function(url, protocols) {
        console.log("Intercepting WebSocket Creation:", url);
        const socket = new oldWebSocket(url, protocols);
        window.hiddenGameSocket = socket;
        return socket;
    };

})();
