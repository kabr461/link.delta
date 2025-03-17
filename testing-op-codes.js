const OriginalWebSocket = window.WebSocket;
let sessionLogs = [];
let startTime = Date.now();

class CustomWebSocket extends OriginalWebSocket {
    constructor(url, protocols) {
        super(url, protocols);
        console.log('[CustomWebSocket] Connecting to:', url);

        this.addEventListener('message', (event) => {
            let timeElapsed = (Date.now() - startTime) / 1000;

            if (event.data instanceof ArrayBuffer) {
                sessionLogs.push({ time: timeElapsed, type: "received", data: Array.from(new Uint8Array(event.data)) });
            } else if (event.data instanceof Blob) {
                event.data.arrayBuffer().then(buffer => {
                    sessionLogs.push({ time: timeElapsed, type: "received", data: Array.from(new Uint8Array(buffer)) });
                });
            } else {
                sessionLogs.push({ time: timeElapsed, type: "received", data: event.data });
            }
        });

        this.addEventListener('close', (event) => {
            console.warn('[CustomWebSocket] Connection closed:', event);
            setTimeout(() => {
                console.log('[CustomWebSocket] Attempting to reconnect...');
                window.WebSocket = new CustomWebSocket(this.url, this.protocols);
            }, 1000);
        });

        this.send = new Proxy(this.send, {
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
    }
}

// Override WebSocket
window.WebSocket = CustomWebSocket;

// Save logs after 15 seconds
setTimeout(() => {
    let blob = new Blob([JSON.stringify(sessionLogs, null, 2)], { type: "application/json" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "websocket_logs.json";
    link.click();
    console.log("Saved WebSocket logs!");
}, 15000);
