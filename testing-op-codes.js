(function() {
    let originalSend = WebSocket.prototype.send;
    let originalOnMessage = WebSocket.prototype.onmessage;
    let packetLog = [];

    function logPacket(type, data) {
        let timestamp = performance.now();
        let opcode = data[0];  // First byte (Opcode)
        let length = data.length;

        packetLog.push({ type, timestamp, opcode, length, data: Array.from(data) });

        if (packetLog.length > 5000) { 
            packetLog = packetLog.slice(-5000); // Keep last 5000 packets
        }
    }

    WebSocket.prototype.send = function(data) {
        if (data instanceof ArrayBuffer) {
            logPacket("outgoing", new Uint8Array(data));
        }
        return originalSend.apply(this, arguments); // Properly maintaining the execution context
    };

    let openHandler = function(event) {
        console.log("[WebSocket] Connected:", event);
    };

    let messageHandler = function(event) {
        if (event.data instanceof ArrayBuffer) {
            logPacket("incoming", new Uint8Array(event.data));
        }
    };

    let closeHandler = function(event) {
        console.log("[WebSocket] Closed:", event);
    };

    let errorHandler = function(event) {
        console.log("[WebSocket] Error:", event);
    };

    let originalWebSocket = WebSocket;
    WebSocket = function(url, protocols) {
        let ws = new originalWebSocket(url, protocols);

        ws.addEventListener("open", openHandler);
        ws.addEventListener("message", messageHandler);
        ws.addEventListener("close", closeHandler);
        ws.addEventListener("error", errorHandler);

        return ws;
    };

    WebSocket.prototype = originalWebSocket.prototype;
    
    // Save logs every 10 seconds
    setInterval(() => {
        if (packetLog.length > 0) {
            localStorage.setItem("packetLog", JSON.stringify(packetLog.slice(0, 5000)));
            console.log(`[LOG] Saved ${packetLog.length} packets`);
        }
    }, 10000);

    window.getPacketLog = function() {
        return JSON.parse(localStorage.getItem("packetLog")) || [];
    };

    window.analyzePackets = function() {
        let log = getPacketLog();
        let opcodeCounts = {};

        log.forEach(packet => {
            opcodeCounts[packet.opcode] = (opcodeCounts[packet.opcode] || 0) + 1;
        });

        console.log("Opcode Frequency:", opcodeCounts);
    };

    window.findClickPackets = function() {
        let log = getPacketLog();
        let clickPackets = log.filter(p => p.type === "outgoing" && p.length < 10);
        console.log("Possible Spectator Click Packets:", clickPackets);
    };

    window.findMovementPackets = function() {
        let log = getPacketLog();
        let movementPackets = log.filter(p => p.type === "outgoing" && p.length === 13);
        console.log("Possible Movement Packets:", movementPackets);
    };

})();
