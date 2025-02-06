console.log("[WebSocket Debug] Intercepting Delta Messages with Smart Handling...");

(function () {
    "use strict";

    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5; // Prevent infinite loops
    const reconnectTimeout = 3000; // 3-second delay before retrying
    const wsUrl = "wss://chat.delt.io/delta7?protocol=v1"; // Main WebSocket URL

    function initializeWebSocket() {
        if (reconnectAttempts >= maxReconnectAttempts) {
            console.error("[InterceptedWebSocket] ❌ Max reconnection attempts reached. Stopping retries.");
            return;
        }

        console.log("[InterceptedWebSocket] 🚀 Attempting WebSocket Connection...");
        
        try {
            const socket = new WebSocket(wsUrl);
            socket.binaryType = "arraybuffer";

            socket.addEventListener("open", () => {
                reconnectAttempts = 0; // Reset attempts on success
                console.log("[InterceptedWebSocket] ✅ WebSocket Connected!");
            });

            socket.addEventListener("message", handleWebSocketMessage);
            socket.addEventListener("error", handleWebSocketError);
            socket.addEventListener("close", handleWebSocketClose);
        } catch (error) {
            console.error("[InterceptedWebSocket] ❌ WebSocket Error:", error);
            retryConnection();
        }
    }

    function handleWebSocketMessage(event) {
        if (!(event.data instanceof ArrayBuffer)) {
            console.warn("[InterceptedWebSocket] ⚠️ Received unexpected non-binary message:", event);
            return;
        }

        try {
            const dataView = new DataView(event.data);
            const opcode = dataView.getUint8(0);
            console.log(`🔎 Captured OpCode: ${opcode}`);
        } catch (error) {
            console.error("[InterceptedWebSocket] ❌ Error processing WebSocket message:", error);
        }
    }

    function handleWebSocketError(event) {
        console.error("[InterceptedWebSocket] ❌ WebSocket Error:", event);
    }

    function handleWebSocketClose(event) {
        console.warn(`[InterceptedWebSocket] ❌ WebSocket closed (Code: ${event.code})`);
        
        if (event.code === 1006) {
            retryConnection();
        }
    }

    function retryConnection() {
        reconnectAttempts++;
        console.log(`[InterceptedWebSocket] 🔄 Retrying connection in ${reconnectTimeout / 1000}s... (Attempt ${reconnectAttempts}/${maxReconnectAttempts})`);
        setTimeout(initializeWebSocket, reconnectTimeout);
    }

    initializeWebSocket();
})();
