(function () {
    const messages = [];
    const opcodeStats = {};

    function hexFormat(buffer) {
        return [...new Uint8Array(buffer)]
            .map(b => b.toString(16).padStart(2, "0"))
            .join(" ");
    }

    function logMessage(type, data) {
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

    WebSocket.prototype._send = WebSocket.prototype.send;
    WebSocket.prototype.send = function (data) {
        logMessage("send", data);
        return this._send(data);
    };

    WebSocket.prototype._onmessage = WebSocket.prototype.onmessage;
    WebSocket.prototype.onmessage = function (event) {
        logMessage("receive", event.data);
        return this._onmessage ? this._onmessage(event) : null;
    };

    setTimeout(() => {
        const finalData = { messages, opcodeStats };
        const blob = new Blob([JSON.stringify(finalData, null, 2)], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "websocket_logs.json";
        a.click();
    }, 30000);

    console.log("WebSocket logging started for 30 seconds...");
})();
