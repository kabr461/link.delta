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
    let lastSummaryTime = Date.now();
    const loggedOpcodes = new Set();

    function logOpcodeOnce(opcode, size) {
        if (!loggedOpcodes.has(opcode)) {
            console.log(`[WebSocket] New Opcode Detected: ${opcode} | Size: ${size} bytes`);
            loggedOpcodes.add(opcode);
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
        let keys = [0x55, 0xA3, 0x5F, 0x10, 0x99]; // Possible XOR keys
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

    function detectPlayerData(buffer) {
        // Look for readable strings that might be player names
        let decoded = new TextDecoder("utf-8").decode(buffer);
        let matches = decoded.match(/\b[A-Za-z0-9_-]{3,16}\b/g); // Detect possible names
        if (matches) {
            console.log(`[Player Data Detected] ${matches.join(", ")}`);
        }
    }

    function processBinaryData(buffer) {
        const dataArray = new Uint8Array(buffer);
        if (dataArray.length >= 2) {
            const opcode = dataArray[0];
            const rawMessage = buffer.slice(2);

            logOpcodeOnce(opcode, dataArray.length);

            // Log structured message sizes
            if (!opcodeRegistry[opcode]) {
                opcodeRegistry[opcode] = { count: 1, messageSizes: [dataArray.length] };
            } else {
                opcodeRegistry[opcode].count += 1;
                if (!opcodeRegistry[opcode].messageSizes.includes(dataArray.length)) {
                    opcodeRegistry[opcode].messageSizes.push(dataArray.length);
                }
            }

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

            // Detect player-related data
            detectPlayerData(rawMessage);
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

})();
