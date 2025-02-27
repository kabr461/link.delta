(function() {
    'use strict';

    console.log("Player Tracker: Script loaded.");

    // This object will store player info keyed by their unique ID.
    const players = {};

    // A helper function to update the UI or log the current players.
    function updatePlayerList() {
        console.clear();
        console.log("Active Players:");
        Object.values(players).forEach(player => {
            console.log(`ID: ${player.id}, Name: ${player.name}, Skin: ${player.skinUrl}, Tag: ${player.tag}`);
        });
    }

    // Function to process player update messages.
    function processPlayerUpdate(data) {
        // Expected structure (example):
        // {
        //   type: "playerUpdate",
        //   players: [
        //     { id: 123, name: "Player1", skinUrl: "http://...", tag: "TAG" },
        //     { id: 456, name: "Player2", skinUrl: "http://...", tag: "TAG2" },
        //     // ...
        //   ]
        // }
        if (data.players && Array.isArray(data.players)) {
            data.players.forEach(player => {
                // Update or add the player info.
                players[player.id] = player;
            });
            updatePlayerList();
        }
    }

    // Function to process player removal messages.
    function processPlayerRemove(data) {
        // Expected structure (example):
        // { type: "playerRemove", playerIds: [123, 789, ...] }
        if (data.playerIds && Array.isArray(data.playerIds)) {
            data.playerIds.forEach(id => {
                delete players[id];
            });
            updatePlayerList();
        }
    }

    // Intercept WebSocket messages to get processed (translated) data.
    // Assuming Delta module has already processed the message, and event.processedData is available.
    // We intercept the message events (adjust this code if your environment is different).
    const originalAddEventListener = WebSocket.prototype.addEventListener;
    WebSocket.prototype.addEventListener = function(type, listener, options) {
        if (type === 'message') {
            const patchedListener = function(event) {
                let data;
                try {
                    // Assume Delta already processed the message to JSON,
                    // either stored in event.processedData or we parse event.data.
                    data = event.processedData || JSON.parse(event.data);
                } catch (e) {
                    console.error("Failed to parse processed data:", e);
                    return;
                }
                // Check the type of message and call the appropriate handler.
                if (data && data.type === "playerUpdate") {
                    processPlayerUpdate(data);
                } else if (data && data.type === "playerRemove") {
                    processPlayerRemove(data);
                }
                // Pass the event on.
                listener.call(this, event);
            };
            originalAddEventListener.call(this, type, patchedListener, options);
        } else {
            originalAddEventListener.call(this, type, listener, options);
        }
    };

    // Also patch the onmessage property to ensure we capture messages.
    Object.defineProperty(WebSocket.prototype, "onmessage", {
        set: function(handler) {
            this._onmessage = function(event) {
                let data;
                try {
                    data = event.processedData || JSON.parse(event.data);
                } catch (e) {
                    console.error("onmessage interceptor error:", e);
                    return;
                }
                if (data && data.type === "playerUpdate") {
                    processPlayerUpdate(data);
                } else if (data && data.type === "playerRemove") {
                    processPlayerRemove(data);
                }
                handler(event);
            };
        },
        get: function() {
            return this._onmessage;
        },
        configurable: true
    });

    console.log("Player Tracker: WebSocket hooks injected. Waiting for messages...");

    // Now, as Delta processes the messages, our intercepted data should update the players object in real time.
})();
