console.log("[WebSocket Debug] Initializing Lookup Table Capture...");

(function () {
    "use strict";

    let lookupTable = {}; // Stores received opcode mappings
    let responseCount = 0; // Tracks number of received messages
    let isLookupTableReceived = false; // Tracks if mapping data was received

    // Custom WebSocket Override
    class CustomWebSocket extends window.WebSocket {
        constructor(url, protocols) {
            super(url, protocols);
            console.log("[CustomWebSocket] Connecting to:", url);

            this.addEventListener("message", (event) => {
                responseCount++; // Increase message count

                if (event.data instanceof ArrayBuffer) {
                    processBinaryData(event.data);
                } else if (event.data instanceof Blob) {
                    event.data.arrayBuffer().then((buffer) => processBinaryData(buffer));
                }
            });
        }
    }

    // Processes incoming WebSocket messages
    function processBinaryData(buffer) {
        const dataArray = new Uint8Array(buffer);

        // Log first 3 responses for debugging
        if (responseCount <= 3) {
            console.log(`[WebSocket Debug] Response #${responseCount} - Raw Data:`, dataArray);
        }

        // Check if this message is the lookup table
        if (!isLookupTableReceived && isPossibleLookupTable(dataArray)) {
            parseLookupTable(dataArray);
            isLookupTableReceived = true;
            console.log(`[WebSocket Debug] Lookup Table Received on Response #${responseCount}:`, lookupTable);
        }
    }

    // Loosen the conditions to detect lookup table
    function isPossibleLookupTable(data) {
        return data.length > 10; // Removed `data[0] === 0` condition to capture more cases
    }

    // Parses the lookup table and stores opcode mappings
    function parseLookupTable(data) {
        console.log("[WebSocket Debug] Parsing lookup table...", data);
        for (let i = 1; i < data.length; i += 2) {
            let opcode = data[i];
            let typeID = data[i + 1]; // Assume second byte represents function type
            lookupTable[opcode] = classifyFunctionType(typeID);
        }
    }

    // Converts function type ID to readable name
    function classifyFunctionType(typeID) {
        const knownTypes = {
            1: "movement",
            2: "rendering",
            3: "spectate",
            4: "attack",
        };
        return knownTypes[typeID] || "unknown";
    }

    // Override WebSocket globally after 1 second for stability
    setTimeout(() => {
        window.WebSocket = CustomWebSocket;
        console.log("[CustomWebSocket] WebSocket Override Applied");
    }, 1000);

})();
