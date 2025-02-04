console.log("[WebSocket Debug] Initializing WebSocket override...");

(function () {
    'use strict';

    const OriginalWebSocket = window.WebSocket;
    let gameWebSocket = null;  // Handles in-game actions (waves, movement)
    let parseWebSocket = null; // Handles chat, commands, spectator requests
    let readOnlyWebSocket = null; // Receives game state updates (leaderboard, players)

    class CustomWebSocket extends OriginalWebSocket {
        constructor(url, protocols) {
            super(url, protocols);
            console.log('[CustomWebSocket] Connecting to:', url);

            this.addEventListener('open', () => {
                console.log('[CustomWebSocket] Connection opened:', url);
            });

            this.addEventListener('message', (event) => {
                if (event.data instanceof Blob) {
                    event.data.arrayBuffer().then(buffer => {
                        let dataArray = new Uint8Array(buffer);
                        let opcode = dataArray[0]; // First byte is the opcode

                        console.log("[CustomWebSocket] Received Binary Data:", dataArray);
                        console.log("[CustomWebSocket] Opcode:", opcode);

                        // Routing based on opcode (Modify as needed)
                        if (opcode === 20) {
                            console.log("Spectator List Data:", dataArray.slice(1));
                            window.handleSpectatorList?.(dataArray.slice(1)); // Call JS function if defined
                        } else if (opcode === 25) {
                            console.log("Chat Message:", dataArray.slice(1));
                            window.handleChatMessage?.(dataArray.slice(1)); // Call JS function if defined
                        } else if (opcode === 30) {
                            console.log("Leaderboard Update:", dataArray.slice(1));
                            window.handleLeaderboard?.(dataArray.slice(1)); // Call JS function if defined
                        } else {
                            console.log("[CustomWebSocket] Unrecognized Opcode:", opcode);
                        }
                    });
                } else {
                    let jsonData = JSON.parse(event.data);
                    console.log("[CustomWebSocket] Received JSON Data:", jsonData);

                    // Handle JSON messages
                    if (jsonData.op === "spectatorList") {
                        window.handleSpectatorList?.(jsonData.data);
                    } else if (jsonData.op === "chatMessage") {
                        window.handleChatMessage?.(jsonData.message);
                    }
                }
            });

            this.addEventListener('error', (error) => {
                console.error('[CustomWebSocket] Error:', error);
            });

            this.addEventListener('close', (event) => {
                console.warn('[CustomWebSocket] Connection closed:', event);
                setTimeout(() => {
                    console.log('[CustomWebSocket] Attempting to reconnect...');
                    window.WebSocket = new CustomWebSocket(this.url, this.protocols);
                }, 3000);
            });
        }

        send(data) {
            if (this.readyState === WebSocket.OPEN) {
                console.log('[CustomWebSocket] Sending:', data);
                super.send(data);
            } else {
                console.warn('[CustomWebSocket] Attempted to send data while WebSocket was not open:', data);
            }
        }

        close(code, reason) {
            console.log('[CustomWebSocket] Closing connection:', code, reason);
            super.close(code, reason);
        }
    }

    setTimeout(() => {
        window.WebSocket = CustomWebSocket;
        console.log('[CustomWebSocket] Override Applied');
    }, 1000);

    // 🔹 **Functions to Send Data from Your JavaScript Code** 🔹

    // 🟢 Send commands via Parse WebSocket (chat, spectator list)
    window.sendCommand = function (type, data) {
        if (!parseWebSocket || parseWebSocket.readyState !== WebSocket.OPEN) {
            console.error("[CustomWebSocket] Parse WebSocket is not connected.");
            return;
        }

        let payload = {};

        switch (type) {
            case "chat":
                payload = { op: "sendMessage", message: data, sessionToken: "r:e7de123f644091812f2c8e091a210171" };
                break;
            case "spectatorList":
                payload = { op: "requestSpectatorList" };
                break;
            case "adminCommand":
                payload = { op: "adminCommand", command: data };
                break;
            default:
                console.error("[CustomWebSocket] Unknown command type:", type);
                return;
        }

        parseWebSocket.send(JSON.stringify(payload));
        console.log("[CustomWebSocket] Sent command:", type, payload);
    };

    // 🟢 Send game actions via Game WebSocket (wave animation, movement)
    window.sendGameAction = function (actionType) {
        if (!gameWebSocket || gameWebSocket.readyState !== WebSocket.OPEN) {
            console.error("[CustomWebSocket] Game WebSocket is not connected.");
            return;
        }

        let packet;

        switch (actionType) {
            case "wave":
                packet = new Uint8Array([15, 1]); // 15 = Wave opcode, 1 = Activate wave
                break;
            case "moveLeft":
                packet = new Uint8Array([10, 0]); // Example movement (will need correct opcode)
                break;
            default:
                console.error("[CustomWebSocket] Unknown action type:", actionType);
                return;
        }

        gameWebSocket.send(packet);
        console.log("[CustomWebSocket] Sent game action:", actionType);
    };

})();
