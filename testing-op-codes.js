(function () {
  "use strict";

  /* =====================================================
     PART 1: GAME STATE HOOK
     This section runs immediately and sets up a global
     window.gameState and intercepts WebSocket messages.
  ===================================================== */
  (function installGameStateHook() {
    console.log("[Hook] Starting game state hook installation...");

    // Create a global game state object.
    window.gameState = {
      players: {},    // {playerID: {playerID, name, skinURL, clanTag, …}, …}
      spectators: {}  // {playerID: [playerID, name, skinURL, "spectator"], …}
    };

    // --- Enhanced BinaryReader with additional methods ---
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
    }

    // --- Delta packet parsers (dummy implementations) ---
    // Adjust these to match the actual binary format.
    const deltaPacketParsers = {
      auth(reader) {
        try {
          const playerID = reader.readUInt32();
          console.log("[Parser] auth: playerID =", playerID);
          return { playerID };
        } catch (err) {
          throw err;
        }
      },
      clientRegisterTab(reader) {
        try {
          const playerID = reader.readUInt32();
          const name = reader.readUTF16StringLength();
          const skinURL = reader.readUTF16StringLength();
          console.log("[Parser] clientRegisterTab:", { playerID, name, skinURL });
          return { playerID, name, skinURL };
        } catch (err) {
          throw err;
        }
      },
      serverRegisteredTab(reader) {
        try {
          const playerID = reader.readUInt32();
          const name = reader.readUTF16StringLength();
          const skinURL = reader.readUTF16StringLength();
          console.log("[Parser] serverRegisteredTab:", { playerID, name, skinURL });
          return { playerID, name, skinURL };
        } catch (err) {
          throw err;
        }
      },
      clientRemoveTab(reader) {
        try {
          const playerID = reader.readUInt32();
          console.log("[Parser] clientRemoveTab: playerID =", playerID);
          return { playerID };
        } catch (err) {
          throw err;
        }
      },
      serverRemovedTab(reader) {
        try {
          const playerID = reader.readUInt32();
          console.log("[Parser] serverRemovedTab: playerID =", playerID);
          return { playerID };
        } catch (err) {
          throw err;
        }
      },
      clientTokenTag(reader) {
        try {
          const playerID = reader.readUInt32();
          const clanTag = reader.readUTF16StringLength();
          console.log("[Parser] clientTokenTag:", { playerID, clanTag });
          return { playerID, clanTag };
        } catch (err) {
          throw err;
        }
      },
      commander(reader) {
        try {
          const playerID = reader.readUInt32();
          const name = reader.readUTF16StringLength();
          const skinURL = reader.readUTF16StringLength();
          console.log("[Parser] commander:", { playerID, name, skinURL });
          return [playerID, name, skinURL, "spectator"];
        } catch (err) {
          throw err;
        }
      }
    };

    // Helper functions to update game state.
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

    // --- WebSocket interception ---
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
                // Call each parser and update game state accordingly.
                try {
                  const authData = parsers.auth(new BinaryReader(event.data));
                  console.log("[Hook] Auth data:", authData);
                  if (authData && authData.playerID) {
                    window.gameState.players[authData.playerID] =
                      window.gameState.players[authData.playerID] || {};
                    window.gameState.players[authData.playerID].auth = authData;
                  }
                } catch (err) { /* Not applicable */ }

                try {
                  const regData = parsers.clientRegisterTab(new BinaryReader(event.data));
                  console.log("[Hook] Client register data:", regData);
                  updatePlayerFromRegister(regData);
                } catch (err) { /* Possibly not a registration packet */ }

                try {
                  const sRegData = parsers.serverRegisteredTab(new BinaryReader(event.data));
                  console.log("[Hook] Server register data:", sRegData);
                  updatePlayerFromRegister(sRegData);
                } catch (err) { }

                try {
                  const remData = parsers.clientRemoveTab(new BinaryReader(event.data));
                  console.log("[Hook] Client remove data:", remData);
                  if (remData && remData.playerID) {
                    removePlayer(remData.playerID);
                  }
                } catch (err) { }

                try {
                  const sRemData = parsers.serverRemovedTab(new BinaryReader(event.data));
                  console.log("[Hook] Server remove data:", sRemData);
                  if (sRemData && sRemData.playerID) {
                    removePlayer(sRemData.playerID);
                  }
                } catch (err) { }

                try {
                  const tokenData = parsers.clientTokenTag(new BinaryReader(event.data));
                  console.log("[Hook] Token tag data:", tokenData);
                  if (tokenData && tokenData.playerID) {
                    updatePlayerToken(tokenData);
                  }
                } catch (err) { }

                try {
                  const commData = parsers.commander(new BinaryReader(event.data));
                  console.log("[Hook] Commander (spectator) data:", commData);
                  updateSpectator(commData);
                } catch (err) { }
              } else {
                console.warn("[Hook] window.delta_packet.parse not defined.");
              }
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
