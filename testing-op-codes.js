(function () {
    const messages = [];
    const opcodeRegistry = {};

    const OriginalWebSocket = window.WebSocket;

    class CustomWebSocket extends OriginalWebSocket {
        constructor(url, protocols) {
            super(url, protocols);
            console.log('[CustomWebSocket] Connecting to:', url);

            this.addEventListener('message', async (event) => {
                let buffer;
                if (event.data instanceof ArrayBuffer) {
                    buffer = event.data;
                } else if (event.data instanceof Blob) {
                    buffer = await event.data.arrayBuffer();
                }

                if (buffer) {
                    processBinaryData(buffer);
                }
            });

            this.addEventListener('close', (event) => {
                console.warn('[CustomWebSocket] Connection closed:', event);
                setTimeout(() => {
                    console.log('[CustomWebSocket] Attempting to reconnect...');
                    window.WebSocket = CustomWebSocket; // Ensure override stays
                    new CustomWebSocket(this.url, this.protocols);
                }, 1000);
            });
        }
    }

    function processBinaryData(buffer) {
        const dataArray = new Uint8Array(buffer);
        if (dataArray.length >= 2) {
            const opcode = dataArray[0];
            const signalStrength = dataArray[1];
            const rawMessage = Array.from(dataArray.slice(2)).map(byte => byte.toString(16).padStart(2, "0")).join(" ");

            // Store messages
            const timestamp = Date.now();
            messages.push({ timestamp, opcode, signalStrength, messageSize: dataArray.length, rawMessage });

            // Store opcodes & frequency
            if (!opcodeRegistry[opcode]) {
                opcodeRegistry[opcode] = { count: 0, timestamps: [] };
            }
            opcodeRegistry[opcode].count++;
            opcodeRegistry[opcode].timestamps.push(timestamp);
        }
    }

    // Apply the override after a delay
    setTimeout(() => {
        window.WebSocket = CustomWebSocket;
        console.log('[CustomWebSocket] WebSocket Override Applied');
    }, 1000);

    // Function to analyze opcodes
    window.analyzeOpcodes = function () {
        console.log("[CustomWebSocket] Opcode Registry Analysis:");
        console.table(opcodeRegistry);
    };

    // Auto-save messages after 30 seconds
    setTimeout(() => {
        const finalData = { messages, opcodeRegistry };
        const blob = new Blob([JSON.stringify(finalData, null, 2)], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "websocket_logs.json";
        a.click();
    }, 30000);

    console.log("✅ WebSocket logging started for 30 seconds...");
})();
