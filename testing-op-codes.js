console.log("[WebSocket Debug] Initializing WebSocket Analyzer...");

(function () {
    "use strict";

    // Opcode tracking for classification
    const opcodeRegistry = {}; // { opcode: { type: string, count: number, messageSizes: [], function: string } }
    let opcodeSummary = {};
    let lastSummaryTime = Date.now();
    const previousOpcodes = {}; // Stores past opcode behaviors
    let wsInstance = null; // Stores active WebSocket instance

    // Adds a test button on the main page
    function addTestButton() {
        const button = document.createElement("button");
        button.innerText = "Test WebSocket";
        button.style.position = "fixed";
        button.style.top = "10px";
        button.style.right = "10px";
        button.style.zIndex = "9999";
        button.onclick = () => {
            const latestOpcode = Object.keys(opcodeRegistry).pop();
            console.log(`[WebSocket Debug] Sending test opcode: ${latestOpcode}`);
            if (wsInstance && latestOpcode !== undefined) {
                sendOpcode(wsInstance, parseInt(latestOpcode) || 0, [1, 2, 3]);
            } else {
                console.warn("[WebSocket Debug] No active WebSocket instance or detected opcode.");
            }
        };
        document.body.appendChild(button);
    }

    // Dynamically classify opcode type based on patterns
    function detectOpcodeType(opcode, data) {
        if (previousOpcodes[opcode]) {
            return previousOpcodes[opcode].type;
        }

        if (data.length === 6) return "movement";
        if (data.length >= 10 && data.includes(0)) return "rendering"; // Assuming 0 indicates rendering
        return "unknown";
    }

    // Custom WebSocket Override
    class CustomWebSocket extends window.WebSocket {
        constructor(url, protocols) {
            super(url, protocols);
            console.log("[CustomWebSocket] Connecting to:", url);
            wsInstance = this;

            this.addEventListener("message", (event) => {
                if (event.data instanceof ArrayBuffer) {
                    processBinaryData(event.data);
                } else if (event.data instanceof Blob) {
                    event.data.arrayBuffer().then((buffer) => processBinaryData(buffer));
                }
            });
        }

        send(data) {
            if (data instanceof Uint8Array) {
                const opcode = data[0];
                if (!opcodeRegistry[opcode]) {
                    console.log(`New opcode detected: ${opcode}`);
                }
                opcodeRegistry[opcode] = opcodeRegistry[opcode] || { type: "unknown", count: 0, messageSizes: [] };
                opcodeRegistry[opcode].count += 1;
            }
            super.send(data);
        }
    }

    // Processes incoming WebSocket messages
    function processBinaryData(buffer) {
        const dataArray = new Uint8Array(buffer);
        if (dataArray.length < 2) return;

        const opcode = dataArray[0]; // First byte as opcode
        const messageSize = dataArray.length;
        const additionalData = dataArray.slice(1); // The remaining data

        // If this opcode was seen before, assign its previous type
        const functionType = detectOpcodeType(opcode, additionalData);

        // Store the opcode's behavior for future classification
        previousOpcodes[opcode] = {
            type: functionType,
            messageSize: messageSize,
        };

        // Update registry
        opcodeRegistry[opcode] = opcodeRegistry[opcode] || { type: functionType, count: 0, messageSizes: [] };
        opcodeRegistry[opcode].count += 1;

        // Ensure message structure is logged correctly
        if (!opcodeRegistry[opcode].messageSizes.includes(messageSize)) {
            opcodeRegistry[opcode].messageSizes.push(messageSize);
        }

        // Summary logging every second
        if (!opcodeSummary[opcode]) {
            opcodeSummary[opcode] = 1;
        } else {
            opcodeSummary[opcode] += 1;
        }

        if (Date.now() - lastSummaryTime > 10000) {
            console.clear();
            console.log(`[CustomWebSocket] Opcode Frequency Summary (Last 1s)`);
            console.table(opcodeSummary);
            opcodeSummary = {};
            lastSummaryTime = Date.now();
        }
    }

    // Sends structured messages dynamically
    function sendOpcode(socket, opcode, data = []) {
        let message = new Uint8Array([opcode, ...data]);
        socket.send(message);
    }

    // Override WebSocket globally after 1 second for stability
    setTimeout(() => {
        window.WebSocket = CustomWebSocket;
        console.log("[CustomWebSocket] WebSocket Override Applied");
        addTestButton();
    }, 1000);

    // Analyze collected opcode data
    window.analyzeOpcodes = function () {
        console.log("[CustomWebSocket] Opcode Registry Analysis:");
        console.table(opcodeRegistry);
    };
})();
