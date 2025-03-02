(function() {
    console.log("✅ Injecting Delta Decompression Hook");

    let deltaDecompress = null;

    try {
        // Search for Delta’s decompression function
        for (let key in window) {
            if (window.hasOwnProperty(key) && typeof window[key] === "object") {
                for (let subKey in window[key]) {
                    if (typeof window[key][subKey] === "function" && window[key][subKey].toString().includes("_decompress")) {
                        deltaDecompress = window[key][subKey];
                        console.log("✅ Found Delta's Decompression Function:", deltaDecompress);
                        window.exposedDeltaDecompress = deltaDecompress;
                        break;
                    }
                }
            }
        }
    } catch (error) {
        console.warn("⚠️ Failed to extract Delta's decompression function:", error);
    }

    if (!deltaDecompress) {
        console.error("❌ Delta Decompression Function NOT Found. Hook Failed!");
        return;
    }

    // Override WebSocket to use Delta’s decompression
    const OriginalWebSocket = window.WebSocket;

    window.WebSocket = function(url, protocols) {
        const ws = new OriginalWebSocket(url, protocols);

        ws.addEventListener("message", function(event) {
            try {
                let rawData = event.data;
                console.log("📥 [RAW Incoming WebSocket Message]:", rawData);

                if (rawData instanceof ArrayBuffer) {
                    let binaryData = new Uint8Array(rawData);
                    console.log("🔵 Binary Data Detected! Passing to Delta Decompression...");

                    let decodedData = deltaDecompress(binaryData);
                    console.log("📂 [Decompressed Data from Delta]:", decodedData);
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
