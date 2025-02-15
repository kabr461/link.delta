console.log("[WebSocket Debug] Initializing WebSocket Analyzer...");

// Load pako.js dynamically for decompression
(function loadPako() {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pako/2.0.4/pako.min.js";
    script.onload = () => console.log("[WebSocket] pako.js loaded successfully.");
    script.onerror = () => console.warn("[WebSocket] Failed to load pako.js.");
    document.head.appendChild(script);
})();

(function () {
    'use strict';

    const opcodeRegistry = {};
    let opcodeSummary = {};
    let lastSummaryTime = Date.now();
    const loggedOpcodes = new Set();

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

    function xorDecode(buffer, key = 0x55) { // Try different XOR keys
        let decoded = "";
        for (let i = 0; i < buffer.length; i++) {
            decoded += String.fromCharCode(buffer[i] ^ key);
        }
        return decoded;
    }

    function isCompressed(buffer) {
        // Check if data starts with Gzip/Deflate magic numbers
        return buffer[0] === 0x1F && buffer[1] === 0x8B;
    }

    function decompressData(buffer) {
        try {
            if (typeof pako === "undefined") {
                console.warn("[WebSocket] pako.js not loaded. Skipping decompression.");
                return null;
            }
            if (!isCompressed(buffer)) {
                console.log("[WebSocket] Data is not compressed, skipping decompression.");
                return null;
            }
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
            const rawMessage = buffer.slice(2);

            console.log(`[WebSocket] Opcode: ${opcode}, Length: ${dataArray.length}`);

            // Try XOR decoding first
            try {
                const xorDecoded = xorDecode(rawMessage);
                if (/[\w\s]/.test(xorDecoded)) {
                    console.log(`[XOR Decoded] ${xorDecoded}`);
                }
            } catch (e) {
                console.log("[XOR Decoding Failed]", e);
            }

            // Try UTF-8 Decoding
            try {
                const messageText = new TextDecoder("utf-8").decode(rawMessage);
                if (/[\w\s]/.test(messageText)) {
                    console.log(`[Decoded Text] ${messageText}`);
                }
            } catch (e) {
                console.log("[UTF-8 Decoding Failed]", e);
            }

            // Try decompression only if needed
            let decompressed = decompressData(rawMessage);
            if (decompressed && /[\w\s]/.test(decompressed)) {
                console.log(`[Decompressed Text] ${decompressed}`);
            }

            processSignal({ opcode, messageSize: dataArray.length, rawMessage });
        }
    }

    // Override WebSocket
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
