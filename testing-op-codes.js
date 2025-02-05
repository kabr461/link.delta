console.log("[WebSocket Debug] Initializing WebSocket Analyzer...");

(function () {
    'use strict';

    // Add a button to the home page for testing
    function addTestButton() {
        const button = document.createElement('button');
        button.innerText = 'Test WebSocket';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.onclick = () => {
            const latestOpcode = Object.keys(opcodeRegistry).pop();
            console.log(`[WebSocket Debug] Sending test opcode: ${latestOpcode}`);
            if (window.wsInstance && latestOpcode) {
                window.sendOpcode(window.wsInstance, parseInt(latestOpcode), [1, 2, 3]);
            } else {
                console.warn("[WebSocket Debug] No active WebSocket instance or detected opcode.");
            }
        };
        document.body.appendChild(button);
    }

    // Opcode registry for classification
    const opcodeRegistry = {};  // { opcode: { type: string, count: number, strongestSignal: number, messageSizes: [], function: string } }
    let opcodeSummary = {};  // Temporary summary to show per second
    let lastSummaryTime = Date.now();
    const messageQueue = [];
    let processingQueue = false;

    function processSignal(data) {
        if (!data || data.opcode === undefined) return;

        const opcode = data.opcode;
        const signalStrength = data.signalStrength || 0;
        const messageSize = data.messageSize || 0;
        const additionalData = data.additionalData || [];

        if (!opcodeRegistry[opcode]) {
            opcodeRegistry[opcode] = { type: detectOpcodeType(opcode), function: "unknown", count: 1, strongestSignal: signalStrength, messageSizes: [messageSize] };
        } else {
            opcodeRegistry[opcode].count += 1;
            opcodeRegistry[opcode].strongestSignal = Math.max(opcodeRegistry[opcode].strongestSignal, signalStrength);
            if (!opcodeRegistry[opcode].messageSizes.includes(messageSize)) {
                opcodeRegistry[opcode].messageSizes.push(messageSize);
            }
        }

        if (!opcodeSummary[opcode]) {
            opcodeSummary[opcode] = 1;
        } else {
            opcodeSummary[opcode] += 1;
        }

        if (Date.now() - lastSummaryTime > 1000) {
            console.clear(); 
            console.log(`[CustomWebSocket] Opcode Frequency Summary (Last 1s)`);
            console.table(opcodeSummary);
            opcodeSummary = {};
            lastSummaryTime = Date.now();
        }
    }

    function detectOpcodeType(opcode) {
        const knownTypes = {
            16: "movement",
            32: "rendering",
            64: "spectate",
        };
        return knownTypes[opcode] || "unknown";
    }

    const OriginalWebSocket = window.WebSocket;

    class CustomWebSocket extends OriginalWebSocket {
        constructor(url, protocols) {
            super(url, protocols);
            console.log('[CustomWebSocket] Connecting to:', url);
            window.wsInstance = this;

            this.addEventListener('message', (event) => {
                if (event.data instanceof ArrayBuffer) {
                    processBinaryData(event.data);
                } else if (event.data instanceof Blob) {
                    event.data.arrayBuffer().then(buffer => processBinaryData(buffer));
                }
            });

            this.addEventListener('close', (event) => {
                console.warn('[CustomWebSocket] Connection closed:', event);
                setTimeout(() => {
                    console.log('[CustomWebSocket] Attempting to reconnect...');
                    window.WebSocket = new CustomWebSocket(this.url, this.protocols);
                }, 3000);
            });
        }

        send(data) {
            if (data instanceof Uint8Array) {
                const opcode = data[0];
                if (!opcodeRegistry[opcode]) {
                    console.log(`New opcode detected: ${opcode}`);
                }
                opcodeRegistry[opcode] = opcodeRegistry[opcode] || { type: detectOpcodeType(opcode), function: "unknown", count: 0, strongestSignal: 0, messageSizes: [] };
                opcodeRegistry[opcode].count += 1;
            }
            super.send(data);
        }
    }

    function processBinaryData(buffer) {
        const dataArray = new Uint8Array(buffer);
        if (dataArray.length >= 2) {
            const opcode = dataArray[0];  
            const signalStrength = dataArray[1]; 
            const messageSize = dataArray.length;
            const additionalData = dataArray.slice(2);
            processSignal({ opcode, signalStrength, messageSize, additionalData });
        }
    }

    function processQueue(socket) {
        if (processingQueue || messageQueue.length === 0) return;
        processingQueue = true;
        let msg = messageQueue.shift();
        socket.send(msg);
        setTimeout(() => {
            processingQueue = false;
            processQueue(socket);
        }, 50);
    }

    window.sendOpcode = function(socket, opcode, data = []) {
        let message = new Uint8Array([opcode, ...data]);
        messageQueue.push(message);
        processQueue(socket);
    };

    setTimeout(() => {
        window.WebSocket = CustomWebSocket;
        console.log('[CustomWebSocket] WebSocket Override Applied');
        addTestButton();
    }, 1000);

    window.analyzeOpcodes = function () {
        console.log("[CustomWebSocket] Opcode Registry Analysis:");
        console.table(opcodeRegistry);
    };

})();
