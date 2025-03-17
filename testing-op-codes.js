(function() {
    let OriginalWebSocket = window.WebSocket;
    let sessionLogs = [];
    let startTime = Date.now();

    window.WebSocket = function(url, protocols) {
        console.log("WebSocket Created:", url);
        let ws = new OriginalWebSocket(url, protocols);

        // Wrap send function
        ws.send = new Proxy(ws.send, {
            apply: function(target, thisArg, argumentsList) {
                let timeElapsed = (Date.now() - startTime) / 1000;
                let data = argumentsList[0];

                if (typeof data === "string") {
                    sessionLogs.push({ time: timeElapsed, type: "sent", data: data });
                } else if (data instanceof ArrayBuffer) {
                    sessionLogs.push({ time: timeElapsed, type: "sent", data: Array.from(new Uint8Array(data)) });
                }

                return target.apply(thisArg, argumentsList);
            }
        });

        // Wrap onmessage to capture incoming packets
        ws.addEventListener("message", function(event) {
            let timeElapsed = (Date.now() - startTime) / 1000;

            if (typeof event.data === "string") {
                sessionLogs.push({ time: timeElapsed, type: "received", data: event.data });
            } else if (event.data instanceof Blob) {
                let reader = new FileReader();
                reader.onload = function() {
                    let buffer = new Uint8Array(reader.result);
                    sessionLogs.push({ time: timeElapsed, type: "received", data: Array.from(buffer) });
                };
                reader.readAsArrayBuffer(event.data);
            }
        });

        return ws;
    };

    // Stop capturing after 15 seconds and save to file
    setTimeout(() => {
        let blob = new Blob([JSON.stringify(sessionLogs, null, 2)], { type: "application/json" });
        let link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "websocket_logs.json";
        link.click();
        console.log("Saved WebSocket logs!");
    }, 15000);
})();
