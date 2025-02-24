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
      if (this.offset + 1 > this.view.byteLength) throw new RangeError("Offset out of bounds");
      const value = this.view.getUint8(this.offset);
      this.offset++;
      return value;
    }
    readUInt16() {
      if (this.offset + 2 > this.view.byteLength) throw new RangeError("Offset out of bounds");
      const value = this.view.getUint16(this.offset, this.le);
      this.offset += 2;
      return value;
    }
    readUInt32() {
      if (this.offset + 4 > this.view.byteLength) throw new RangeError("Offset out of bounds");
      const value = this.view.getUint32(this.offset, this.le);
      this.offset += 4;
      return value;
    }
    readInt16() {
      if (this.offset + 2 > this.view.byteLength) throw new RangeError("Offset out of bounds");
      const value = this.view.getInt16(this.offset, this.le);
      this.offset += 2;
      return value;
    }
    readInt32() {
      if (this.offset + 4 > this.view.byteLength) throw new RangeError("Offset out of bounds");
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
        if (this.offset + 2 > this.view.byteLength) throw new RangeError("Offset out of bounds in readUTF16StringLength");
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
    // (Add any additional methods as needed.)
  }

  // --- Global game state for tracking players and spectators ---
  window.gameState = {
    players: {},   // keyed by playerID; will hold registration and tag data
    spectators: {} // keyed by playerID; used if a parser (like "commander") yields spectator info
  };

  // Helper functions to update gameState.
  function updatePlayerFromRegister(data) {
    // data may come from clientRegisterTab or serverRegisteredTab; expect a playerID and callbackID.
    if (data.playerID) {
      window.gameState.players[data.playerID] = Object.assign(window.gameState.players[data.playerID] || {}, data);
      console.log("Updated player registration:", window.gameState.players[data.playerID]);
    }
  }

  function removePlayer(playerID) {
    console.log("Removing player:", playerID);
    delete window.gameState.players[playerID];
    delete window.gameState.spectators[playerID];
  }

  function updatePlayerToken(data) {
    // data from clientTokenTag (which contains fields like clanTag, serverToken, etc.)
    if (data && data.playerID) {
      window.gameState.players[data.playerID] = Object.assign(window.gameState.players[data.playerID] || {}, data);
      console.log("Updated player token tags:", window.gameState.players[data.playerID]);
    }
  }

  function updateSpectator(data) {
    // For demonstration, we assume the "commander" parser returns an array whose first element is a playerID.
    if (Array.isArray(data) && data.length > 0) {
      const playerID = data[0];
      window.gameState.spectators[playerID] = data;
      console.log("Updated spectator info for player", playerID, ":", data);
    }
  }

  // --- WebSocket Interception to capture delta_packet messages ---
  const OriginalWebSocket = window.WebSocket;
  const originalAddEventListener = OriginalWebSocket.prototype.addEventListener;

  OriginalWebSocket.prototype.addEventListener = function (type, listener, options) {
    if (type === "message") {
      const wrappedListener = function (event) {
        // Process only binary messages.
        if (event.data instanceof ArrayBuffer) {
          try {
            // For logging, show the raw data.
            const rawData = new Uint8Array(event.data);
            console.log("Raw binary data:", rawData);

            // If delta_packet.parse exists, try relevant parsers.
            if (window.delta_packet && window.delta_packet.parse) {
              const parsers = window.delta_packet.parse;

              // Process auth events.
              try {
                const authReader = new BinaryReader(event.data);
                const authData = parsers.auth(authReader);
                console.log("Auth data:", authData);
                if (authData && authData.playerID) {
                  window.gameState.players[authData.playerID] = window.gameState.players[authData.playerID] || {};
                  window.gameState.players[authData.playerID].auth = authData;
                }
              } catch (err) {
                // Skip if not applicable.
              }

              // Process player registration.
              try {
                const regReader = new BinaryReader(event.data);
                const regData = parsers.clientRegisterTab(regReader);
                console.log("Client register data:", regData);
                updatePlayerFromRegister(regData);
              } catch (err) {
                // Sometimes not every packet is a registration event.
              }
              try {
                const sRegReader = new BinaryReader(event.data);
                const sRegData = parsers.serverRegisteredTab(sRegReader);
                console.log("Server register data:", sRegData);
                updatePlayerFromRegister(sRegData);
              } catch (err) { }

              // Process player removals.
              try {
                const remReader = new BinaryReader(event.data);
                const remData = parsers.clientRemoveTab(remReader);
                console.log("Client remove data:", remData);
                if (remData && remData.playerID) {
                  removePlayer(remData.playerID);
                }
              } catch (err) { }
              try {
                const sRemReader = new BinaryReader(event.data);
                const sRemData = parsers.serverRemovedTab(sRemReader);
                console.log("Server remove data:", sRemData);
                if (sRemData && sRemData.playerID) {
                  removePlayer(sRemData.playerID);
                }
              } catch (err) { }

              // Process token/tag info.
              try {
                const tokenReader = new BinaryReader(event.data);
                const tokenData = parsers.clientTokenTag(tokenReader);
                console.log("Token tag data:", tokenData);
                // Note: tokenData may not include a playerID in some cases.
                if (tokenData && tokenData.playerID) {
                  updatePlayerToken(tokenData);
                }
              } catch (err) { }

              // Process spectator info (example: using "commander" parser).
              try {
                const commReader = new BinaryReader(event.data);
                const commData = parsers.commander(commReader);
                console.log("Commander (spectator) data:", commData);
                updateSpectator(commData);
              } catch (err) { }

              // Optionally, you may process clientQuadrantResponse or other parsers if they provide additional info.
            }
          } catch (processingError) {
            console.error("Error processing WebSocket data for game state:", processingError);
          }
        }
        // Pass the event to the original listener.
        listener(event);
      };
      originalAddEventListener.call(this, type, wrappedListener, options);
    } else {
      originalAddEventListener.call(this, type, listener, options);
    }
  };

  // Also override onmessage property.
  Object.defineProperty(OriginalWebSocket.prototype, "onmessage", {
    set: function (fn) {
      this.addEventListener("message", fn);
    },
    get: function () {
      return null;
    }
  });

  console.log("Game state hook installed. Current game state:", window.gameState);
})();
