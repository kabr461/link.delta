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

        // Ensure message is long enough to be a lookup table
        if (dataArray.length < 10) return;

        // Check if this message is the lookup table
        if (!isLookupTableReceived && isPossibleLookupTable(dataArray)) {
            parseLookupTable(dataArray);
            isLookupTableReceived = true;
            console.log(`[WebSocket Debug] Lookup Table Received on Response #${responseCount}:`, lookupTable);
        }
    }

    // Checks if a message could be a lookup table
    function isPossibleLookupTable(data) {
        return data.length > 10 && data[0] === 0; // Example: First byte as 0 might indicate lookup table
    }

    // Parses the lookup table and stores opcode mappings
    function parseLookupTable(data) {
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
