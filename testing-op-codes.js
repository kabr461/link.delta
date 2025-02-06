// ==UserScript==
// @name         WebSocket Interceptor for Agar.io
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Intercepts and logs WebSocket messages for Agar.io, including binary data parsing
// @author       Your Name
// @match        *://agar.io/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log("[🔍] Injecting Advanced WebSocket Interceptor...");

    const script = document.createElement("script");
    script.textContent = `
        (function() {
            const originalWebSocket = window.WebSocket;
            const interceptedUrls = ['agar.io']; // WebSocket URLs to intercept

            function bytesToHex(uint8Array) {
                return Array.from(uint8Array, byte =>
                    byte.toString(16).padStart(2, '0').toUpperCase()
                ).join(' ');
            }

            function parseMessage(data) {
                if (data.length === 0) return;
                const messageId = data[0];
                console.log(\`[🔑] Incoming Message ID: 0x\${messageId.toString(16).padStart(2, '0').toUpperCase()}\`);
                // Extend this function based on observed protocol structure
            }

            window.WebSocket = function(url, protocols) {
                if (!interceptedUrls.some(u => url.includes(u))) {
                    return new originalWebSocket(url, protocols);
                }

                console.log(\`[🌐] Intercepting WebSocket: \${url}\`);

                const socket = new originalWebSocket(url, protocols);

                // Intercept outgoing messages
                const originalSend = socket.send.bind(socket);
                socket.send = function(data) {
                    if (data instanceof Blob) {
                        const reader = new FileReader();
                        reader.onload = () => {
                            const arr = new Uint8Array(reader.result);
                            console.log(\`[📤] Outgoing Binary (Blob): \${bytesToHex(arr)}\`);
                            parseMessage(arr);
                        };
                        reader.readAsArrayBuffer(data);
                    } else if (data instanceof ArrayBuffer) {
                        const arr = new Uint8Array(data);
                        console.log(\`[📤] Outgoing Binary (ArrayBuffer): \${bytesToHex(arr)}\`);
                        parseMessage(arr);
                    } else {
                        console.log(\`[📤] Outgoing String: \${data}\`);
                    }
                    originalSend.call(this, data);
                };

                // Intercept incoming messages
                socket.addEventListener('message', function(event) {
                    const data = event.data;

                    if (typeof data === 'string') {
                        console.log(\`[📩] Incoming String: \${data}\`);
                    } else {
                        if (data instanceof ArrayBuffer) {
                            const arr = new Uint8Array(data);
                            console.log(\`[📩] Incoming Binary (ArrayBuffer): \${bytesToHex(arr)}\`);
                            parseMessage(arr);
                        } else {
                            data.arrayBuffer().then(buffer => {
                                const arr = new Uint8Array(buffer);
                                console.log(\`[📩] Incoming Binary (Blob): \${bytesToHex(arr)}\`);
                                parseMessage(arr);
                            }).catch(console.error);
                        }
                    }
                });

                socket.addEventListener('open', (event) => {
                    console.log(\`[✅] WebSocket Connected: \${event.target.url}\`);
                });

                socket.addEventListener('close', (event) => {
                    console.warn(\`[❌] WebSocket Closed: \${event.code} \${event.reason}\`);
                });

                socket.addEventListener('error', (event) => {
                    console.error(\`[⚠️] WebSocket Error: \`, event);
                });

                return socket;
            };

            console.log('[🛠️] Advanced WebSocket Interceptor Installed!');
        })();
    `;

    document.documentElement.appendChild(script);
})();
