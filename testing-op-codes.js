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
      players: {},    // e.g. {1234: {playerID: 1234, name:"Foo", skinURL:"http://...", clanTag:"XYZ", ...}, ...}
      spectators: {}  // e.g. {5678: [5678, ...], ...}
    };

    // --- BinaryReader with extra methods ---
    class BinaryReader {
      constructor(data) {
        if (data instanceof ArrayBuffer) {
          this.buffer = data;
        } else if (data instanceof Uint8Array) {
          // Use a slice of the underlying ArrayBuffer.
          this.buffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
        } else {
          throw new Error("Unsupported data type for BinaryReader");
        }
        this.view = new DataView(this.buffer);
        this.offset = 0;
        this.le = true; // little-endian
      }
      readUInt8() {
        if (this.offset + 1 > this.view.byteLength)
          throw new RangeError("Offset out of bounds");
        const value = this.view.getUint8(this.offset);
        this.offset++;
        return value;
      }
      readUInt16() {
        if (this.offset + 2 > this.view.byteLength)
          throw new RangeError("Offset out of bounds");
        const value = this.view.getUint16(this.offset, this.le);
        this.offset += 2;
        return value;
      }
      readUInt32() {
        if (this.offset + 4 > this.view.byteLength)
          throw new RangeError("Offset out of bounds");
        const value = this.view.getUint32(this.offset, this.le);
        this.offset += 4;
        return value;
      }
      readInt16() {
        if (this.offset + 2 > this.view.byteLength)
          throw new RangeError("Offset out of bounds");
        const value = this.view.getInt16(this.offset, this.le);
        this.offset += 2;
        return value;
      }
      readInt32() {
        if (this.offset + 4 > this.view.byteLength)
          throw new RangeError("Offset out of bounds");
        const value = this.view.getInt32(this.offset, this.le);
        this.offset += 4;
        return value;
      }
      // Reads a null-terminated UTF-16 string.
      readUTF16StringZero() {
        let str = "";
        while (this.offset + 2 <= this.view.byteLength) {
          const code = this.readUInt16();
          if (code === 0) break;
          str += String.fromCharCode(code);
        }
        return str;
      }
      // Reads a length-prefixed UTF-16 string.
      readUTF16StringLength() {
        const len = this.readUInt16();
        let str = "";
        for (let i = 0; i < len; i++) {
          if (this.offset + 2 > this.view.byteLength)
            throw new RangeError("Offset out of bounds in readUTF16StringLength");
          const code = this.readUInt16();
          str += String.fromCharCode(code);
        }
        return str;
      }
      // Reads a null-terminated UTF-8 string.
      readUTF8StringZero() {
        let str = "";
        while (this.offset < this.view.byteLength) {
          const byte = this.readUInt8();
          if (byte === 0) break;
          str += String.fromCharCode(byte);
        }
        return str;
      }
      // Additional methods can be added as needed.
    }

    // --- Updated delta packet parsers (dummy implementations) ---
    // Adjust these according to the actual binary protocol.

    const deltaPacketParsers = {
      // For auth packets, assume the first 4 bytes are playerID.
      auth(reader) {
        try {
          const playerID = reader.readUInt32();
          return { playerID };
        } catch (err) {
          throw err;
        }
      },
      // For registration, assume:
      // • 4 bytes playerID,
      // • then a length-prefixed UTF-16 string for the player name,
      // • then another length-prefixed UTF-16 string for the skin URL.
      clientRegisterTab(reader) {
        try {
          const playerID = reader.readUInt32();
          const name = reader.readUTF16StringLength();
          const skinURL = reader.readUTF16StringLength();
          // Optionally, you could also read a tag if the protocol sends one.
          return { playerID, name, skinURL };
        } catch (err) {
          throw err;
        }
      },
      // Optionally, if the server sends a similar registration packet:
      serverRegisteredTab(reader) {
        try {
          const playerID = reader.readUInt32();
          const name = reader.readUTF16StringLength();
          const skinURL = reader.readUTF16StringLength();
          return { playerID, name, skinURL };
        } catch (err) {
          throw err;
        }
      },
      // For removals, assume a 4-byte playerID.
      clientRemoveTab(reader) {
        try {
          const playerID = reader.readUInt32();
          return { playerID };
        } catch (err) {
          throw err;
        }
      },
      serverRemovedTab(reader) {
        try {
          const playerID = reader.readUInt32();
          return { playerID };
        } catch (err) {
          throw err;
        }
      },
      // For token/tag data, assume:
      // • 4 bytes playerID,
      // • then a length-prefixed UTF-16 string for the clan tag.
      clientTokenTag(reader) {
        try {
          const playerID = reader.readUInt32();
          const clanTag = reader.readUTF16StringLength();
          return { playerID, clanTag };
        } catch (err) {
          throw err;
        }
      },
      // For spectator info, using a dummy parser:
      commander(reader) {
        try {
          const playerID = reader.readUInt32();
          // For spectators, we could assume the name is also sent.
          const name = reader.readUTF16StringLength();
          // And perhaps the skin URL too.
          const skinURL = reader.readUTF16StringLength();
          return [playerID, name, skinURL, "spectator"];
        } catch (err) {
          throw err;
        }
      }
    };

    // Helper functions to update the game state.
    function updatePlayerFromRegister(data) {
      if (data.playerID) {
        window.gameState.players[data.playerID] = Object.assign(
          window.gameState.players[data.playerID] || {},
          data
        );
        console.log("[Hook] Updated player registration:", window.gameState.players[data.playerID]);
      }
    }
    function removePlayer(playerID) {
      console.log("[Hook] Removing player:", playerID);
      delete window.gameState.players[playerID];
      delete window.gameState.spectators[playerID];
    }
    function updatePlayerToken(data) {
      if (data && data.playerID) {
        window.gameState.players[data.playerID] = Object.assign(
          window.gameState.players[data.playerID] || {},
          data
        );
        console.log("[Hook] Updated player token tags:", window.gameState.players[data.playerID]);
      }
    }
    function updateSpectator(data) {
      if (Array.isArray(data) && data.length > 0) {
        const playerID = data[0];
        window.gameState.spectators[playerID] = data;
        console.log("[Hook] Updated spectator info for player", playerID, ":", data);
      }
    }

    // --- WebSocket Interception to capture delta_packet messages ---
    const OriginalWebSocket = window.WebSocket;
    const originalAddEventListener = OriginalWebSocket.prototype.addEventListener;

    OriginalWebSocket.prototype.addEventListener = function (type, listener, options) {
      if (type === "message") {
        const wrappedListener = function (event) {
          if (event.data instanceof ArrayBuffer) {
            try {
              const rawData = new Uint8Array(event.data);
              console.log("[Hook] Raw binary data received:", rawData);

              if (window.delta_packet && window.delta_packet.parse) {
                const parsers = window.delta_packet.parse;

                // Process auth events.
                try {
                  const authReader = new BinaryReader(event.data);
                  const authData = parsers.auth(authReader);
                  console.log("[Hook] Auth data:", authData);
                  if (authData && authData.playerID) {
                    window.gameState.players[authData.playerID] =
                      window.gameState.players[authData.playerID] || {};
                    window.gameState.players[authData.playerID].auth = authData;
                  }
                } catch (err) { /* Skip if not applicable. */ }

                // Process client registration.
                try {
                  const regReader = new BinaryReader(event.data);
                  const regData = parsers.clientRegisterTab(regReader);
                  console.log("[Hook] Client register data:", regData);
                  updatePlayerFromRegister(regData);
                } catch (err) { /* Not every packet is a registration event. */ }
                try {
                  const sRegReader = new BinaryReader(event.data);
                  const sRegData = parsers.serverRegisteredTab(sRegReader);
                  console.log("[Hook] Server register data:", sRegData);
                  updatePlayerFromRegister(sRegData);
                } catch (err) { }

                // Process player removals.
                try {
                  const remReader = new BinaryReader(event.data);
                  const remData = parsers.clientRemoveTab(remReader);
                  console.log("[Hook] Client remove data:", remData);
                  if (remData && remData.playerID) {
                    removePlayer(remData.playerID);
                  }
                } catch (err) { }
                try {
                  const sRemReader = new BinaryReader(event.data);
                  const sRemData = parsers.serverRemovedTab(sRemReader);
                  console.log("[Hook] Server remove data:", sRemData);
                  if (sRemData && sRemData.playerID) {
                    removePlayer(sRemData.playerID);
                  }
                } catch (err) { }

                // Process token/tag info.
                try {
                  const tokenReader = new BinaryReader(event.data);
                  const tokenData = parsers.clientTokenTag(tokenReader);
                  console.log("[Hook] Token tag data:", tokenData);
                  if (tokenData && tokenData.playerID) {
                    updatePlayerToken(tokenData);
                  }
                } catch (err) { }

                // Process spectator info.
                try {
                  const commReader = new BinaryReader(event.data);
                  const commData = parsers.commander(commReader);
                  console.log("[Hook] Commander (spectator) data:", commData);
                  updateSpectator(commData);
                } catch (err) { }
              }
            } catch (processingError) {
              console.error("[Hook] Error processing WebSocket data for game state:", processingError);
            }
          }
          listener(event);
        };
        originalAddEventListener.call(this, type, wrappedListener, options);
      } else {
        originalAddEventListener.call(this, type, listener, options);
      }
    };

    // Override onmessage property.
    Object.defineProperty(OriginalWebSocket.prototype, "onmessage", {
      set: function (fn) {
        this.addEventListener("message", fn);
      },
      get: function () {
        return null;
      }
    });

    console.log("[Hook] Game state hook installed. Current game state:", window.gameState);
  })(); // end installGameStateHook
})();
