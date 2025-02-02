(function() {
    'use strict';

    /*******************************
     * Configuration – Adjust These:
     *******************************/
    // Use custom opcode 150 for the red wave animation.
    // (Change to 151, 160, etc., if conflicts arise.)
    const CUSTOM_RED_WAVE_OPCODE = 150;
    
    // Final Data Layout: 1 (opcode) + 4 (X pos) + 4 (Y pos) + 4 (Duration) + 1 (Team ID) + 1 (Wave Type)
    const CUSTOM_MSG_LENGTH = 1 + 4 + 4 + 4 + 1 + 1; // 15 bytes

    // Define default values for our custom message.
    const DEFAULT_DURATION = 1000; // 1 second
    const DEFAULT_TEAM_ID = 1;       // Replace with actual team ID logic
    const DEFAULT_WAVE_TYPE = 1;     // 1 for red wave; could support multiple types

    /*******************************
     * Step 1: Override the WebSocket Constructor
     *******************************/
    const OriginalWebSocket = window.WebSocket;
    function CustomWebSocket(url, protocols) {
        const ws = protocols ? new OriginalWebSocket(url, protocols) : new OriginalWebSocket(url);

        // Override the send method.
        // If delta uses a hidden game socket (e.g., hiddenGameSocket.send), adapt accordingly.
        const originalSend = ws.send;
        ws.send = function(data) {
            // Check if the data is binary (ArrayBuffer) as delta uses DataView
            if (data instanceof ArrayBuffer) {
                const dv = new DataView(data);
                // Candidate check: if the underlying message is a click event.
                // Since clicks aren’t clearly defined, we assume one candidate is opcode 99 or 16.
                // Adjust the condition below to match your testing.
                const originalOpcode = dv.getUint8(0);
                if ((originalOpcode === 99 || originalOpcode === 16) && isSpectating() && isMyTeam()) {
                    // Build our custom binary message for the red wave.
                    const buf = new ArrayBuffer(CUSTOM_MSG_LENGTH);
                    const view = new DataView(buf);
                    let offset = 0;
                    // 1. Write our custom opcode.
                    view.setUint8(offset, CUSTOM_RED_WAVE_OPCODE); offset += 1;
                    // 2. Write X position.
                    // Attempt to extract position from the original data if available;
                    // otherwise, use a captured click position.
                    let posX = 100; // Default value.
                    let posY = 100; // Default value.
                    try {
                        posX = dv.getFloat32(1, true); // Change offset if necessary.
                        posY = dv.getFloat32(5, true);
                    } catch (e) {
                        if (window.lastClickPosition) {
                            posX = window.lastClickPosition.x;
                            posY = window.lastClickPosition.y;
                        }
                    }
                    view.setFloat32(offset, posX, true); offset += 4;
                    // 3. Write Y position.
                    view.setFloat32(offset, posY, true); offset += 4;
                    // 4. Write duration.
                    view.setFloat32(offset, DEFAULT_DURATION, true); offset += 4;
                    // 5. Write team ID.
                    view.setUint8(offset, DEFAULT_TEAM_ID); offset += 1;
                    // 6. Write wave type.
                    view.setUint8(offset, DEFAULT_WAVE_TYPE); offset += 1;

                    console.log('[CustomWebSocket] Injecting red wave animation message with opcode',
                                CUSTOM_RED_WAVE_OPCODE, 'Position:', posX, posY);
                    
                    // Send our custom message. You can choose to send the original message as well if needed.
                    originalSend.call(ws, buf);
                    // Optionally, also forward the original message:
                    // originalSend.call(ws, data);
                    return;
                }
            }
            // Send other data unchanged.
            originalSend.call(ws, data);
        };

        // Listen for incoming messages from the server.
        ws.addEventListener('message', function(event) {
            if (event.data instanceof ArrayBuffer) {
                const dv = new DataView(event.data);
                const opcode = dv.getUint8(0);
                if (opcode === CUSTOM_RED_WAVE_OPCODE) {
                    // Our custom red wave message.
                    const posX = dv.getFloat32(1, true);
                    const posY = dv.getFloat32(5, true);
                    const duration = dv.getFloat32(9, true);
                    const teamId = dv.getUint8(13);
                    const waveType = dv.getUint8(14);
                    // Call our rendering function.
                    displayRedWaveAnimation({ x: posX, y: posY }, duration, teamId, waveType);
                    return; // Prevent further processing if needed.
                }
            }
            // Allow delta's built-in message handler to process all other messages.
        });

        return ws;
    }
    window.WebSocket = CustomWebSocket;
    window.WebSocket.prototype = OriginalWebSocket.prototype;

    /*******************************
     * Step 2: Helper Functions
     *******************************/

    // Placeholder: Determine if the user is spectating.
    // Use opcodes 113, 114 (spectate restrictions) or other game state info.
    function isSpectating() {
        // TODO: Replace with actual check from delta code.
        return true;
    }

    // Placeholder: Check if the spectator belongs to the desired team.
    // Use information from leaderboard updates (Opcode 21) or other team-related data.
    function isMyTeam() {
        // TODO: Replace with actual team verification.
        return true;
    }

    // Function to display the red wave animation.
    // Ideally, integrate with delta's UI rendering system instead of using raw DOM.
    function displayRedWaveAnimation(position, duration, teamId, waveType) {
        console.log(`Displaying red wave animation at (${position.x}, ${position.y}) for ${duration}ms. Team: ${teamId}, Type: ${waveType}`);
        
        // This example uses a simple DOM element. Replace with delta's built-in animation if available.
        const waveElem = document.createElement('div');
        waveElem.style.position = 'absolute';
        waveElem.style.left = position.x + 'px';
        waveElem.style.top = position.y + 'px';
        waveElem.style.width = '100px';
        waveElem.style.height = '100px';
        // Use team colors or delta's style here.
        waveElem.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
        waveElem.style.borderRadius = '50%';
        waveElem.style.zIndex = '9999';
        document.body.appendChild(waveElem);

        // Animate using the Web Animations API.
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
    // In case the delta code does not supply click positions, capture them manually.
    document.addEventListener('click', function(event) {
        // Adjust the condition as needed (e.g., ensure click is on the game canvas).
        if (event.target && event.target.id === 'gameCanvas') {
            window.lastClickPosition = { x: event.clientX, y: event.clientY };
            console.log('[CustomWebSocket] Captured click position:', window.lastClickPosition);
        }
    });

})();
