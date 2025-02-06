// ==UserScript==
// @name         Agar.io WebSocket Inspector v4.0
// @namespace    http://secure-scripts.com
// @version      4.0
// @description  CSP-compliant WebSocket monitoring with error resolution
// @author       Your Name
// @match        *://agar.io/*
// @grant        none
// @run-at       document-start
// @noframes
// ==/UserScript==

(function() {
    'use strict';

    console.log("[🔐] Initializing Advanced Inspector...");

    const applySecurityPolicy = () => {
        // Remove existing conflicting CSP headers
        document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]').forEach(tag => tag.remove());

        // Set comprehensive CSP
        const csp = document.createElement('meta');
        csp.httpEquiv = "Content-Security-Policy";
        csp.content = [
            "default-src 'self' agar.io *.agar.io",
            "connect-src 'self' ws: wss: *.agar.io wss://delta.agar.io",
            "img-src 'self' data: blob: https://*.gitlab.io https://i.imgur.com",
            "script-src 'self' 'unsafe-inline' https://deltav4.gitlab.io https://kabr461.github.io",
            "style-src 'self' 'unsafe-inline' https://deltav4.gitlab.io",
            "manifest-src 'self' https://deltav4.gitlab.io",
            "frame-src https://accounts.google.com"
        ].join('; ');
        document.head.prepend(csp);
    };

    const installWebSocketHandler = () => {
        const script = document.createElement('script');
        script.textContent = `
            (function() {
                const OriginalWebSocket = window.WebSocket;
                const monitoredEndpoints = [
                    'wss://live.agar.io/',
                    'wss://mca.agar.io/',
                    'wss://delta.agar.io/'
                ];

                const bufferToHex = buffer => Array.from(new Uint8Array(buffer), 
                    byte => byte.toString(16).padStart(2, '0').toUpperCase()
                ).join(' ');

                class WSMonitor {
                    constructor(url) {
                        this.ws = new OriginalWebSocket(url);
                        this.url = url;
                        this.retryCount = 0;
                        this.bindEvents();
                    }

                    bindEvents() {
                        this.ws.addEventListener('open', () => this.onOpen());
                        this.ws.addEventListener('message', e => this.onMessage(e));
                        this.ws.addEventListener('close', e => this.onClose(e));
                        this.ws.addEventListener('error', e => this.onError(e));
                        
                        const originalSend = this.ws.send.bind(this.ws);
                        this.ws.send = data => {
                            this.logData('📤 Outgoing', data);
                            originalSend(data);
                        };
                    }

                    logData(direction, data) {
                        try {
                            if (data instanceof Blob) {
                                data.arrayBuffer().then(buf => {
                                    console.log(\`\${direction} Blob:\`, bufferToHex(buf));
                                    this.parseProtocol(buf);
                                });
                            } else if (data instanceof ArrayBuffer) {
                                console.log(\`\${direction} Buffer:\`, bufferToHex(data));
                                this.parseProtocol(data);
                            } else {
                                console.log(\`\${direction} Text:\`, data);
                            }
                        } catch (error) {
                            console.error('[⚠️] Logging Error:', error);
                        }
                    }

                    parseProtocol(buffer) {
                        const view = new DataView(buffer);
                        if (view.byteLength < 2) return;
                        
                        const messageId = view.getUint8(0);
                        const protocolVersion = view.getUint8(1);
                        console.log(\`[🔍] Message ID: 0x\${messageId.toString(16)} Version: \${protocolVersion}\`);
                    }

                    onOpen() {
                        console.log(\`[✅] Connected to \${this.url}\`);
                        this.retryCount = 0;
                    }

                    onMessage(event) {
                        this.logData('📩 Incoming', event.data);
                    }

                    onClose(event) {
                        console.warn(\`[❌] Connection closed (\${event.code}): \${event.reason}\`);
                        if (event.code !== 1000 && this.retryCount < 3) {
                            setTimeout(() => new WSMonitor(this.url), 2000 * (this.retryCount + 1));
                            this.retryCount++;
                        }
                    }

                    onError(error) {
                        console.error('[⚠️] WebSocket Error:', error);
                    }
                }

                window.WebSocket = function(url) {
                    if (!monitoredEndpoints.some(e => url.startsWith(e))) {
                        return new OriginalWebSocket(url);
                    }
                    console.log(\`[🔗] Monitoring WebSocket: \${url}\`);
                    return new WSMonitor(url).ws;
                };
            })();
        `;
        document.documentElement.appendChild(script);
    };

    // Fix deprecated meta tags
    const updateMetaTags = () => {
        const newMeta = document.createElement('meta');
        newMeta.name = 'mobile-web-app-capable';
        newMeta.content = 'yes';
        document.head.appendChild(newMeta);
    };

    // Initialize with proper sequencing
    (function init() {
        applySecurityPolicy();
        updateMetaTags();
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', installWebSocketHandler);
        } else {
            installWebSocketHandler();
        }

        // Handle external resources
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('img').forEach(img => {
                img.crossOrigin = 'anonymous';
                img.referrerPolicy = 'no-referrer';
            });
        });
    })();
})();
