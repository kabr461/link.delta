(function persistScript() {
    if (localStorage.getItem("injectWebSocketHook") !== "true") {
        localStorage.setItem("injectWebSocketHook", "true");
        console.log("WebSocket Hook: Persistent Mode Enabled. Reload the page now!");
    } else {
        console.log("Re-injecting WebSocket Hook...");

        const originalSend = WebSocket.prototype.send;
        const originalWebSocket = window.WebSocket;

        // Override WebSocket to store instance
        window.WebSocket = function(url, protocols) {
            console.log("Intercepting WebSocket Creation:", url);
            const socket = new originalWebSocket(url, protocols);
            window.hiddenGameSocket = socket; // Store for later use
            
            // Hook messages to log opcodes
            socket.addEventListener("message", (event) => {
                if (event.data instanceof ArrayBuffer) {
                    const view = new DataView(event.data);
                    const opcode = view.getUint8(0); // Read first byte (opcode)
                    console.log("[RECEIVED] Opcode:", opcode, "Raw Data:", new Uint8Array(event.data));
                }
            });

            return socket;
        };

        // Hook send method to log outgoing messages
        WebSocket.prototype.send = function(data) {
            console.log("[SENT] Intercepted WebSocket Message:", data);

            if (data instanceof ArrayBuffer || data instanceof Uint8Array) {
                const view = new DataView(data);
                const opcode = view.getUint8(0);
                console.log("[SENT] Opcode:", opcode, "Raw Data:", new Uint8Array(data));
            }

            originalSend.call(this, data);
        };

        console.log("✅ WebSocket Hook Successfully Applied!");
    }
})();
