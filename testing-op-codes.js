(function () {
  "use strict";

  // --- Enhanced BinaryReader with additional methods ---
  class BinaryReader {
    constructor(data) {
      if (data instanceof ArrayBuffer) {
        this.buffer = data;
      } else if (data instanceof Uint8Array) {
        // Use the slice of the underlying ArrayBuffer
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
    // Reads a length-prefixed UTF-16 string (first 16-bit length, then that many code units).
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
    // (Additional methods can be added as needed)
  }

  // --- Global game state for tracking players and spectators ---
  window.gameState = {
    players: {},    // Will hold objects keyed by playerID.
    spectators: {}  // For spectator data.
  };

  // Helper function to log the current game state every 10 seconds.
  function logGameState() {
    console.clear();
    console.table(Object.values(window.gameState.players));
    console.table(Object.values(window.gameState.spectators));
  }
  setInterval(logGameState, 10000);

  // Dummy delta packet parsers.
  // Replace these with your actual protocol parsing logic.
  const deltaPacketParsers = {
    // For auth: simply read one byte as playerID.
    auth(reader) {
      try {
        return { playerID: reader.readUInt8() };
      } catch (err) {
        throw err;
      }
    },
    // For registration: read an 8-bit id, then a length-prefixed UTF-16 string for name,
    // and another length-prefixed UTF-16 string for skin.
    clientRegisterTab(reader) {
      try {
        const playerID = reader.readUInt8();
        const name = reader.readUTF16StringLength();
        const skin = reader.readUTF16StringLength();
        return { playerID, name, skin };
      } catch (err) {
        throw err;
      }
    },
    // For removal, just read the playerID.
    clientRemoveTab(reader) {
      try {
        const playerID = reader.readUInt8();
        return { playerID };
      } catch (err) {
        throw err;
      }
    },
    // For token/tag info: read playerID and a clan tag.
    clientTokenTag(reader) {
      try {
        const playerID = reader.readUInt8();
        const clanTag = reader.readUTF16StringZero();
        return { playerID, clanTag };
      } catch (err) {
        throw err;
      }
    },
    // For spectator packets: read an 8-bit playerID, then a length-prefixed UTF-16 string for name,
    // and a length-prefixed UTF-16 string for skin.
    commander(reader) {
      try {
        const playerID = reader.readUInt8();
        const name = reader.readUTF16StringLength();
        const skin = reader.readUTF16StringLength();
        return [playerID, name, skin];
      } catch (err) {
        throw err;
      }
    }
  };

  // Helper functions to update gameState.
  function updatePlayerFromRegister(regData) {
    if (regData.playerID) {
      const id = regData.playerID;
      window.gameState.players[id] = window.gameState.players[id] || {};
      window.gameState.players[id].playerID = id;
      if (regData.name) window.gameState.players[id].name = regData.name;
      if (regData.skin) window.gameState.players[id].skin = regData.skin;
    }
  }

  function removePlayer(playerID) {
    delete window.gameState.players[playerID];
    delete window.gameState.spectators[playerID];
  }

  function updatePlayerToken(tokenData) {
    if (tokenData && tokenData.playerID) {
      const id = tokenData.playerID;
      window.gameState.players[id] = window.gameState.players[id] || {};
      if (tokenData.clanTag) window.gameState.players[id].clanTag = tokenData.clanTag;
    }
  }

  function updateSpectator(specData) {
    // Expecting an array: [playerID, name, skin]
    if (Array.isArray(specData) && specData.length > 0) {
      const playerID = specData[0];
      window.gameState.spectators[playerID] = {
        playerID,
        name: specData[1] || "",
        skin: specData[2] || ""
      };
    }
  }

  // --- Override WebSocket to intercept messages ---
  const OriginalWebSocket = window.WebSocket;
  const originalAddEventListener = OriginalWebSocket.prototype.addEventListener;

  OriginalWebSocket.prototype.addEventListener = function (type, listener, options) {
    if (type === "message") {
      const wrappedListener = function (event) {
        // Process only binary messages.
        if (event.data instanceof ArrayBuffer) {
          try {
            const rawData = new Uint8Array(event.data);
            // No extra debug logging here.
            if (window.delta_packet && window.delta_packet.parse) {
              const parsers = window.delta_packet.parse;

              try {
                const authReader = new BinaryReader(event.data);
                const authData = parsers.auth(authReader);
                if (authData && authData.playerID) {
                  window.gameState.players[authData.playerID] = window.gameState.players[authData.playerID] || {};
                  window.gameState.players[authData.playerID].auth = authData;
                }
              } catch (err) { /* skip */ }

              try {
                const regReader = new BinaryReader(event.data);
                const regData = parsers.clientRegisterTab(regReader);
                updatePlayerFromRegister(regData);
              } catch (err) { /* skip */ }
              try {
                const sRegReader = new BinaryReader(event.data);
                const sRegData = parsers.serverRegisteredTab ? parsers.serverRegisteredTab(sRegReader) : null;
                if (sRegData) {
                  updatePlayerFromRegister(sRegData);
                }
              } catch (err) { /* skip */ }

              try {
                const remReader = new BinaryReader(event.data);
                const remData = parsers.clientRemoveTab(remReader);
                if (remData && remData.playerID) {
                  removePlayer(remData.playerID);
                }
              } catch (err) { /* skip */ }
              try {
                const sRemReader = new BinaryReader(event.data);
                const sRemData = parsers.serverRemovedTab ? parsers.serverRemovedTab(sRemReader) : null;
                if (sRemData && sRemData.playerID) {
                  removePlayer(sRemData.playerID);
                }
              } catch (err) { /* skip */ }

              try {
                const tokenReader = new BinaryReader(event.data);
                const tokenData = parsers.clientTokenTag(tokenReader);
                if (tokenData && tokenData.playerID) {
                  updatePlayerToken(tokenData);
                }
              } catch (err) { /* skip */ }

              try {
                const commReader = new BinaryReader(event.data);
                const commData = parsers.commander(commReader);
                updateSpectator(commData);
              } catch (err) { /* skip */ }
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

  // Also override the onmessage property.
  Object.defineProperty(OriginalWebSocket.prototype, "onmessage", {
    set: function (fn) {
      this.addEventListener("message", fn);
    },
    get: function () {
      return null;
    }
  });

  console.log("[Hook] Game state hook installed. Current game state:", window.gameState);
})();
