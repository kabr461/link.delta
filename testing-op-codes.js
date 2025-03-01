(function() {
    console.log("✅ Delta Message Interceptor Injected");

    // Store the original WebSocket constructor
    const OriginalWebSocket = window.WebSocket;

    // Override WebSocket to intercept incoming messages
    window.WebSocket = function(url, protocols) {
        const ws = new OriginalWebSocket(url, protocols);

        // Hook into the 'onmessage' event to capture incoming data
        ws.addEventListener("message", function(event) {
            try {
                let decompressedData = event.data;  // The message received from the server
                let parsedData;

                console.log("📥 [RAW Incoming WebSocket Message]:", decompressedData);

                // Detect message type
                if (typeof decompressedData === "string") {
                    // Likely JSON-based message
                    try {
                        parsedData = JSON.parse(decompressedData);
                        console.log("📂 [Extracted JSON Decompressed Message BEFORE Delta Processing]:", parsedData);
                    } catch (jsonErr) {
                        console.warn("⚠️ JSON Parsing Failed, Raw String Data:", decompressedData);
                    }
                } else if (decompressedData instanceof Blob || decompressedData instanceof ArrayBuffer) {
                    // Binary message (Blob or ArrayBuffer)
                    console.log("🔵 Binary Data Detected! Attempting to Decode...");

                    let reader = new FileReader();
                    reader.onload = function() {
                        let binaryText = new Uint8Array(reader.result);
                        console.log("📂 [Extracted Binary Decompressed Message BEFORE Delta Processing]:", binaryText);

                        // Try converting binary to a readable string (UTF-8)
                        try {
                            let decodedText = new TextDecoder("utf-8").decode(binaryText);
                            console.log("📝 [Decoded Binary to Text]:", decodedText);
                        } catch (decodeErr) {
                            console.warn("⚠️ Failed to Decode Binary Data to Text");
                        }
                    };

                    // Read as an ArrayBuffer
                    reader.readAsArrayBuffer(new Blob([decompressedData]));
                } else {
                    console.warn("⚠️ Unknown Message Type:", decompressedData);
                }

            } catch (error) {
                console.error("❌ Error Intercepting Delta Messages:", error);
            }
        });

        return ws;
    };

})();
