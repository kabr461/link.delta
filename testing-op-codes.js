console.log("[WebSocket Debug] Intercepting Delta Messages with Smart Handling...");

(function () {
    "use strict";

    var reconnectAttempts = 0;
    var maxReconnectAttempts = 5;
    var reconnectTimeout = 1000; // 1 second delay between reconnects

    function isValidArrayBuffer(data) {
        return data instanceof ArrayBuffer;
    }

    function isValidWebSocketData(event) {
        return event.data instanceof ArrayBuffer || event.data instanceof Blob;
    }

    function getDataView(data) {
        if (!isValidArrayBuffer(data)) return null;
        return new DataView(data);
    }

    function processSignal(data) {
        var view = getDataView(data.rawData);
        if (!view || typeof data.opcode === "undefined") return;

        try {
            console.log("🔎 Processing OpCode:", data.opcode);
        } catch (e) {
            console.error("Error processing signal:", e);
        }
    }

    function handleWebSocketError(event) {
        console.error("[InterceptedWebSocket] ❌ WebSocket Error:", event);
    }

    function handleWebSocketClose(event) {
        console.warn("[InterceptedWebSocket] ❌ Connection closed:", event);
        if (event.code === 1006) {
            if (reconnectAttempts < maxReconnectAttempts) {
                reconnectAttempts++;
                console.log(`[InterceptedWebSocket] 🔄 Reconnecting in ${reconnectTimeout / 1000}s...`);
                setTimeout(initializeWebSocket, reconnectTimeout);
            } else {
                console.error("[InterceptedWebSocket] ❌ Max reconnection attempts reached!");
            }
        }
    }

    function handleWebSocketMessage(event) {
        if (!isValidWebSocketData(event)) {
            console.warn("Received invalid WebSocket data:", event);
            return;
        }

        try {
            if (event.data instanceof Blob) {
                event.data.arrayBuffer().then(processBinaryData).catch(console.error);
            } else {
                processBinaryData(event.data);
            }
        } catch (e) {
            console.error("Error processing WebSocket message:", e);
        }
    }

    function processBinaryData(buffer) {
        if (!isValidArrayBuffer(buffer)) return;

        try {
            var dataArray = new Uint8Array(buffer);
            if (dataArray.length >= 2) {
                var opcode = dataArray[0];
                processSignal({ opcode: opcode, messageSize: dataArray.length, rawData: buffer });
            }
        } catch (e) {
            console.error("Error processing binary data:", e);
        }
    }

    function initializeWebSocket() {
        console.log("[InterceptedWebSocket] 🚀 Initializing WebSocket...");
        try {
            window.websocket = new WebSocket("wss://chat.delt.io/delta7?protocol=v1");
            window.websocket.binaryType = "arraybuffer";

            window.websocket.addEventListener("open", function () {
                reconnectAttempts = 0;
                console.log("[InterceptedWebSocket] ✅ WebSocket Connected!");
            });

            window.websocket.addEventListener("message", handleWebSocketMessage);
            window.websocket.addEventListener("error", handleWebSocketError);
            window.websocket.addEventListener("close", handleWebSocketClose);
        } catch (e) {
            console.error("Error initializing WebSocket:", e);
        }
    }

    initializeWebSocket();
})();
