console.log("[WebSocket Debug] Initializing WebSocket Analyzer...");

(function () {
    'use strict';

    // Opcode registry for classification
    const opcodeRegistry = {};
    let opcodeSummary = {};
    let lastSummaryTime = Date.now();
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
            console.log(`[CustomWebSocket] Opcode Frequency Summary (Last 10s)`);
            console.table(opcodeSummary);
            opcodeSummary = {};
            lastSummaryTime = Date.now();
        }
    }

    function processMessageOpcode(data) {
        if (data.rawMessage) {
            try {
                let messageText = new TextDecoder("utf-8").decode(data.rawMessage);
                console.log(`[Message Sent] ${messageText}`);
                
                // Normalize message: Remove extra spaces, line breaks, and special characters
                let cleanedMessage = messageText.replace(/[^\x20-\x7E]/g, ""); // Keep only standard ASCII printable chars
                
                // Check if cleaned message contains 'UJ' (case-sensitive) and replace it
                if (cleanedMessage.includes("UJ")) {
                    cleanedMessage = cleanedMessage.replace(/UJ/g, "up here!");
                    console.log("'UJ' replaced with 'up here!' before sending");
                }
                
                console.log(`[Modified Message] ${cleanedMessage}`);
                
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
            if (typeof data === "string" && data.includes("UJ")) {
                data = data.replace(/UJ/g, "up here!");
                console.log("[CustomWebSocket] Modified outgoing message: ", data);
            }
            super.send(data);
        }
    }

    // New method added to the CustomWebSocket prototype.
    // This allows you to directly send a message with opcode 25 on a connection to "wss://chat.delt.io/delta7?protocol=v1".
    CustomWebSocket.prototype.sendDeltaMessage = function(messageText, signalStrength = 100) {
        // If the connection is already open, send immediately; otherwise, wait for the open event.
        if (this.readyState === this.OPEN) {
            sendOpcode25Message(this, messageText, signalStrength);
        } else {
            this.addEventListener('open', () => {
                sendOpcode25Message(this, messageText, signalStrength);
            });
        }
    };

    function processBinaryData(buffer) {
        const dataArray = new Uint8Array(buffer);
        if (dataArray.length >= 2) {
            const opcode = dataArray[0];
            const signalStrength = dataArray[1];
            const rawMessage = buffer.slice(2); // Extract the message part
            processSignal({ opcode, signalStrength, messageSize: dataArray.length, rawMessage });
        }
    }

    // Existing function to send messages with opcode 25.
    function sendOpcode25Message(ws, messageText, signalStrength = 100) {
        // Opcode 25 indicates a "message sending" operation.
        const opcode = 25;
        const encoder = new TextEncoder();
        const messageBytes = encoder.encode(messageText);

        // Create a buffer with:
        // [opcode (1 byte)] + [signalStrength (1 byte)] + [encoded message]
        const buffer = new Uint8Array(2 + messageBytes.length);
        buffer[0] = opcode;
        buffer[1] = signalStrength;
        buffer.set(messageBytes, 2);

        // Send the ArrayBuffer
        ws.send(buffer.buffer);
        console.log(`[CustomWebSocket] Sent message with opcode 25: "${messageText}" (signalStrength: ${signalStrength})`);
    }

    // Expose the sendOpcode25Message function globally if needed.
    window.sendOpcode25Message = sendOpcode25Message;

    setTimeout(() => {
        window.WebSocket = CustomWebSocket;
        console.log('[CustomWebSocket] WebSocket Override Applied');
    }, 1000);

    window.analyzeOpcodes = function () {
        console.log("[CustomWebSocket] Opcode Registry Analysis:");
        console.table(opcodeRegistry);
    };

})();
