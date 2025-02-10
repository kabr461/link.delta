console.log("[WebSocket Debug] Initializing WebSocket Analyzer with Firebase...");

// Import Firebase SDK (Ensure you include Firebase scripts in your HTML or use module imports)
const firebaseConfig = {
    apiKey: "AIzaSyDtlJnDcRiqO8uhofXqePLOhUTf2dWpEDI",
    authDomain: "agario-bb5ea.firebaseapp.com",
    databaseURL: "https://agario-bb5ea-default-rtdb.firebaseio.com",
    projectId: "agario-bb5ea",
    storageBucket: "agario-bb5ea.firebasestorage.app",
    messagingSenderId: "306389211380",
    appId: "1:306389211380:web:3c1eb559078b05734be6a1",
    measurementId: "G-5NTSETJHM9"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

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
                const messageText = new TextDecoder("utf-8").decode(data.rawMessage);
                console.log(`[Message Sent] ${messageText}`);
                
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
