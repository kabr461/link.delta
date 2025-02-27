// ==UserScript==
// @name         Delta Player Data Interceptor
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Intercept and log player info data from Delta's processed messages.
// @author       
// @match        https://your-game-server.example.com/*
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Wrap WebSocket addEventListener to intercept messages.
    const originalAddEventListener = WebSocket.prototype.addEventListener;
    WebSocket.prototype.addEventListener = function(type, listener, options) {
        if (type === 'message') {
            const patchedListener = function(event) {
                // At this point, Delta should have processed the message.
                // You can inspect event.data and filter for your specific player update.
                try {
                    // Parse the processed data.
                    // Adjust this part according to the actual structure of Delta's output.
                    const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
                    
                    // For debugging: log all messages.
                    console.log("Intercepted processed message:", data);
                    
                    // Filter for only player update messages.
                    if (data && data.type === 'playerUpdate' && data.players) {
                        console.log("Player update detected:", data.players);
                        // Here you can further process or store only the desired info:
                        data.players.forEach(player => {
                            console.log(`Player: ${player.name}, Skin: ${player.skinUrl}, Tag: ${player.tag}`);
                        });
                    }
                } catch (err) {
                    console.error("Error processing message:", err);
                }
                // Call the original listener.
                listener.call(this, event);
            };
            originalAddEventListener.call(this, type, patchedListener, options);
        } else {
            originalAddEventListener.call(this, type, listener, options);
        }
    };

    // Alternatively, if Delta assigns onmessage directly, you might also override that:
    Object.defineProperty(WebSocket.prototype, "onmessage", {
        set: function(handler) {
            this._onmessage = function(event) {
                try {
                    // Intercept processed data.
                    const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
                    console.log("Intercepted processed message via onmessage:", data);
                    // Add filtering here if needed.
                } catch (err) {
                    console.error("Error in onmessage interceptor:", err);
                }
                // Call the original handler.
                handler(event);
            };
        },
        get: function() {
            return this._onmessage;
        }
    });
})();
