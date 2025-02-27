(function() {
    'use strict';

    console.log("Delta test script loaded: Injecting hooks.");

    // Dummy Delta module functions for testing.
    // Replace these with the actual Delta module functions if available.
    window.Delta = window.Delta || {
        // Simulate decryption and decompression: here we assume the data is base64-encoded JSON.
        processIncoming: function(data) {
            try {
                // If data is an ArrayBuffer, convert it to a string.
                if (data instanceof ArrayBuffer) {
                    data = new TextDecoder("utf-8").decode(data);
                }
                let decoded = atob(data);
                return JSON.parse(decoded);
            } catch(e) {
                console.error("Delta.processIncoming error:", e);
                return data;
            }
        },
        // Simulate encryption and compression: JSON stringify then base64-encode.
        prepareOutgoing: function(obj) {
            try {
                let str = JSON.stringify(obj);
                return btoa(str);
            } catch(e) {
                console.error("Delta.prepareOutgoing error:", e);
                return obj;
            }
        }
    };

    // Override WebSocket send to intercept outgoing messages.
    const originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function(data) {
        console.log("Original outgoing data:", data);
        try {
            // Assume data is a JSON string that we want to encrypt/compress.
            const parsed = JSON.parse(data);
            const processed = Delta.prepareOutgoing(parsed);
            console.log("Processed outgoing data (encrypted, compressed):", processed);
            return originalSend.call(this, processed);
        } catch(e) {
            console.error("Error processing outgoing data:", e);
            return originalSend.call(this, data);
        }
    };

    // Override WebSocket onmessage by patching addEventListener.
    const originalAddEventListener = WebSocket.prototype.addEventListener;
    WebSocket.prototype.addEventListener = function(type, listener, options) {
        if (type === 'message') {
            const patchedListener = function(event) {
                console.log("Raw incoming data:", event.data);
                const processedData = Delta.processIncoming(event.data);
                console.log("Processed incoming data (decrypted, decompressed):", processedData);
                // Attach processed data to event for further downstream use.
                event.processedData = processedData;
                listener.call(this, event);
            };
            originalAddEventListener.call(this, type, patchedListener, options);
        } else {
            originalAddEventListener.call(this, type, listener, options);
        }
    };

    // Additionally, override the onmessage property.
    Object.defineProperty(WebSocket.prototype, "onmessage", {
        set: function(handler) {
            this._onmessage = function(event) {
                console.log("Intercepted onmessage raw data:", event.data);
                const processedData = Delta.processIncoming(event.data);
                console.log("Intercepted onmessage processed data:", processedData);
                event.processedData = processedData;
                handler(event);
            };
        },
        get: function() {
            return this._onmessage;
        },
        configurable: true
    });

    console.log("Delta hooks injected. Waiting for WebSocket messages...");

    // For testing purposes, you can simulate sending a message after 5 seconds.
    // Remove this block if not needed.
    setTimeout(() => {
        // Create a test WebSocket connection to echo server.
        const wsTest = new WebSocket('wss://echo.websocket.org');
        wsTest.addEventListener('open', () => {
            console.log("Test WebSocket connected.");
            // Prepare a sample outgoing message (plain data).
            const sampleData = { type: 'playerUpdate', players: [{ name: "TestPlayer", skinUrl: "http://example.com/skin.png", tag: "TAG" }] };
            // Send as plain JSON string.
            wsTest.send(JSON.stringify(sampleData));
        });
        wsTest.addEventListener('message', (event) => {
            console.log("Echoed back message:", event.processedData || event.data);
        });
    }, 5000);

})();
