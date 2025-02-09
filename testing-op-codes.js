console.log("[WebSocket Debug] Initializing WebSocket Analyzer...");

(function () {
    'use strict';

    // --------------------------------------------------
    // 1. Opcode Registry and Frequency Tracking
    // --------------------------------------------------
    const opcodeRegistry = {};       // Detailed info per opcode
    let opcodeSummary = {};          // Frequency summary over a time window
    let lastSummaryTime = Date.now();
    const loggedOpcodes = new Set(); // To log new opcodes only once

    function logOpcodeOnce(opcode) {
        if (!loggedOpcodes.has(opcode)) {
            console.log(`Opcode ${opcode} detected for the first time.`);
            loggedOpcodes.add(opcode);
        }
    }

    // --------------------------------------------------
    // 2. Process Incoming Signal Data
    // --------------------------------------------------
    function processSignal(data) {
        if (!data || data.opcode === undefined) return;

        const opcode = data.opcode;
        logOpcodeOnce(opcode);

        // Special handling for opcode 25 (Message Sending)
        if (opcode === 25) {
            processMessageOpcode(data);
        }

        // Record signal strength and message size
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

        // Every 10 seconds, print an opcode summary.
        if (Date.now() - lastSummaryTime > 10000) {
            console.clear();
            console.log(`[CustomWebSocket] Opcode Frequency Summary (Last 10s)`);
            console.table(opcodeSummary);
            opcodeSummary = {};
            lastSummaryTime = Date.now();
        }
    }

    // --------------------------------------------------
    // 3. Process Opcode 25 (Message Sending) – Structured Parsing
    // --------------------------------------------------
    function processMessageOpcode(data) {
        if (!data.rawMessage) {
            console.warn("[Opcode 25] No message data found.");
            return;
        }

        // Create a Uint8Array view of the payload (already stripped of the first 2 bytes)
        const payload = new Uint8Array(data.rawMessage);
        console.log("Payload bytes (for structured parsing):",
            Array.from(payload).map(b => b.toString(16).padStart(2, '0')).join(" "));

        let offset = 0;

        // --- 3a. Read a 4-byte header ---
        if (payload.length < offset + 4) {
            console.warn("Payload too short for header.");
            return;
        }
        const headerBytes = payload.slice(offset, offset + 4);
        offset += 4;
        console.log("Header bytes:", 
            Array.from(headerBytes).map(b => b.toString(16).padStart(2, '0')).join(" "));
        // (Optional) You can process the header bytes as needed.

        // --- 3b. Read the name length (1 byte) ---
        if (payload.length < offset + 1) {
            console.warn("Payload too short for name length.");
            return;
        }
        const nameLength = payload[offset];
        offset += 1;
        console.log("Name length:", nameLength);

        // --- 3c. Read the name field (nameLength characters in UTF-16LE) ---
        const nameByteLength = nameLength * 2;
        if (payload.length < offset + nameByteLength) {
            console.warn("Not enough bytes for the name field.");
            return;
        }
        const nameBytes = payload.slice(offset, offset + nameByteLength);
        offset += nameByteLength;
        const name = new TextDecoder("utf-16le").decode(nameBytes);
        console.log("Name:", name);

        // --- 3d. Read the tag length (1 byte) ---
        if (payload.length < offset + 1) {
            console.warn("No bytes left for tag length.");
            return;
        }
        const tagLength = payload[offset];
        offset += 1;
        console.log("Tag length:", tagLength);

        // --- 3e. Read the tag field (tagLength characters in UTF-16LE) ---
        const tagByteLength = tagLength * 2;
        if (payload.length < offset + tagByteLength) {
            console.warn("Not enough bytes for tag field.");
            return;
        }
        const tagBytes = payload.slice(offset, offset + tagByteLength);
        offset += tagByteLength;
        const tag = new TextDecoder("utf-16le").decode(tagBytes);
        console.log("Tag:", tag);

        // Final parsed message output
        console.log(`[Structured Message Parsed] Name: ${name}, Tag: ${tag}`);
    }

    // --------------------------------------------------
    // 4. Custom WebSocket Override
    // --------------------------------------------------
    const OriginalWebSocket = window.WebSocket;
    class CustomWebSocket extends OriginalWebSocket {
        constructor(url, protocols) {
            super(url, protocols);
            console.log('[CustomWebSocket] Connecting to:', url);

            this.addEventListener('message', (event) => {
                // Process ArrayBuffer or Blob messages.
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

    // --------------------------------------------------
    // 5. Process Incoming Binary Data
    // --------------------------------------------------
    function processBinaryData(buffer) {
        const fullArray = new Uint8Array(buffer);
        // Ensure at least 2 bytes for opcode and signal strength.
        if (fullArray.length < 2) return;
        const opcode = fullArray[0];
        const signalStrength = fullArray[1];
        // Strip the first 2 bytes so the remaining buffer is the payload.
        const rawMessage = buffer.byteLength > 2 ? buffer.slice(2) : new ArrayBuffer(0);
        processSignal({ opcode, signalStrength, messageSize: fullArray.length, rawMessage });
    }

    // --------------------------------------------------
    // 6. Apply the Custom WebSocket Override
    // --------------------------------------------------
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
