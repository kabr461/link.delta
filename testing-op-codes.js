console.log("[WebSocket Debug] Initializing WebSocket Analyzer...");

(function () {
    'use strict';

    let lastSummaryTime = Date.now();

    // Opcode registry for classification
    const opcodeRegistry = {};
    let opcodeSummary = {};
    const loggedOpcodes = new Set();

    function logOpcodeOnce(opcode) {
        if (!loggedOpcodes.has(opcode)) {
            console.log(`Opcode ${opcode} detected for the first time.`);
            loggedOpcodes.add(opcode);
        }
    }

    function processSignal(data) {
        if (!data || data.opcode === undefined) return;

        const opcode = data.opcode;
        logOpcodeOnce(opcode);

        // Special handling for opcode 25 (Message Sending)
        if (opcode === 25) {
            processMessageOpcode(data);
        }

        const signalStrength = data.signalStrength || 0;
        const messageSize = data.messageSize || 0;

        if (!opcodeRegistry[opcode]) {
            opcodeRegistry[opcode] = { count: 1, strongestSignal: signalStrength, messageSizes: [messageSize] };
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

        if (Date.now() - lastSummaryTime > 10000) {
            console.clear();
            console.log("[CustomWebSocket] Opcode Frequency Summary (Last 10s)");
            console.table(opcodeSummary);
            opcodeSummary = {};
            lastSummaryTime = Date.now();
        }
    }

    function processMessageOpcode(data) {
        if (data.rawMessage) {
            try {
                const messageText = new TextDecoder("utf-8").decode(data.rawMessage);
                console.log(`[Message Sent] ${messageText}`);
                // Normalize message: remove extra spaces, line breaks, etc.
                const cleanedMessage = messageText.replace(/[^\x20-\x7E]/g, "");
                if (cleanedMessage.includes("UJ")) {
                    console.log("UJ detected!");
                }
            } catch (e) {
                console.warn("[Message Parsing Error]", e);
            }
        } else {
            console.warn("[Opcode 25] No message data found.");
        }
    }

    const OriginalWebSocket = window.WebSocket;

    class CustomWebSocket extends OriginalWebSocket {
        constructor(url, protocols) {
            super(url, protocols);
            console.log('[CustomWebSocket] Connecting to:', url);

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
                }, 1000);
            });
        }

        send(data) {
            if (data instanceof ArrayBuffer) {
                let fullArray = new Uint8Array(data);
                if (fullArray.length >= 2 && fullArray[0] === 25) { // Only process opcode 25
                    const header = fullArray.slice(0, 2);
                    const payload = fullArray.slice(2);
                    let messageText = new TextDecoder("utf-8").decode(payload);
                    if (messageText.includes("UJ")) {
                        console.log("UJ detected in outgoing message, replacing with 'up there!'");
                        let modifiedText = messageText.replace(/UJ/g, "up there!");
                        let modifiedBytes = new TextEncoder().encode(modifiedText);
                        let newBuffer = new Uint8Array(header.length + modifiedBytes.length);
                        newBuffer.set(header, 0);
                        newBuffer.set(modifiedBytes, header.length);
                        data = newBuffer.buffer;
                        console.log("Modified outgoing chat message.");
                    }
                }
            }
            super.send(data);
        }
    }

    function processBinaryData(buffer) {
        const dataArray = new Uint8Array(buffer);
        if (dataArray.length >= 2) {
            const opcode = dataArray[0];
            const signalStrength = dataArray[1];
            const rawMessage = buffer.slice(2);
            processSignal({ opcode, signalStrength, messageSize: dataArray.length, rawMessage });
        }
    }

    setTimeout(() => {
        window.WebSocket = CustomWebSocket;
        console.log('[CustomWebSocket] WebSocket Override Applied');
    }, 1000);

    window.analyzeOpcodes = function () {
        console.log("[CustomWebSocket] Opcode Registry Analysis:");
        console.table(opcodeRegistry);
    };

})();
