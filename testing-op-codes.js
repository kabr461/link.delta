console.log("[WebSocket Debug] Initializing Enhanced WebSocket Analyzer...");

(function () {
    'use strict';

    /**
     * In-memory opcode registry. Structure:
     * {
     *   opcodeValue: {
     *     count: number,
     *     strongestSignal: number,
     *     messageSizes: number[],
     *     samples: Uint8Array[],  // Storing raw data samples
     *   }
     * }
     */
    let opcodeRegistry = {};

    // Temporary summary to show per second
    let opcodeSummary = {};
    let lastSummaryTime = Date.now();

    // Restore any previously stored opcode data from localStorage
    loadOpcodeRegistryFromStorage();

    /**
     * Primary data processing function for each incoming binary WebSocket message.
     */
    function processBinaryData(buffer) {
        const dataArray = new Uint8Array(buffer);
        if (dataArray.length >= 2) {
            const opcode = dataArray[0];       // Assuming first byte is opcode
            const signalStrength = dataArray[1]; // Assuming second byte is signal
            const messageSize = dataArray.length;

            // Gather the data into our standard format
            const processedData = { opcode, signalStrength, messageSize, dataArray };

            processSignal(processedData);
        }
    }

    /**
     * Called after extracting key info (opcode, signalStrength, messageSize, raw data).
     */
    function processSignal({ opcode, signalStrength, messageSize, dataArray }) {
        // Check if this is a new opcode
        const isNewOpcode = !opcodeRegistry[opcode];

        // Initialize or update registry entry
        if (isNewOpcode) {
            opcodeRegistry[opcode] = {
                count: 1,
                strongestSignal: signalStrength,
                messageSizes: [messageSize],
                // We'll store the first raw data sample (or store multiple samples if desired)
                samples: [dataArray.slice(0, 16)],  // store a short sample of up to 16 bytes
            };
        } else {
            // Update existing
            const entry = opcodeRegistry[opcode];
            entry.count += 1;
            entry.strongestSignal = Math.max(entry.strongestSignal, signalStrength);

            // Track unique message sizes
            if (!entry.messageSizes.includes(messageSize)) {
                entry.messageSizes.push(messageSize);
            }

            // Optionally store a new sample (or limit how many we keep to avoid large memory usage)
            if (entry.samples.length < 5) {
                // Keep up to 5 samples
                entry.samples.push(dataArray.slice(0, 16));
            }
        }

        // Immediately log if this is a new opcode
        if (isNewOpcode) {
            console.log(`[CustomWebSocket] New opcode detected: ${opcode}`);
        }

        // Keep track of frequency for the 1-second summary
        opcodeSummary[opcode] = (opcodeSummary[opcode] || 0) + 1;

        // Print summary once per second
        const now = Date.now();
        if (now - lastSummaryTime > 1000) {
            console.clear(); // Keep the console clean
            console.log(`[CustomWebSocket] Opcode Frequency Summary (Last 1s)`);
            console.table(opcodeSummary);

            // Reset counters for the next second
            opcodeSummary = {};
            lastSummaryTime = now;
        }

        // Persist changes to localStorage
        saveOpcodeRegistryToStorage();
    }

    /**
     * Attempt to load a previously stored version of the opcode registry from localStorage
     */
    function loadOpcodeRegistryFromStorage() {
        try {
            const stored = localStorage.getItem('opcodeRegistry');
            if (stored) {
                // We need to revive the Uint8Arrays. We'll keep them as plain arrays for simplicity.
                const parsed = JSON.parse(stored);
                // Convert plain arrays back to typed arrays if needed
                for (const op in parsed) {
                    parsed[op].samples = parsed[op].samples.map(
                        arr => new Uint8Array(arr)
                    );
                }
                opcodeRegistry = parsed;
                console.log('[CustomWebSocket] Loaded opcodeRegistry from localStorage');
            }
        } catch (err) {
            console.warn('[CustomWebSocket] Failed to load opcodeRegistry:', err);
        }
    }

    /**
     * Save the current opcode registry to localStorage. 
     * We transform Uint8Arrays to plain arrays to be JSON-serializable.
     */
    function saveOpcodeRegistryToStorage() {
        try {
            const clone = {};
            for (const op in opcodeRegistry) {
                clone[op] = {
                    ...opcodeRegistry[op],
                    samples: opcodeRegistry[op].samples.map(ua => Array.from(ua))
                };
            }
            localStorage.setItem('opcodeRegistry', JSON.stringify(clone));
        } catch (err) {
            console.warn('[CustomWebSocket] Failed to store opcodeRegistry:', err);
        }
    }

    /**
     * Utility function to export the entire opcode registry as JSON.
     * This is triggered by calling `window.exportOpcodesAsJSON()`
     * from the console or any custom UI.
     */
    function exportOpcodesAsJSON() {
        const dataStr = JSON.stringify(opcodeRegistryToPlainObject(), null, 2);
        downloadFile(dataStr, 'opcode_registry.json', 'application/json');
    }

    /**
     * Utility function to export the entire opcode registry as CSV.
     * This is triggered by calling `window.exportOpcodesAsCSV()`
     * from the console or any custom UI.
     */
    function exportOpcodesAsCSV() {
        // Convert the registry to a simple CSV structure
        // Columns: opcode, count, strongestSignal, messageSizes (joined), sampleCount
        let csv = 'opcode,count,strongestSignal,messageSizes,sampleCount\n';
        for (const [opcode, entry] of Object.entries(opcodeRegistry)) {
            csv += `${opcode},${entry.count},${entry.strongestSignal},"[${entry.messageSizes.join(', ')}]",${entry.samples.length}\n`;
        }
        downloadFile(csv, 'opcode_registry.csv', 'text/csv');
    }

    /**
     * Helper to create a "plain" version of the registry for JSON export.
     * This transforms the Uint8Array samples to plain arrays so they’re JSON-friendly.
     */
    function opcodeRegistryToPlainObject() {
        const clone = {};
        for (const op in opcodeRegistry) {
            clone[op] = {
                count: opcodeRegistry[op].count,
                strongestSignal: opcodeRegistry[op].strongestSignal,
                messageSizes: opcodeRegistry[op].messageSizes,
                samples: opcodeRegistry[op].samples.map(ua => Array.from(ua))
            };
        }
        return clone;
    }

    /**
     * Utility to trigger a download of a string as a file.
     */
    function downloadFile(dataStr, fileName, mimeType) {
        const blob = new Blob([dataStr], { type: mimeType });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Override the native WebSocket with our custom analyzer.
     */
    const OriginalWebSocket = window.WebSocket;

    class CustomWebSocket extends OriginalWebSocket {
        constructor(url, protocols) {
            super(url, protocols);
            this.url = url;
            this.protocols = protocols;

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
                // Attempt reconnect after a delay
                setTimeout(() => {
                    console.log('[CustomWebSocket] Attempting to reconnect...');
                    window.WebSocket = new CustomWebSocket(this.url, this.protocols);
                }, 3000);
            });
        }
    }

    // Apply override after a short delay
    setTimeout(() => {
        window.WebSocket = CustomWebSocket;
        console.log('[CustomWebSocket] WebSocket Override Applied');
    }, 1000);

    // Expose helper functions globally for convenience
    window.analyzeOpcodes = function () {
        console.log("[CustomWebSocket] Opcode Registry Analysis:");
        console.table(opcodeRegistry);
    };

    window.exportOpcodesAsJSON = exportOpcodesAsJSON;
    window.exportOpcodesAsCSV = exportOpcodesAsCSV;

})();
