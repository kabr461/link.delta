console.log("[WebSocket Debug] Initializing WebSocket Analyzer...");

(function () {
    'use strict';

    // Opcode registry for classification
    const opcodeRegistry = {};
    let opcodeSummary = {};
    let lastSummaryTime = Date.now();
    const loggedOpcodes = new Set();
    const messageLogLimit = 10; // Limit message logs to avoid console spam
    let messageLogCount = 0;

    function logOpcodeOnce(opcode) {
        if (!loggedOpcodes.has(opcode)) {
            console.log(`[WebSocket] New Opcode Detected: ${opcode}`);
            loggedOpcodes.add(opcode);
        }
    }

    function processSignal(data) {
        if (!data || data.opcode === undefined) return;
        const opcode = data.opcode;
        logOpcodeOnce(opcode);

        if (!opcodeRegistry[opcode]) {
            opcodeRegistry[opcode] = { count: 1, messageSizes: [data.messageSize] };
        } else {
            opcodeRegistry[opcode].count += 1;
            if (!opcodeRegistry[opcode].messageSizes.includes(data.messageSize)) {
                opcodeRegistry[opcode].messageSizes.push(data.messageSize);
            }
        }

        if (!opcodeSummary[opcode]) {
            opcodeSummary[opcode] = 1;
        } else {
            opcodeSummary[opcode] += 1;
        }

        // Summarize data every 30 seconds
        if (Date.now() - lastSummaryTime > 30000) {
            console.clear();
            console.log(`[WebSocket Analyzer] Opcode Frequency Summary (Last 30s)`);
            console.table(opcodeSummary);
            opcodeSummary = {};
            lastSummaryTime = Date.now();
        }
    }

    function xorDecode(buffer, key = 123) { // Try different XOR keys
        let decoded = "";
        for (let i = 0; i < buffer.length; i++) {
            decoded += String.fromCharCode(buffer[i] ^ key);
        }
        return decoded;
    }

    function decompressData(buffer) {
        try {
            let decompressed = pako.inflate(buffer, { to: 'string' });
            console.log(`[Decompressed Data] ${decompressed}`);
            return decompressed;
        } catch (e) {
            console.log("[Decompression Failed]", e);
            return null;
        }
    }

    function processBinaryData(buffer) {
        const dataArray = new Uint8Array(buffer);
        if (dataArray.length >= 2) {
            const opcode = dataArray[0];
            const rawMessage = buffer.slice(2); // Extract message part

            console.log(`[WebSocket] Opcode: ${opcode}, Length: ${dataArray.length}`);

            try {
                const messageText = new TextDecoder("utf-8").decode(rawMessage);
                console.log(`[Decoded Text] ${messageText}`);
            } catch (e) {
                console.log("[UTF-8 Decoding Failed]", e);
            }

            // Attempt XOR decoding
            try {
                const xorDecoded = xorDecode(rawMessage);
                console.log(`[XOR Decoded] ${xorDecoded}`);
            } catch (e) {
                console.log("[XOR Decoding Failed]", e);
            }

            // Attempt Decompression
            let decompressed = decompressData(rawMessage);
            if (decompressed) {
                console.log(`[Decompressed Text] ${decompressed}`);
            }

            processSignal({ opcode, messageSize: dataArray.length, rawMessage });
        }
    }

    // Override the native WebSocket
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
                    window.WebSocket = new CustomWebSocket(url, protocols);
                }, 1000);
            });
        }
    }

    // Apply the WebSocket override after a short delay
    setTimeout(() => {
        window.WebSocket = CustomWebSocket;
        console.log('[CustomWebSocket] WebSocket Override Applied');
    }, 1000);

    // Expose a function to display the current opcode registry
    window.analyzeOpcodes = function () {
        console.log("[CustomWebSocket] Opcode Registry Analysis:");
        console.table(opcodeRegistry);
    };

})();
