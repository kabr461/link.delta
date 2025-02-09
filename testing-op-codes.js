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
            console.log("[CustomWebSocket] Opcode Frequency Summary (Last 30s)");
            console.table(opcodeSummary);
            opcodeSummary = {};
            lastSummaryTime = Date.now();
        }
    }

    // ------------------------------------------------
    // 3. Process Opcode 25 (Incoming Chat Message)
    // ------------------------------------------------
    function processMessageOpcode(data) {
        if (data.rawMessage) {
            const fullBytes = new Uint8Array(data.rawMessage);
            const payloadBytes = fullBytes.subarray(2);
            try {
                let messageText = new TextDecoder("utf-8").decode(payloadBytes);
                console.log(`[Message Received] ${messageText}`);
            } catch (e) {
                console.warn("[Message Parsing Error]", e);
            }
        }
    }

    // ------------------------------------------------
    // 4. Custom WebSocket Class to Intercept Messages
    // ------------------------------------------------
    const OriginalWebSocket = window.WebSocket;
    class CustomWebSocket extends OriginalWebSocket {
        constructor(url, protocols) {
            super(url, protocols);
            this.addEventListener('message', (event) => {
                if (event.data instanceof ArrayBuffer) {
                    processBinaryData(event.data);
                } else if (event.data instanceof Blob) {
                    event.data.arrayBuffer().then(buffer => processBinaryData(buffer));
                }
            });
            this.addEventListener('close', (event) => {
                setTimeout(() => {
                    window.WebSocket = new CustomWebSocket(this.url, this.protocols);
                }, 1000);
            });
        }

        send(data) {
            if (data instanceof ArrayBuffer) {
                const modifiedData = modifyMessageBeforeSend(data);
                super.send(modifiedData);
            } else {
                super.send(data);
            }
        }
    }

    // ------------------------------------------------
    // 5. Modify Outgoing Messages (Only for opcode 25)
    //    Directly compare payload bytes
    // ------------------------------------------------
    function modifyMessageBeforeSend(buffer) {
        const fullArray = new Uint8Array(buffer);
        if (fullArray.length < 2) return buffer; // Must have header bytes

        // Only process if opcode is 25 (chat message)
        if (fullArray[0] !== 25) return buffer;

        const header = fullArray.slice(0, 2);
        const payload = fullArray.slice(2);
        let found = false;

        // First, scan payload for the sequence [0x55, 0x4A] (binary for "UJ")
        for (let i = 0; i < payload.length - 1; i++) {
            if (payload[i] === 0x55 && payload[i + 1] === 0x4A) {
                console.log(`UJ detected at payload index ${i}`);
                found = true;
                break;
            }
        }
        if (!found) return buffer;

        // Replacement: binary for "up there!"
        const replacement = new TextEncoder().encode("up there!");

        // Rebuild payload by replacing every occurrence of [0x55, 0x4A]
        const result = [];
        for (let i = 0; i < payload.length;) {
            if (i <= payload.length - 2 && payload[i] === 0x55 && payload[i + 1] === 0x4A) {
                console.log(`Replacing UJ at payload index ${i}`);
                for (let j = 0; j < replacement.length; j++) {
                    result.push(replacement[j]);
                }
                i += 2;
            } else {
                result.push(payload[i]);
                i++;
            }
        }
        const newPayload = new Uint8Array(result);
        const newBuffer = new Uint8Array(header.length + newPayload.length);
        newBuffer.set(header, 0);
        newBuffer.set(newPayload, header.length);
        console.log("Modified outgoing chat message.");
        return newBuffer.buffer;
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
    // 7. Apply the Custom WebSocket Override (after 1 second)
    // ------------------------------------------------
    setTimeout(() => {
        window.WebSocket = CustomWebSocket;
        console.log("[CustomWebSocket] WebSocket Override Applied");
    }, 1000);

    // Expose global function for opcode analysis.
    window.analyzeOpcodes = function () {
        console.log("[CustomWebSocket] Opcode Registry Analysis:");
        console.table(opcodeRegistry);
    };

})();
