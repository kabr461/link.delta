(function() {
    console.log("✅ Injecting Webpack Hook to Extract Delta’s Decompression Function");

    // Ensure Webpack module system exists
    if (!window.webpackChunkdeltav7) {
        console.error("❌ Webpack Chunk System Not Found! Hook Failed.");
        return;
    }

    // Hook into Webpack's module system
    let webpackModules = {};
    try {
        window.webpackChunkdeltav7.push([
            [Math.random()], 
            {}, 
            (modules) => { webpackModules = modules; }
        ]);
    } catch (error) {
        console.error("❌ Failed to Hook Webpack Chunk System:", error);
        return;
    }

    console.log("🔍 Webpack Modules Extracted:", Object.keys(webpackModules));

    // Locate Delta's decompression function inside the extracted modules
    let deltaDecompress = null;
    for (let moduleId in webpackModules) {
        try {
            let moduleExports = webpackModules[moduleId]();
            for (let key in moduleExports) {
                if (typeof moduleExports[key] === "function" && moduleExports[key].toString().includes("_decompress")) {
                    deltaDecompress = moduleExports[key];
                    console.log("✅ Successfully Extracted Delta’s Decompression Function!", deltaDecompress);
                    window.exposedDeltaDecompress = deltaDecompress;
                    break;
                }
            }
        } catch (error) {
            continue;
        }
    }

    if (!deltaDecompress) {
        console.error("❌ Delta’s Decompression Function Not Found in Webpack Modules. Hook Failed!");
        return;
    }

    // Override WebSocket to Use Extracted Delta Decompression
    const OriginalWebSocket = window.WebSocket;

    window.WebSocket = function(url, protocols) {
        const ws = new OriginalWebSocket(url, protocols);

        ws.addEventListener("message", function(event) {
            try {
                let rawData = event.data;
                console.log("📥 [RAW Incoming WebSocket Message]:", rawData);

                if (rawData instanceof ArrayBuffer) {
                    let binaryData = new Uint8Array(rawData);
                    console.log("🔵 Binary Data Detected! Passing to Delta’s Decompression...");

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
