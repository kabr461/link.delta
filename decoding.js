(function () {
  "use strict";

  // ----- Enhanced BinaryReader Implementation -----
  class BinaryReader {
    constructor(data) {
      if (data instanceof ArrayBuffer) {
        this.buffer = data;
      } else if (data instanceof Uint8Array) {
        // Create a copy of the underlying ArrayBuffer slice
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
    // Reads a length-prefixed UTF-16 string.
    // First reads an unsigned 16-bit integer (the length), then that many 16-bit code units.
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
  }

  // ----- WebSocket Message Interception & Parser Hook -----
  const OriginalWebSocket = window.WebSocket;
  const originalAddEventListener = OriginalWebSocket.prototype.addEventListener;

  // Override addEventListener to intercept "message" events.
  OriginalWebSocket.prototype.addEventListener = function (type, listener, options) {
    if (type === "message") {
      const wrappedListener = function (event) {
        console.log("Intercepted WebSocket message event:", event);
        if (event.data instanceof ArrayBuffer) {
          try {
            const rawData = new Uint8Array(event.data);
            console.log("Raw binary data:", rawData);

            // If delta_packet.parse is available, try every parser function.
            if (window.delta_packet && window.delta_packet.parse) {
              const parsers = window.delta_packet.parse;
              for (const key in parsers) {
                if (typeof parsers[key] === "function") {
                  try {
                    // Create a fresh BinaryReader for each parser attempt.
                    const reader = new BinaryReader(event.data);
                    const output = parsers[key](reader);
                    console.log(`Parser [${key}] output:`, output);
                  } catch (err) {
                    console.log(`Parser [${key}] failed:`, err.message);
                  }
                }
              }
            } else {
              console.warn("delta_packet.parse is not available.");
            }
          } catch (processingError) {
            console.error("Error processing WebSocket data:", processingError);
          }
        } else {
          console.log("Received non-binary message:", event.data);
        }
        // Call the original listener.
        listener(event);
      };
      originalAddEventListener.call(this, type, wrappedListener, options);
    } else {
      originalAddEventListener.call(this, type, listener, options);
    }
  };

  // Also override the onmessage property to capture messages.
  Object.defineProperty(OriginalWebSocket.prototype, "onmessage", {
    set: function (fn) {
      this.addEventListener("message", fn);
    },
    get: function () {
      return null;
    }
  });

  console.log("WebSocket interception with enhanced BinaryReader installed.");
})();
