(function () {
    const messages = [];
    const opcodeStats = {};
    
    function hexFormat(buffer) {
        return [...new Uint8Array(buffer)]
            .map(b => b.toString(16).padStart(2, "0"))
            .join(" ");
    }

    function logMessage(type, data) {
        if (!(data instanceof ArrayBuffer)) return; // Ensure it's binary data

        const timestamp = Date.now();
        const hexData = hexFormat(data);
        const opcode = hexData.split(" ")[0] || "unknown";

        messages.push({ type, timestamp, opcode, hexData });

        if (!opcodeStats[opcode]) {
            opcodeStats[opcode] = { count: 0, times: [] };
        }
        opcodeStats[opcode].count++;
        opcodeStats[opcode].times.push(timestamp);
    }

    const openWebSockets = new Set();

    const OriginalWebSocket = WebSocket;
    window.WebSocket = function (...args) {
        const ws = new OriginalWebSocket(...args);
        openWebSockets.add(ws);

        ws.addEventListener("message", (event) => {
            if (event.data instanceof ArrayBuffer) {
                logMessage("receive", event.data);
            }
        });

        return ws;
    };

    WebSocket.prototype.send = function (data) {
        if (data instanceof ArrayBuffer) {
            logMessage("send", data);
        }
        return OriginalWebSocket.prototype.send.apply(this, arguments);
    };

    setTimeout(() => {
        const finalData = { messages, opcodeStats };
        const blob = new Blob([JSON.stringify(finalData, null, 2)], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "websocket_logs.json";
        a.click();
    }, 30000);

    console.log("✅ WebSocket logging started for 30 seconds...");
})();
