(function() {
    console.log("✅ Injecting Webpack Hook to Extract Delta’s Decompression Function");

    let deltaDecompress = null;

    // Webpack Module Hook
    const webpackRequire = window.webpackJsonp 
        ? window.webpackJsonp.push([[], { '': (_, __, r) => r }, [['']]])
        : window.webpackChunkbuild;

    if (!webpackRequire) {
        console.error("❌ Webpack Module System Not Found! Hook Failed.");
        return;
    }

    // Intercept Webpack Modules
    const modules = Object.keys(webpackRequire.m);
    for (let moduleId of modules) {
        try {
            const moduleExports = webpackRequire(moduleId);
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
