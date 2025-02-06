// ==UserScript==
// @name         Advanced WebSocket Interceptor for Agar.io
// @namespace    http://secure-scripts.com
// @version      3.0
// @description  Safe WebSocket monitoring with error handling and CSP compliance
// @author       Your Name
// @match        *://agar.io/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    console.log("[🔒] Initializing Secure WebSocket Interceptor...");

    const injectInterceptor = () => {
        const script = document.createElement('script');
        script.textContent = `
            (function() {
                const originalWebSocket = window.WebSocket;
                const interceptedUrls = [
                    'wss://live.agar.io/',
                    'wss://mca.agar.io/',
                    'wss://delta.agar.io/'
                ];

                function bytesToHex(uint8Array) {
                    return Array.from(uint8Array, byte => 
                        byte.toString(16).padStart(2, '0').toUpperCase()
                    ).join(' ');
                }

                function parseMessage(data) {
                    if (data.length === 0) return;
                    const messageId = data[0];
                    console.log(\`[🔑] Message ID: 0x\${messageId.toString(16).padStart(2, '0')}\`);
                    // Add protocol parsing logic here
                }

                function createSafeWebSocket(url, protocols) {
                    const socket = new originalWebSocket(url, protocols);
                    let isConnected = false;
                    let reconnectAttempts = 0;

                    const reconnect = () => {
                        if (reconnectAttempts < 3) {
                            console.log(\`[🔄] Reconnecting (attempt \${reconnectAttempts + 1})\`);
                            setTimeout(() => {
                                createSafeWebSocket(url, protocols);
                                reconnectAttempts++;
                            }, 2000);
                        }
                    };

                    // Intercept outgoing messages
                    const originalSend = socket.send.bind(socket);
                    socket.send = function(data) {
                        try {
                            if (data instanceof Blob) {
                                data.arrayBuffer().then(buffer => {
                                    const arr = new Uint8Array(buffer);
                                    console.log(\`[📤] Outgoing Blob: \${bytesToHex(arr)}\`);
                                    parseMessage(arr);
                                });
                            } else if (data instanceof ArrayBuffer) {
                                const arr = new Uint8Array(data);
                                console.log(\`[📤] Outgoing ArrayBuffer: \${bytesToHex(arr)}\`);
                                parseMessage(arr);
                            } else {
                                console.log(\`[📤] Outgoing String: \${data}\`);
                            }
                        } catch (error) {
                            console.error('[⚠️] Send Error:', error);
                        }
                        originalSend(data);
                    };

                    // Message handling
                    socket.addEventListener('message', event => {
                        try {
                            const data = event.data;
                            if (typeof data === 'string') {
                                console.log(\`[📩] Incoming String: \${data}\`);
                            } else {
                                data.arrayBuffer().then(buffer => {
                                    const arr = new Uint8Array(buffer);
                                    console.log(\`[📩] Incoming Binary: \${bytesToHex(arr)}\`);
                                    parseMessage(arr);
                                }).catch(console.error);
                            }
                        } catch (error) {
                            console.error('[⚠️] Message Error:', error);
                        }
                    });

                    // Connection management
                    socket.addEventListener('open', () => {
                        isConnected = true;
                        reconnectAttempts = 0;
                        console.log(\`[✅] Connected to \${url}\`);
                    });

                    socket.addEventListener('close', event => {
                        isConnected = false;
                        console.warn(\`[❌] Connection closed: \${event.code} \${event.reason}\`);
                        if (!event.wasClean) reconnect();
                    });

                    socket.addEventListener('error', error => {
                        console.error('[⚠️] WebSocket Error:', error);
                        if (!isConnected) reconnect();
                    });

                    return socket;
                }

                window.WebSocket = function(url, protocols) {
                    if (!interceptedUrls.some(u => url.startsWith(u))) {
                        return new originalWebSocket(url, protocols);
                    }
                    console.log(\`[🔗] Intercepting WebSocket: \${url}\`);
                    return createSafeWebSocket(url, protocols);
                };

                console.log('[🛡️] Secure WebSocket Interceptor Active!');
            })();
        `;
        document.documentElement.appendChild(script);
    };

    // Safe injection handling
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectInterceptor);
    } else {
        injectInterceptor();
    }

    // CSP meta tag handling
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = "Content-Security-Policy";
    cspMeta.content = "default-src 'self' agar.io ws: wss:; script-src 'unsafe-inline'";
    document.head.appendChild(cspMeta);

    // Image loading fix
    document.addEventListener('DOMContentLoaded', () => {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.crossOrigin = 'anonymous';
            img.referrerPolicy = 'no-referrer';
        });
    });
})();
