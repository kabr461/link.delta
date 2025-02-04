console.log("[WebSocket Debug] Initializing WebSocket override...");

(function () {
    'use strict';

    // A registry to track opcodes and their strongest signals.
    // Structure: { [opcode]: { name: string | null, strongestSignal: number } }
    const opcodeRegistry = {};

    // Global function to allow naming an opcode.
    window.setOpcodeName = function(opcode, name) {
        if (opcodeRegistry.hasOwnProperty(opcode)) {
            opcodeRegistry[opcode].name = name;
            console.log(`[CustomWebSocket] Opcode ${opcode} renamed to: ${name}`);
        } else {
            // If the opcode is not seen yet, register it with the provided name.
            opcodeRegistry[opcode] = { name: name, strongestSignal: -Infinity };
            console.log(`[CustomWebSocket] Opcode ${opcode} registered with name: ${name}`);
        }
    };

    // Function to process a signal from data (expected to contain opcode and signalStrength)
    function processSignal(data) {
        // Ensure we have both an opcode and a signal strength.
        if (data && data.opcode !== undefined && data.signalStrength !== undefined) {
            const opcode = data.opcode;
            const signalStrength = data.signalStrength;

            // If this opcode is new, register it.
            if (!opcodeRegistry.hasOwnProperty(opcode)) {
                opcodeRegistry[opcode] = { name: null, strongestSignal: signalStrength };
                console.log(`[CustomWebSocket] New opcode detected: ${opcode} with signal strength: ${signalStrength}`);
            } else {
                // Update if the current signal is stronger than what we've seen before.
                if (signalStrength > opcodeRegistry[opcode].strongestSignal) {
                    opcodeRegistry[opcode].strongestSignal = signalStrength;
                    console.log(`[CustomWebSocket] Stronger signal detected for opcode ${opcode}: ${signalStrength}`);
                }
            }

            // If the opcode has been named, include that in the log.
            if (opcodeRegistry[opcode].name) {
                console.log(`[CustomWebSocket] Signal from named opcode "${opcodeRegistry[opcode].name}" (${opcode}) with strength: ${signalStrength}`);
            }
        }
    }

    // Original WebSocket for reference.
    const OriginalWebSocket = window.WebSocket;

    class CustomWebSocket extends OriginalWebSocket {
        constructor(url, protocols) {
            super(url, protocols);
            console.log('[CustomWebSocket] Connecting to:', url);

            this.addEventListener('open', () => {
                console.log('[CustomWebSocket] Connection opened:', url);
            });

            this.addEventListener('message', (event) => {
                // Process string messages (assumed JSON)
                if (typeof event.data === 'string') {
                    try {
                        const jsonData = JSON.parse(event.data);
                 //       console.log('[CustomWebSocket] Received JSON Data:', jsonData);

                        // Look for signal data in the JSON.
                        processSignal(jsonData);
                    } catch (e) {
                        console.error('[CustomWebSocket] JSON parse error:', e);
                    }
                }
                // Process Blob data by converting to ArrayBuffer.
                else if (event.data instanceof Blob) {
                    event.data.arrayBuffer().then(buffer => {
                        processBinaryData(buffer);
                    });
                }
                // Process ArrayBuffer directly.
                else if (event.data instanceof ArrayBuffer) {
                    processBinaryData(event.data);
                }
                else {
                    console.warn('[CustomWebSocket] Received data in an unexpected format:', event.data);
                }
            });

            this.addEventListener('error', (error) => {
                console.error('[CustomWebSocket] Error:', error);
            });

            this.addEventListener('close', (event) => {
                console.warn('[CustomWebSocket] Connection closed:', event);
                setTimeout(() => {
                    console.log('[CustomWebSocket] Attempting to reconnect...');
                    // Reconnect using the same URL and protocols.
                    window.WebSocket = new CustomWebSocket(this.url, this.protocols);
                }, 3000);
            });
        }

        send(data) {
            if (this.readyState === OriginalWebSocket.OPEN) {
         //       console.log('[CustomWebSocket] Sending:', data);
                super.send(data);
            } else {
                console.warn('[CustomWebSocket] Tried to send data while WebSocket was not open:', data);
            }
        }

        close(code, reason) {
            console.log('[CustomWebSocket] Closing connection:', code, reason);
            super.close(code, reason);
        }
    }

    // Function to process binary data.
    // Here, we assume the binary data's first byte is the opcode and the second byte is signal strength.
    function processBinaryData(buffer) {
        const dataArray = new Uint8Array(buffer);
  //      console.log("[CustomWebSocket] Received Binary Data:", dataArray);
        
        if (dataArray.length >= 2) {
            const opcode = dataArray[0];
            const signalStrength = dataArray[1]; // Simplistic interpretation
            processSignal({ opcode, signalStrength });
        }
    }

    // Override the native WebSocket after a short delay.
    setTimeout(() => {
        window.WebSocket = CustomWebSocket;
        console.log('[CustomWebSocket] Override Applied');
    }, 1000);

})();
