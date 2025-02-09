console.log("[WebSocket Debug] Initializing WebSocket Analyzer...");

(function () {
    'use strict';

    // ------------------------------------------------
    // 1. Opcode Registry and Frequency Tracking
    // ------------------------------------------------
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

    // ------------------------------------------------
    // 2. Process Incoming Signal Data
    // ------------------------------------------------
    function processSignal(data) {
        if (!data || data.opcode === undefined) return;

        const opcode = data.opcode;
        logOpcodeOnce(opcode);

        if (opcode === 25) {
            processMessageOpcode(data);
        }

        const signalStrength = data.signalStrength || 0;
        const messageSize = data.messageSize || 0;

        if (!opcodeRegistry[opcode]) {
            opcodeRegistry[opcode] = {
                count: 1,
                strongestSignal: signalStrength,
                messageSizes: [messageSize]
            };
        } else {
            opcodeRegistry[opcode].count += 1;
            opcodeRegistry[opcode].strongestSignal = Math.max(opcodeRegistry[opcode].strongestSignal, signalStrength);
            if (!opcodeRegistry[opcode].messageSizes.includes(messageSize)) {
                opcodeRegistry[opcode].messageSizes.push(messageSize);
            }
        }

        opcodeSummary[opcode] = (opcodeSummary[opcode] || 0) + 1;

        if (Date.now() - lastSummaryTime > 30000) {
            console.clear();
            console.log(`[CustomWebSocket] Opcode Frequency Summary (Last 10s)`);
            console.table(opcodeSummary);
            opcodeSummary = {};
            lastSummaryTime = Date.now();
        }
    }

    // ------------------------------------------------
    // 3. Process Opcode 25 (Message Sending)
    // ------------------------------------------------
    function processMessageOpcode(data) {
        if (data.rawMessage) {
            const fullBytes = new Uint8Array(data.rawMessage);
            console.log("Full received bytes:", 
                Array.from(fullBytes)
                    .map(b => b.toString(16).padStart(2, '0'))
                    .join(" "));

            const payloadBytes = fullBytes.subarray(2);
            console.log("Payload bytes (skipping first 2 bytes):", 
                Array.from(payloadBytes)
                    .map(b => b.toString(16).padStart(2, '0'))
                    .join(" "));

            try {
                let messageText = new TextDecoder("utf-8").decode(payloadBytes);

                if (messageText.includes("UJ")) {
                    console.log("UJ detected in message!");
                }

                console.log(`[Message Sent decoded as UTF-8] ${messageText}`);
            } catch (e) {
                console.warn("[Message Parsing Error]", e);
            }
        } else {
            console.warn("[Opcode 25] No message data found.");
        }
    }

    // ------------------------------------------------
    // 4. Custom WebSocket Class to Intercept Messages
    // ------------------------------------------------
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
                let modifiedData = modifyMessageBeforeSend(data);
                super.send(modifiedData);
            } else {
                super.send(data);
            }
        }
    }

    // ------------------------------------------------
    // 5. Modify Outgoing Messages Before Sending (Only UJ)
    // ------------------------------------------------
    function modifyMessageBeforeSend(buffer) {
        let fullArray = new Uint8Array(buffer);

        if (fullArray.length >= 2) {
            let payloadBytes = fullArray.slice(2); 
            let messageText = new TextDecoder("utf-8").decode(payloadBytes);
            
            if (messageText.includes("UJ")) {
                console.log("Modifying outgoing message: Replacing 'UJ' with 'up there!'");
                let modifiedText = messageText.replace(/UJ/g, "up there!");
                let modifiedBytes = new TextEncoder().encode(modifiedText);

                let newBuffer = new Uint8Array(2 + modifiedBytes.length);
                newBuffer.set(fullArray.subarray(0, 2), 0); 
                newBuffer.set(modifiedBytes, 2); 

                return newBuffer.buffer;
            }
        }
        
        return buffer; 
    }

    // ------------------------------------------------
    // 6. Process Incoming Binary Data from the WebSocket
    // ------------------------------------------------
    function processBinaryData(buffer) {
        const fullArray = new Uint8Array(buffer);
        if (fullArray.length >= 2) {
            const opcode = fullArray[0];
            const signalStrength = fullArray[1];
            const rawMessage = buffer.byteLength > 2 ? buffer.slice(2) : new ArrayBuffer(0);
            processSignal({ opcode, signalStrength, messageSize: fullArray.length, rawMessage });
        }
    }

    // ------------------------------------------------
    // 7. Apply the Custom WebSocket Override
    // ------------------------------------------------
    setTimeout(() => {
        window.WebSocket = CustomWebSocket;
        console.log('[CustomWebSocket] WebSocket Override Applied');
    }, 1000);

    // Expose a global function to review the opcode registry.
    window.analyzeOpcodes = function () {
        console.log("[CustomWebSocket] Opcode Registry Analysis:");
        console.table(opcodeRegistry);
    };

})();
