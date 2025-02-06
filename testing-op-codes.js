// ==UserScript==
// @name         Secure Agar.io WebSocket Inspector
// @namespace    http://secure-scripts.com
// @version      3.1
// @description  CSP-compliant WebSocket monitoring
// @author       Your Name
// @match        *://agar.io/*
// @grant        none
// @run-at       document-start
// @noframes
// ==/UserScript==

(function() {
    'use strict';

    console.log("[🔒] Initializing Security-Compliant Inspector...");

    const safeInject = () => {
        const interceptScript = document.createElement('script');
        interceptScript.textContent = `
            (function() {
                const originalWS = window.WebSocket;
                const allowedEndpoints = [
                    'wss://live.agar.io/',
                    'wss://mca.agar.io/',
                    'wss://delta.agar.io/'
                ];

                const hexConverter = arr => Array.from(arr, 
                    byte => byte.toString(16).padStart(2, '0').toUpperCase()
                ).join(' ');

                class MessageParser {
                    static analyze(data) {
                        if (data.length < 1) return;
                        const msgId = data[0];
                        console.log(\`[📨] Message ID: 0x\${msgId.toString(16).padStart(2, '0')}\`);
                        // Add protocol-specific parsing here
                    }
                }

                class WSHandler {
                    constructor(url, protocols) {
                        this.socket = new originalWS(url, protocols);
                        this.url = url;
                        this.retries = 0;
                        this.setupHandlers();
                    }

                    setupHandlers() {
                        this.socket.addEventListener('message', this.handleMessage.bind(this));
                        this.socket.addEventListener('open', this.handleOpen.bind(this));
                        this.socket.addEventListener('close', this.handleClose.bind(this));
                        this.socket.addEventListener('error', this.handleError.bind(this));
                        
                        const originalSend = this.socket.send.bind(this.socket);
                        this.socket.send = data => {
                            this.logSend(data);
                            originalSend(data);
                        };
                    }

                    logSend(data) {
                        try {
                            if (data instanceof Blob) {
                                data.arrayBuffer().then(buf => {
                                    const arr = new Uint8Array(buf);
                                    console.log(\`[📤] Outgoing (Blob): \${hexConverter(arr)}\`);
                                    MessageParser.analyze(arr);
                                });
                            } else if (data instanceof ArrayBuffer) {
                                const arr = new Uint8Array(data);
                                console.log(\`[📤] Outgoing (Buffer): \${hexConverter(arr)}\`);
                                MessageParser.analyze(arr);
                            } else {
                                console.log(\`[📤] Outgoing: \${typeof data}:\`, data);
                            }
                        } catch (e) {
                            console.error('[⚠️] Send Log Error:', e);
                        }
                    }

                    handleMessage(event) {
                        const data = event.data;
                        if (typeof data === 'string') {
                            console.log(\`[📩] Incoming String: \${data}\`);
                        } else {
                            data.arrayBuffer().then(buf => {
                                const arr = new Uint8Array(buf);
                                console.log(\`[📩] Incoming Binary: \${hexConverter(arr)}\`);
                                MessageParser.analyze(arr);
                            }).catch(console.error);
                        }
                    }

                    handleOpen() {
                        console.log(\`[✅] Connected to \${this.url}\`);
                        this.retries = 0;
                    }

                    handleClose(event) {
                        console.warn(\`[❌] Closed: \${event.code} \${event.reason}\`);
                        if (event.code !== 1000 && this.retries < 3) {
                            setTimeout(() => new WSHandler(this.url), 2000);
                            this.retries++;
                        }
                    }

                    handleError(error) {
                        console.error('[⚠️] WebSocket Error:', error);
                    }
                }

                window.WebSocket = function(url, protocols) {
                    if (!allowedEndpoints.some(e => url.startsWith(e))) {
                        return new originalWS(url, protocols);
                    }
                    console.log(\`[🔗] Monitoring \${url}\`);
                    return new WSHandler(url, protocols).socket;
                };

                console.log('[🛡️] WebSocket Inspector Active!');
            })();
        `;
        document.documentElement.appendChild(interceptScript);
    };

    // Safe injection with CSP compliance
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            safeInject();
            enhanceSecurity();
        });
    } else {
        safeInject();
        enhanceSecurity();
    }

    function enhanceSecurity() {
        // Remove conflicting CSP headers
        const metaTags = document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]');
        metaTags.forEach(tag => tag.remove());

        // Add permissive CSP for extension resources (adjust as needed)
        const cspMeta = document.createElement('meta');
        cspMeta.httpEquiv = "Content-Security-Policy";
        cspMeta.content = [
            "default-src 'self' agar.io *.agar.io",
            "connect-src 'self' ws: wss: *.agar.io",
            "img-src 'self' data: blob: *.gitlab.io i.imgur.com",
            "script-src 'self' 'unsafe-inline'",
            "style-src 'self' 'unsafe-inline'",
            "manifest-src 'self'"
        ].join('; ');
        document.head.appendChild(cspMeta);
    }

    // Fix external resource loading
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('img').forEach(img => {
            if (!img.hasAttribute('crossOrigin')) {
                img.crossOrigin = 'anonymous';
            }
        });
    });
})();
