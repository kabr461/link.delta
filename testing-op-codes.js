console.log("[WebSocket Debug] Initializing Debug Logger...");

(function() {
  'use strict';

  // Helper: Logs hex dump, header, and payload only if opcode is 25.
  function logMessageDetails(buffer, direction) {
    const bytes = new Uint8Array(buffer);
    if (bytes.length < 1) return;
    // Only log if the first byte (opcode) equals 25.
    if (bytes[0] !== 25) return;
    console.log(`[${direction}] Raw Hex Dump: ${Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join(" ")}`);
    if (bytes.length >= 2) {
      const header = bytes.slice(0, 2);
      const payload = bytes.slice(2);
      console.log(`[${direction}] Header (first 2 bytes): ${Array.from(header)
        .map(b => b.toString(16).padStart(2, '0'))
        .join(" ")}`);
      console.log(`[${direction}] Payload: ${Array.from(payload)
        .map(b => b.toString(16).padStart(2, '0'))
        .join(" ")}`);
    }
  }

  // Custom WebSocket to intercept and log messages.
  const OriginalWebSocket = window.WebSocket;
  class CustomWebSocket extends OriginalWebSocket {
    constructor(url, protocols) {
      super(url, protocols);
      this.addEventListener('message', (event) => {
        if (event.data instanceof ArrayBuffer) {
          logMessageDetails(event.data, "Incoming");
        } else if (event.data instanceof Blob) {
          event.data.arrayBuffer().then(buffer => logMessageDetails(buffer, "Incoming"));
        }
      });
    }

    send(data) {
      if (data instanceof ArrayBuffer) {
        logMessageDetails(data, "Outgoing");
        super.send(data);
      } else {
        super.send(data);
      }
    }
  }

  // Apply the override after 1 second.
  setTimeout(() => {
    window.WebSocket = CustomWebSocket;
    console.log("[CustomWebSocket] Override Applied");
  }, 1000);
})();
