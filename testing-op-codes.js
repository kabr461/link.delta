(function() {
    console.log("✅ Injecting Hook to Capture Decompressed Messages");

    // Step 1: Hook into WebSocket message processing
    let openWebSocket = window.WebSocket;
    window.WebSocket = function(url, protocols) {
        const ws = new openWebSocket(url, protocols);

        ws.addEventListener("message", function(event) {
            try {
                let rawData = event.data;
                console.log("📥 [RAW Incoming WebSocket Message]:", rawData);

                if (rawData instanceof ArrayBuffer) {
                    let binaryData = new Uint8Array(rawData);
                    console.log("🔵 Binary Data Detected! Intercepting Processing...");

                    // Step 2: Override WebSocket's message processor
                    setTimeout(() => {
                        console.log("📂 [Intercepted Final Decompressed Message]:", binaryData);
                    }, 5); // Small delay to ensure processing

                } else {
                    console.warn("⚠️ Unknown WebSocket Message Format:", rawData);
                }

            } catch (error) {
                console.error("❌ Error Intercepting Delta Messages:", error);
            }
        });

        return ws;
    };

})();
