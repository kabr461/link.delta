(function () {
    'use strict';

    // Save the original WebSocket constructor
    const OriginalWebSocket = window.WebSocket;

    // Create a custom WebSocket class to override the native implementation
    class CustomWebSocket extends OriginalWebSocket {
        constructor(url, protocols) {
            console.log('[CustomWebSocket] Connecting to:', url);
            super(url, protocols);

            // Add event listeners for logging or custom behavior
            this.addEventListener('open', () => {
                console.log('[CustomWebSocket] Connection opened:', url);
            });

            this.addEventListener('message', (event) => {
         //       console.log('[CustomWebSocket] Message received:', event.data);
            });

            this.addEventListener('error', (error) => {
                console.error('[CustomWebSocket] Error:', error);
            });

            this.addEventListener('close', (event) => {
                console.warn('[CustomWebSocket] Connection closed:', event);
            });
        }

        // Optionally, you can override methods like send to customize their behavior
        send(data) {
     //       console.log('[CustomWebSocket] Sending data:', data);
            super.send(data);
        }

        close(code, reason) {
            console.log('[CustomWebSocket] Closing connection:', code, reason);
            super.close(code, reason);
        }
    }

    // Replace the native WebSocket with the custom implementation
    window.WebSocket = CustomWebSocket;

    // Optionally, expose the original WebSocket for debugging or fallback
    window.OriginalWebSocket = OriginalWebSocket;

    console.log('[CustomWebSocket] WebSocket override applied successfully.');
})();
