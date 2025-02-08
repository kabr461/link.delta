console.log("[WebSocket Debug] Initializing WebSocket Analyzer...");

(function () {
    'use strict';

    // IndexedDB helper functions for storing opcode data
    function openOpcodeDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('OpcodeDB', 1);
            request.onerror = () => reject('Error opening IndexedDB');
            request.onsuccess = () => resolve(request.result);
            request.onupgradeneeded = event => {
                const db = event.target.result;
                const store = db.createObjectStore('opcodes', { keyPath: 'opcode' });
                store.createIndex('opcode', 'opcode', { unique: true });
            };
        });
    }

    function saveOpcodeToDB(db, opcodeData) {
        const transaction = db.transaction(['opcodes'], 'readwrite');
        const store = transaction.objectStore('opcodes');
        store.put(opcodeData); // "put" inserts or updates by keyPath
    }

    // In-memory registry for opcode tracking
    const opcodeRegistry = {};  // { opcode: { count, strongestSignal, messageSizes, sampleData } }
    let opcodeSummary = {};     // Temporary per-second summary
    let lastSummaryTime = Date.now();

    // Process each signal received from the WebSocket
    function processSignal(data) {
        if (!data || data.opcode === undefined) return;

        const opcode = data.opcode;
        const signalStrength = data.signalStrength || 0;
        const messageSize = data.messageSize || 0;

        if (!opcodeRegistry[opcode]) {
            // New opcode detected: record structure, size, frequency, and a sample
            opcodeRegistry[opcode] = {
                count: 1,
                strongestSignal: signalStrength,
                messageSizes: [messageSize],
                sampleData: { opcode, signalStrength, messageSize }
            };
            console.log(`[CustomWebSocket] New opcode detected: ${opcode}`, opcodeRegistry[opcode]);

            // Save the new opcode record to IndexedDB
            openOpcodeDB().then(db => {
                saveOpcodeToDB(db, {
                    opcode,
                    count: 1,
                    strongestSignal: signalStrength,
                    messageSizes: [messageSize],
                    sampleData: { opcode, signalStrength, messageSize }
                });
            }).catch(err => console.error(err));
        } else {
            // Update existing opcode record
            opcodeRegistry[opcode].count += 1;
            opcodeRegistry[opcode].strongestSignal = Math.max(opcodeRegistry[opcode].strongestSignal, signalStrength);
            if (!opcodeRegistry[opcode].messageSizes.includes(messageSize)) {
                opcodeRegistry[opcode].messageSizes.push(messageSize);
            }
            openOpcodeDB().then(db => {
                saveOpcodeToDB(db, {
                    opcode,
                    count: opcodeRegistry[opcode].count,
                    strongestSignal: opcodeRegistry[opcode].strongestSignal,
                    messageSizes: opcodeRegistry[opcode].messageSizes,
                    sampleData: opcodeRegistry[opcode].sampleData
                });
            });
        }

        // Track per-second opcode frequency summary
        opcodeSummary[opcode] = (opcodeSummary[opcode] || 0) + 1;

        // Print summary every second
        if (Date.now() - lastSummaryTime > 1000) {
            console.clear();
            console.log(`[CustomWebSocket] Opcode Frequency Summary (Last 1s)`);
            console.table(opcodeSummary);
            opcodeSummary = {};
            lastSummaryTime = Date.now();
        }
    }

    // Process binary data received from the WebSocket
    function processBinaryData(buffer) {
        const dataArray = new Uint8Array(buffer);
        if (dataArray.length >= 2) {
            // Assuming the first byte is the opcode and the second is the signal strength
            const opcode = dataArray[0];
            const signalStrength = dataArray[1];
            const messageSize = dataArray.length;
            processSignal({ opcode, signalStrength, messageSize });
        }
    }

    // Custom WebSocket class that overrides the native WebSocket
    const OriginalWebSocket = window.WebSocket;
    class CustomWebSocket extends OriginalWebSocket {
        constructor(url, protocols) {
            super(url, protocols);
            console.log('[CustomWebSocket] Connecting to:', url);

            // Listen for incoming messages and process binary data
            this.addEventListener('message', (event) => {
                if (event.data instanceof ArrayBuffer) {
                    processBinaryData(event.data);
                } else if (event.data instanceof Blob) {
                    event.data.arrayBuffer().then(buffer => processBinaryData(buffer));
                }
            });

            // Attempt to reconnect on close
            this.addEventListener('close', (event) => {
                console.warn('[CustomWebSocket] Connection closed:', event);
                setTimeout(() => {
                    console.log('[CustomWebSocket] Attempting to reconnect...');
                    window.WebSocket = new CustomWebSocket(url, protocols);
                }, 3000);
            });
        }
    }

    // Export the opcode registry data as a JSON file
    function exportToJSON() {
        const dataStr = JSON.stringify(opcodeRegistry, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "opcode_data.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // Export the opcode registry data as a CSV file
    function exportToCSV() {
        let csvContent = "Opcode,Count,StrongestSignal,MessageSizes,SampleData\n";
        for (let opcode in opcodeRegistry) {
            const record = opcodeRegistry[opcode];
            const messageSizes = record.messageSizes.join('|'); // Use a delimiter for sizes
            const sampleData = JSON.stringify(record.sampleData).replace(/,/g, ';'); // Replace commas to avoid CSV conflicts
            csvContent += `${opcode},${record.count},${record.strongestSignal},"${messageSizes}","${sampleData}"\n`;
        }
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "opcode_data.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // Override the native WebSocket after a short delay
    setTimeout(() => {
        window.WebSocket = CustomWebSocket;
        console.log('[CustomWebSocket] WebSocket Override Applied');
    }, 1000);

    // Expose helper functions to the global scope for later analysis/export
    window.analyzeOpcodes = function () {
        console.log("[CustomWebSocket] Opcode Registry Analysis:");
        console.table(opcodeRegistry);
    };
    window.exportOpcodeDataJSON = exportToJSON;
    window.exportOpcodeDataCSV = exportToCSV;

})();
