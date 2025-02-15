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

    function logOpcodeOnce(opcode, size) {
        if (!loggedOpcodes.has(opcode)) {
            console.log(`[WebSocket] New Opcode Detected: ${opcode} | Size: ${size} bytes`);
            loggedOpcodes.add(opcode);
        }
    }

    function processSignal(data) {
        if (!data || data.opcode === undefined) return;
        const opcode = data.opcode;
        logOpcodeOnce(opcode, data.messageSize);

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

    function xorDecode(buffer, key) {
        let decoded = "";
        for (let i = 0; i < buffer.length; i++) {
            decoded += String.fromCharCode(buffer[i] ^ key);
        }
        return decoded;
    }

    function tryMultipleXOR(buffer) {
        let keys = [0x55, 0xA3, 0x5F, 0x10, 0x99]; // Common XOR keys
        for (let key of keys) {
            let decoded = xorDecode(buffer, key);
            if (/[\w\s]/.test(decoded)) { // Check if text is readable
                console.log(`[XOR Key ${key}] Decoded: ${decoded}`);
            }
        }
    }

    function isCompressed(buffer) {
        return buffer[0] === 0x1F && buffer[1] === 0x8B; // Check for Gzip header
    }

    function decompressData(buffer) {
        try {
            if (typeof pako === "undefined") {
                console.warn("[WebSocket] pako.js not loaded. Skipping decompression.");
                return null;
            }
            if (!isCompressed(buffer)) {
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

            // Log Raw Hex Data
            console.log(`[Raw Data] ${Array.from(rawMessage).map(b => b.toString(16)).join(" ")}`);

            // Try XOR decoding first
            tryMultipleXOR(rawMessage);

            // Try UTF-8 Decoding
            try {
                const messageText = new TextDecoder("utf-8").decode(rawMessage);
                if (/[\w\s]/.test(messageText)) {
                    console.log(`[Decoded Text] ${messageText}`);
                }
            } catch (e) {
                console.log("[UTF-8 Decoding Failed]", e);
            }

            // Try decompression if needed
            let decompressed = decompressData(rawMessage);
            if (decompressed && /[\w\s]/.test(decompressed)) {
                console.log(`[Decompressed Text] ${decompressed}`);
            }

            processSignal({ opcode, messageSize: dataArray.length, rawMessage });
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
                    window.WebSocket = new CustomWebSocket(url, protocols);
                }, 1000);
            });
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
