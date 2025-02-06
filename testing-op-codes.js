// ==UserScript==
// @name         Agar.io Ultimate WebSocket Inspector
// @namespace    http://secure-scripts.com
// @version      5.0
// @description  Advanced WebSocket monitoring with full error resolution
// @author       Your Name
// @match        *://agar.io/*
// @grant        none
// @run-at       document-start
// @noframes
// ==/UserScript==

(function() {
    'use strict';

    // Configuration - Toggle features here
    const CONFIG = {
        DEBUG_MODE: true,
        MAX_RETRIES: 3,
        BACKOFF_BASE: 2000,
        ALLOWED_DOMAINS: [
            'wss://live.agar.io',
            'wss://mca.agar.io',
            'wss://delta.agar.io',
            'https://deltav4.gitlab.io'
        ]
    };

    // 1. Security Policy Setup
    const applySecurityPolicy = () => {
        // Remove existing CSP headers
        document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]').forEach(tag => tag.remove());

        // Set comprehensive CSP
        const csp = document.createElement('meta');
        csp.httpEquiv = "Content-Security-Policy";
        csp.content = [
            `default-src 'self' agar.io *.agar.io`,
            `connect-src ${CONFIG.ALLOWED_DOMAINS.join(' ')}`,
            `img-src 'self' data: blob: https://*.gitlab.io https://i.imgur.com`,
            `script-src 'self' 'unsafe-inline' ${CONFIG.ALLOWED_DOMAINS.join(' ')}`,
            `style-src 'self' 'unsafe-inline'`,
            `manifest-src 'self' https://deltav4.gitlab.io`,
            `frame-src https://accounts.google.com`
        ].join('; ');
        document.head.prepend(csp);
    };

    // 2. WebSocket Interception Core
    const installWebSocketHandler = () => {
        const script = document.createElement('script');
        script.textContent = `
            (function() {
                const OriginalWebSocket = window.WebSocket;
                const MAX_RETRIES = ${CONFIG.MAX_RETRIES};
                const BACKOFF_BASE = ${CONFIG.BACKOFF_BASE};

                class WSInterceptor {
                    constructor(url) {
                        this.url = url;
                        this.retryCount = 0;
                        this.initSocket();
                    }

                    initSocket() {
                        this.ws = new OriginalWebSocket(this.url);
                        this.bindEvents();
                    }

                    bindEvents() {
                        this.ws.addEventListener('open', () => this.handleOpen());
                        this.ws.addEventListener('message', e => this.handleMessage(e));
                        this.ws.addEventListener('close', e => this.handleClose(e));
                        this.ws.addEventListener('error', e => this.handleError(e));
                        
                        const originalSend = this.ws.send.bind(this.ws);
                        this.ws.send = data => {
                            this.logData('OUTGOING', data);
                            originalSend(data);
                        };
                    }

                    logData(direction, data) {
                        try {
                            const processor = data instanceof Blob ? 
                                this.processBlob : 
                                data instanceof ArrayBuffer ?
                                this.processBuffer :
                                this.processText;
                            
                            processor.call(this, direction, data);
                        } catch (error) {
                            this.logError('Data Processing', error);
                        }
                    }

                    processBlob(direction, blob) {
                        blob.arrayBuffer().then(buf => {
                            this.logBinary(direction, buf);
                            this.analyzeProtocol(buf);
                        }).catch(e => this.logError('Blob Processing', e));
                    }

                    processBuffer(direction, buffer) {
                        this.logBinary(direction, buffer);
                        this.analyzeProtocol(buffer);
                    }

                    processText(direction, text) {
                        CONFIG.DEBUG_MODE && console.log(\`[\${direction}] Text:\`, text);
                    }

                    logBinary(direction, buffer) {
                        const hexString = Array.from(new Uint8Array(buffer), 
                            byte => byte.toString(16).padStart(2, '0').toUpperCase()
                        ).join(' ');
                        
                        CONFIG.DEBUG_MODE && console.log(
                            \`[\${direction}] Binary:\${hexString.slice(0, 60)}\${hexString.length > 60 ? '...' : ''}\`
                        );
                    }

                    analyzeProtocol(buffer) {
                        const view = new DataView(buffer);
                        if (view.byteLength < 2) return;
                        
                        this.messageId = view.getUint8(0);
                        this.protocolVersion = view.getUint8(1);
                        
                        CONFIG.DEBUG_MODE && console.log(
                            \`[PROTOCOL] ID: 0x\${this.messageId.toString(16).padStart(2, '0')} ` +
                            \`v\${this.protocolVersion}\`
                        );
                    }

                    handleOpen() {
                        this.retryCount = 0;
                        CONFIG.DEBUG_MODE && console.log(\`[CONNECTED] \${this.url}\`);
                    }

                    handleMessage(event) {
                        this.logData('INCOMING', event.data);
                    }

                    handleClose(event) {
                        CONFIG.DEBUG_MODE && console.warn(
                            \`[CLOSED] \${event.code} - \${event.reason || 'No reason provided'}\`
                        );
                        
                        if (event.code !== 1000 && this.retryCount < MAX_RETRIES) {
                            const delay = BACKOFF_BASE * Math.pow(2, this.retryCount);
                            setTimeout(() => this.initSocket(), delay);
                            this.retryCount++;
                        }
                    }

                    handleError(error) {
                        this.logError('WebSocket', error);
                    }

                    logError(context, error) {
                        console.error(\`[ERROR] \${context}:\`, {
                            name: error.name,
                            message: error.message,
                            stack: error.stack
                        });
                    }
                }

                window.WebSocket = function(url) {
                    return CONFIG.ALLOWED_DOMAINS.some(d => url.startsWith(d)) ?
                        (CONFIG.DEBUG_MODE && console.log(\`[INTERCEPTING] \${url}\`),
                        new WSInterceptor(url).ws) :
                        new OriginalWebSocket(url);
                };
            })();
        `;
        document.documentElement.appendChild(script);
    };

    // 3. Meta Tag Management
    const updateMetaTags = () => {
        // Remove deprecated apple meta tag
        document.querySelector('meta[name="apple-mobile-web-app-capable"]')?.remove();
        
        // Add modern equivalent
        const mobileMeta = document.createElement('meta');
        mobileMeta.name = 'mobile-web-app-capable';
        mobileMeta.content = 'yes';
        document.head.appendChild(mobileMeta);
    };

    // 4. Resource Loader
    const handleExternalResources = () => {
        document.addEventListener('DOMContentLoaded', () => {
            // Secure image loading
            document.querySelectorAll('img').forEach(img => {
                img.crossOrigin = 'anonymous';
                img.referrerPolicy = 'no-referrer';
            });

            // Safe dynamic script loading
            const loadScript = (src) => new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });

            // Load required external scripts
            CONFIG.ALLOWED_DOMAINS
                .filter(d => d.startsWith('https://'))
                .forEach(domain => {
                    loadScript(\`\${domain}/required-script.js\`)
                        .catch(e => console.error(\`Failed to load \${domain} script:\`, e));
                });
        });
    };

    // Main Initialization Flow
    (function init() {
        applySecurityPolicy();
        updateMetaTags();
        handleExternalResources();
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', installWebSocketHandler);
        } else {
            installWebSocketHandler();
        }
    })();
})();
