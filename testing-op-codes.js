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

        // Initialize registry entry if needed
        if (!opcodeRegistry[opcode]) {
            opcodeRegistry[opcode] = { 
                count: 1, 
                strongestSignal: signalStrength, 
                messageSizes: [messageSize],
                lastRawMessage: data.rawMessage || null
            };
        } else {
            opcodeRegistry[opcode].count += 1;
            opcodeRegistry[opcode].strongestSignal = Math.max(opcodeRegistry[opcode].strongestSignal, signalStrength);
            if (!opcodeRegistry[opcode].messageSizes.includes(messageSize)) {
                opcodeRegistry[opcode].messageSizes.push(messageSize);
            }
            // Update the last raw message if available
            if (data.rawMessage) {
                opcodeRegistry[opcode].lastRawMessage = data.rawMessage;
            }
        }

        // Update the summary (used for the 10s summary report)
        if (!opcodeSummary[opcode]) {
            opcodeSummary[opcode] = 1;
        } else {
            opcodeSummary[opcode] += 1;
        }

        // Every 10 seconds, print the summary and top raw messages for the top 6 opcodes
        if (Date.now() - lastSummaryTime > 10000) {
            console.clear();
            console.log(`[CustomWebSocket] Opcode Frequency Summary (Last 10s)`);
            console.table(opcodeSummary);
            printTopRawMessages(opcodeSummary);
            // --- Extended: Also print only the most repeated opcode and its translated message ---
            printMostRepeatedOpcode(opcodeSummary);
            opcodeSummary = {};
            lastSummaryTime = Date.now();
        }
    }

    function processMessageOpcode(data) {
        if (data.rawMessage) {
            try {
                const messageText = new TextDecoder("utf-8").decode(data.rawMessage);
                //console.log(`[Message Sent] ${messageText}`);
                
                // Normalize message: Remove extra spaces, line breaks, and special characters
                const cleanedMessage = messageText.replace(/[^\x20-\x7E]/g, ""); // Keep only standard ASCII printable chars
                
                // Check if cleaned message contains 'UJ' (case-sensitive)
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

    /**
     * Prints the raw messages for the top 6 most frequent opcodes in the last 10 seconds.
     * The raw message is logged as a Uint8Array if it's an ArrayBuffer.
     *
     * Extended: Also logs a translated version of the raw message.
     *
     * @param {Object} summary - The opcode summary object with opcode counts.
     */
    function printTopRawMessages(summary) {
        // Convert the summary object into an array and sort descending by count.
        const topOpcodes = Object.entries(summary)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6);

        console.log('[CustomWebSocket] Top 6 Opcodes Raw Messages:');
        topOpcodes.forEach(([opcode, count]) => {
            const registryEntry = opcodeRegistry[opcode];
            const rawMessage = registryEntry && registryEntry.lastRawMessage;
            if (rawMessage) {
                // If the rawMessage is an ArrayBuffer, convert it to a Uint8Array for display.
                const messageDisplay = rawMessage instanceof ArrayBuffer
                    ? new Uint8Array(rawMessage)
                    : rawMessage;
             //   console.log(`Opcode ${opcode} (Count: ${count}) Raw Message:`, messageDisplay);
                // --- Extended: Log a translated version of the raw message ---
                console.log(`Opcode ${opcode} (Count: ${count}) Translated Message:`, translateRawMessage(rawMessage));
            } else {
                console.log(`Opcode ${opcode} (Count: ${count}) No raw message available.`);
            }
        });
    }

    // --- Extended: Function to print only the most repeated opcode and its translated data ---
    function printMostRepeatedOpcode(summary) {
        const entries = Object.entries(summary);
        if (entries.length === 0) return;
        // Find the opcode with the highest count.
        const [topOpcode, topCount] = entries.sort((a, b) => b[1] - a[1])[0];
        const registryEntry = opcodeRegistry[topOpcode];
        if (registryEntry && registryEntry.lastRawMessage) {
            const messageDisplay = registryEntry.lastRawMessage instanceof ArrayBuffer
                ? new Uint8Array(registryEntry.lastRawMessage)
                : registryEntry.lastRawMessage;
            console.log('---------------------------------------------------');
            console.log(`Most Repeated Opcode: ${topOpcode} (Count: ${topCount})`);
         //   console.log('Raw Message:', messageDisplay);
            console.log('Translated Message:', translateRawMessage(registryEntry.lastRawMessage));
            console.log('---------------------------------------------------');
        }
    }

    // --- Extended: Translator function to convert raw message into readable text ---
    function translateRawMessage(rawMessage) {
        let uint8;
        if (rawMessage instanceof ArrayBuffer) {
            uint8 = new Uint8Array(rawMessage);
        } else if (rawMessage instanceof Uint8Array) {
            uint8 = rawMessage;
        } else {
            return rawMessage;
        }
        
        // Try to decode as UTF-8 text.
        try {
            const decoded = new TextDecoder("utf-8").decode(uint8);
            // Check if the decoded text contains mostly printable characters
            const printableRatio = decoded.split("").filter(c => c.match(/[\x20-\x7E]/)).length / decoded.length;
            if (printableRatio > 0.8) {
                return decoded;
            }
            // Otherwise, fall through to hex conversion below.
        } catch (e) {
            // Decoding failed, so we fall through.
        }
        
        // Fallback: return a hexadecimal string representation
        return uint8.reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0') + " ", "").trim();
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
    }

    function processBinaryData(buffer) {
        const dataArray = new Uint8Array(buffer);
        if (dataArray.length >= 2) {
            const opcode = dataArray[0];
            const signalStrength = dataArray[1];
            const rawMessage = buffer.slice(2); // Extract the message part
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
