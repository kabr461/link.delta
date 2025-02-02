(function() {
    'use strict';

    /*******************************
     * Configuration – Adjust These:
     *******************************/
    // Choose a custom opcode for the red wave animation.
    // Make sure this opcode is not used by delta.
    const CUSTOM_RED_WAVE_OPCODE = 150;  // <-- Adjust if needed

    // Define the binary layout for your custom message.
    // For this example, we create a 1-byte opcode and 8 bytes for two 32-bit floats (x and y).
    // You can extend this layout if you need to add more data (like duration, team ID, etc.)
    const CUSTOM_MSG_LENGTH = 1 + (4 * 2); // 1 byte opcode + 2 floats (x, y)

    /*******************************
     * Step 1: Override the WebSocket Constructor
     *******************************/
    const OriginalWebSocket = window.WebSocket;
    function CustomWebSocket(url, protocols) {
        const ws = protocols ? new OriginalWebSocket(url, protocols) : new OriginalWebSocket(url);

        // Override the send method
        const originalSend = ws.send;
        ws.send = function(data) {
            // If the delta code sends binary data (ArrayBuffer), we try to inspect it.
            // For simplicity, we assume that a click event from delta is encoded in a specific way.
            // You must adjust this check to match the delta protocol.
            if (data instanceof ArrayBuffer) {
                const dv = new DataView(data);
                // Example: Assume the underlying click event uses opcode 99 (or another value)
                // This is for illustration; change the check to what your delta script sends.
                const originalOpcode = dv.getUint8(0);
                if (originalOpcode === 99 && isSpectating() && isMyTeam()) {
                    // We want to inject our custom red wave.
                    // Here we create a new ArrayBuffer with our custom opcode and position data.
                    const buf = new ArrayBuffer(CUSTOM_MSG_LENGTH);
                    const view = new DataView(buf);
                    view.setUint8(0, CUSTOM_RED_WAVE_OPCODE);
                    // We assume the click event data contains position information.
                    // You might extract this from the original message or capture it from a click listener.
                    // For this example, we try to read floats from the original data (if available).
                    let posX = 100;  // default value
                    let posY = 100;  // default value
                    try {
                        // If the underlying message provides the click position at a known offset:
                        posX = dv.getFloat32(1, true); // little-endian
                        posY = dv.getFloat32(5, true);
                    } catch(e) {
                        // Alternatively, use a globally captured click position.
                        if (window.lastClickPosition) {
                            posX = window.lastClickPosition.x;
                            posY = window.lastClickPosition.y;
                        }
                    }
                    view.setFloat32(1, posX, true);
                    view.setFloat32(5, posY, true);

                    console.log('[CustomWebSocket] Injecting red wave animation with opcode',
                                CUSTOM_RED_WAVE_OPCODE, 'at position:', posX, posY);

                    // Send our custom message instead of (or in addition to) the original click.
                    originalSend.call(ws, buf);
                    // Optionally, you can still forward the original data:
                    // originalSend.call(ws, data);
                    return;
                }
            }
            // Otherwise, send data unchanged.
            originalSend.call(ws, data);
        };

        // Listen for incoming messages.
        ws.addEventListener('message', function(event) {
            if (event.data instanceof ArrayBuffer) {
                const dv = new DataView(event.data);
                const opcode = dv.getUint8(0);
                if (opcode === CUSTOM_RED_WAVE_OPCODE) {
                    // Our custom message from the server for the red wave animation.
                    // Read the position data.
                    const posX = dv.getFloat32(1, true);
                    const posY = dv.getFloat32(5, true);
                    // You might also embed additional data (like duration) if needed.
                    displayRedWaveAnimation({ x: posX, y: posY }, 1000);
                    return; // Prevent further processing if necessary.
                }
            }
            // Let delta’s own message handler process other messages.
        });

        return ws;
    }
    window.WebSocket = CustomWebSocket;
    window.WebSocket.prototype = OriginalWebSocket.prototype;

    /*******************************
     * Step 2: Helper Functions
     *******************************/
    function isSpectating() {
        // Replace with your real check; for now, return true.
        return true;
    }

    function isMyTeam() {
        // Replace with your logic to determine if the spectator is on the target team.
        return true;
    }

    // Function to display the red wave animation on the delta UI.
    // Customize this to use delta UI styling.
    function displayRedWaveAnimation(position, duration) {
        console.log(`Displaying red wave animation at (${position.x}, ${position.y}) for ${duration}ms`);
        const waveElem = document.createElement('div');
        waveElem.style.position = 'absolute';
        waveElem.style.left = position.x + 'px';
        waveElem.style.top = position.y + 'px';
        waveElem.style.width = '100px';
        waveElem.style.height = '100px';
        waveElem.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
        waveElem.style.borderRadius = '50%';
        waveElem.style.zIndex = '9999';
        document.body.appendChild(waveElem);

        // Animate (using CSS animations or the Web Animations API)
        waveElem.animate([
            { transform: 'scale(1)', opacity: 0.7 },
            { transform: 'scale(1.5)', opacity: 0 }
        ], {
            duration: duration,
            easing: 'ease-out',
            fill: 'forwards'
        });

        setTimeout(() => {
            waveElem.remove();
        }, duration);
    }

    /*******************************
     * Step 3: Optional – Capture Click Positions
     *******************************/
    // In case the delta code does not provide position data,
    // capture the click position manually.
    document.addEventListener('click', function(event) {
        // Adjust the condition if necessary (e.g., check for a specific canvas or element)
        if (event.target && event.target.id === 'gameCanvas') {
            window.lastClickPosition = { x: event.clientX, y: event.clientY };
            console.log('[CustomWebSocket] Captured click position:', window.lastClickPosition);
        }
    });
})();
