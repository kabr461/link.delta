(function () {
  "use strict";

  /* =====================================================
     PART 1: GAME STATE HOOK
     This section runs immediately and sets up a global
     window.gameState and intercepts WebSocket messages.
  ===================================================== */
  (function installGameStateHook() {
    console.log("[Hook] Starting game state hook installation...");

    // Create a global game state object that both parts share.
    window.gameState = {
      players: {},    // e.g. {1234: {playerID: 1234, tag:"Player1234", clanTag:"XYZ", ...}, ...}
      spectators: {}  // e.g. {5678: [5678, ...], ...}
    };

    // --- Dummy BinaryReader (replace with your own implementation) ---
    class BinaryReader {
      constructor(data) {
        if (data instanceof ArrayBuffer) {
          this.buffer = data;
        } else if (data instanceof Uint8Array) {
          this.buffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
        } else {
          throw new Error("Unsupported data type for BinaryReader");
        }
        this.view = new DataView(this.buffer);
        this.offset = 0;
        this.le = true;
      }
      readUInt8() {
        if (this.offset + 1 > this.view.byteLength) throw new RangeError("Offset out of bounds");
        return this.view.getUint8(this.offset++);
      }
      // Add other methods as needed…
    }

    // --- Dummy delta packet parsers (replace with real logic) ---
    const deltaPacketParsers = {
      auth(reader) {
        // For demonstration, just read one byte as playerID
        try {
          return { playerID: reader.readUInt8() };
        } catch (err) {
          throw err;
        }
      },
      clientRegisterTab(reader) {
        try {
          const id = reader.readUInt8();
          return { playerID: id, tag: "Player" + id };
        } catch (err) {
          throw err;
        }
      },
      clientRemoveTab(reader) {
        try {
          const id = reader.readUInt8();
          return { playerID: id };
        } catch (err) {
          throw err;
        }
      },
      clientTokenTag(reader) {
        try {
          const id = reader.readUInt8();
          return { playerID: id, clanTag: "Clan" + id };
        } catch (err) {
          throw err;
        }
      },
      commander(reader) {
        try {
          const id = reader.readUInt8();
          return [id, "spectator", "extra info"];
        } catch (err) {
          throw err;
        }
      }
    };

    // Helper functions to update the game state.
    function updatePlayer(regData) {
      if (regData && regData.playerID) {
        window.gameState.players[regData.playerID] =
          Object.assign(window.gameState.players[regData.playerID] || {}, regData);
        console.log("[Hook] Updated player registration:", window.gameState.players[regData.playerID]);
      }
    }
    function removePlayer(playerID) {
      console.log("[Hook] Removing player:", playerID);
      delete window.gameState.players[playerID];
      delete window.gameState.spectators[playerID];
    }
    function updateSpectator(specData) {
      if (Array.isArray(specData) && specData.length > 0) {
        const playerID = specData[0];
        window.gameState.spectators[playerID] = specData;
        console.log("[Hook] Updated spectator info for player", playerID, ":", specData);
      }
    }

    // --- Override WebSocket to intercept messages ---
    const OriginalWebSocket = window.WebSocket;
    const originalAddEventListener = OriginalWebSocket.prototype.addEventListener;
    OriginalWebSocket.prototype.addEventListener = function (type, listener, options) {
      if (type === "message") {
        const wrappedListener = function (event) {
          if (event.data instanceof ArrayBuffer) {
            try {
              const rawData = new Uint8Array(event.data);
              console.log("[Hook] Raw binary data received:", rawData);

              // Process auth data.
              try {
                const authReader = new BinaryReader(event.data);
                const authData = deltaPacketParsers.auth(authReader);
                console.log("[Hook] Auth data:", authData);
                if (authData && authData.playerID) {
                  window.gameState.players[authData.playerID] =
                    window.gameState.players[authData.playerID] || {};
                  window.gameState.players[authData.playerID].auth = authData;
                }
              } catch (err) { }

              // Process client registration.
              try {
                const regReader = new BinaryReader(event.data);
                const regData = deltaPacketParsers.clientRegisterTab(regReader);
                console.log("[Hook] Client register data:", regData);
                updatePlayer(regData);
              } catch (err) { }

              // Process client removal.
              try {
                const remReader = new BinaryReader(event.data);
                const remData = deltaPacketParsers.clientRemoveTab(remReader);
                console.log("[Hook] Client remove data:", remData);
                if (remData && remData.playerID) {
                  removePlayer(remData.playerID);
                }
              } catch (err) { }

              // Process token/tag info.
              try {
                const tokenReader = new BinaryReader(event.data);
                const tokenData = deltaPacketParsers.clientTokenTag(tokenReader);
                console.log("[Hook] Token tag data:", tokenData);
                updatePlayer(tokenData);
              } catch (err) { }

              // Process spectator info (using commander parser).
              try {
                const commReader = new BinaryReader(event.data);
                const commData = deltaPacketParsers.commander(commReader);
                console.log("[Hook] Commander (spectator) data:", commData);
                updateSpectator(commData);
              } catch (err) { }

            } catch (processingError) {
              console.error("[Hook] Error processing WebSocket data:", processingError);
            }
          }
          listener(event);
        };
        originalAddEventListener.call(this, type, wrappedListener, options);
      } else {
        originalAddEventListener.call(this, type, listener, options);
      }
    };

    // Override the onmessage property as well.
    Object.defineProperty(OriginalWebSocket.prototype, "onmessage", {
      set: function (fn) {
        this.addEventListener("message", fn);
      },
      get: function () {
        return null;
      }
    });

    console.log("[Hook] Game state hook installed. Current game state:", window.gameState);
    })(); // end Part 1
  })();

  /* =====================================================
     PART 2: UI CODE
     This section waits for the DOM to be ready (plus an
     extra 6‑second delay) and then builds a UI panel using
     the dynamic data from window.gameState.
  ===================================================== */
