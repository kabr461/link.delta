// ==UserScript==
// @name         Agar.io Ultimate Mod v7.0 (Fixed)
// @namespace    http://secure-scripts.com
// @version      7.0
// @description  Complete solution with error resolution and enhanced monitoring
// @author       Your Name
// @match        *://agar.io/*
// @grant        none
// @run-at       document-start
// @noframes
// ==/UserScript==

(function() {
    'use strict';

    // Enhanced Configuration
    const CONFIG = {
        DEBUG: true,
        MAX_RETRIES: 5,
        BACKOFF_BASE: 3000,
        DOMAINS: {
            CONNECT: [
                'wss://live-arena.agar.io',
                'wss://miniclip.agar.io'
            ],
            SCRIPT: [
                'https://deltav4.gitlab.io',
                'https://kabr461.github.io'
            ],
            IMG: [
                'https://*.gitlab.io',
                'https://i.imgur.com'
            ]
        },
        WAVE: {
            MAX_RADIUS: 200,
            SPEED: 8,
            WIDTH: 3,
            COLOR: 'rgba(100, 200, 255, 0.4)',
            FADE: 0.02
        }
    };

    // 1. Content Security Policy Fix
    const configureSecurity = () => {
        document.querySelectorAll('meta[http-equiv]').forEach(tag => tag.remove());

        const csp = document.createElement('meta');
        csp.httpEquiv = "Content-Security-Policy";
        csp.content = `
            default-src 'self' agar.io;
            connect-src 'self' ${CONFIG.DOMAINS.CONNECT.join(' ')};
            script-src 'self' 'unsafe-inline' 'unsafe-eval' ${CONFIG.DOMAINS.SCRIPT.join(' ')};
            style-src 'self' 'unsafe-inline' ${CONFIG.DOMAINS.SCRIPT.join(' ')};
            img-src 'self' data: blob: ${CONFIG.DOMAINS.IMG.join(' ')};
            worker-src 'self' blob:;
            manifest-src 'self' ${CONFIG.DOMAINS.SCRIPT.join(' ')};
            frame-src https://accounts.google.com;
            report-uri https://agar.io/csp-report;
        `;
        document.head.prepend(csp);
    };

    // 2. WebSocket Fix
    class WSManager {
        static init() {
            this.originalWS = window.WebSocket;
            window.WebSocket = this.createWrappedWS();
        }

        static createWrappedWS() {
            return class CustomWS {
                constructor(url, protocols) {
                    if (!url.startsWith('wss://')) {
                        console.error(`[WS ERROR] Invalid URL: ${url}`);
                        return;
                    }
                    this.url = url;
                    this.protocols = protocols;
                    this.instance = null;
                    this.retries = 0;
                    this.connect();
                }

                connect() {
                    this.instance = new WSManager.originalWS(this.url, this.protocols);
                    this.configureListeners();
                }

                configureListeners() {
                    this.instance.addEventListener('open', () => this.handleOpen());
                    this.instance.addEventListener('message', e => this.handleMessage(e));
                    this.instance.addEventListener('close', e => this.handleClose(e));
                    this.instance.addEventListener('error', e => this.handleError(e));
                }

                handleOpen() {
                    CONFIG.DEBUG && console.log(`[WS OPEN] ${this.url}`);
                    this.retries = 0;
                }

                handleMessage(event) {
                    this.processData('IN', event.data);
                }

                handleClose(event) {
                    CONFIG.DEBUG && console.warn(`[WS CLOSE] ${event.code} ${event.reason}`);
                    if (this.retries < CONFIG.MAX_RETRIES) {
                        setTimeout(() => this.reconnect(), CONFIG.BACKOFF_BASE * Math.pow(2, this.retries));
                        this.retries++;
                    }
                }

                handleError(error) {
                    console.error(`[WS ERROR] ${error.message}`);
                }

                processData(direction, data) {
                    const processor = data instanceof Blob ?
                        this.processBlob :
                        data.arrayBuffer ?
                        this.processBuffer :
                        this.processText;

                    processor.call(this, direction, data);
                }

                processBlob(direction, blob) {
                    blob.arrayBuffer().then(buf => this.analyzeData(direction, new Uint8Array(buf)));
                }

                processBuffer(direction, buffer) {
                    this.analyzeData(direction, new Uint8Array(buffer));
                }

                processText(direction, text) {
                    CONFIG.DEBUG && console.log(`[WS ${direction}] ${text.slice(0, 100)}`);
                }

                analyzeData(direction, uintArray) {
                    const header = Array.from(uintArray.slice(0, 4),
                        b => b.toString(16).padStart(2, '0')).join(' ');
                    CONFIG.DEBUG && console.log(`[WS ${direction}] Header: ${header}`);
                }

                send(data) {
                    this.processData('OUT', data);
                    this.instance.send(data);
                }

                reconnect() {
                    this.instance = null;
                    this.connect();
                }
            };
        }
    }

    // 3. Fixing Worker Security Issue
    const createWorker = () => {
        const workerScript = `
            onmessage = function(event) {
                postMessage("Worker received: " + event.data);
            };
        `;
        const blob = new Blob([workerScript], { type: 'application/javascript' });
        return new Worker(URL.createObjectURL(blob));
    };
    const myWorker = createWorker();
    myWorker.postMessage("Hello Worker");

    // 4. Fixing jQuery and PropTypes Undefined Issues
    (function waitForDependencies() {
        if (!window.jQuery) {
            let script = document.createElement('script');
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js";
            script.onload = () => console.log("jQuery loaded");
            document.head.appendChild(script);
        }

        window.PropTypes = window.PropTypes || {};
    })();

    // 5. Initialize Everything
    const initialize = () => {
        configureSecurity();
        WSManager.init();

        const canvasObserver = new MutationObserver((_, observer) => {
            const canvas = document.querySelector('canvas');
            if (canvas) {
                observer.disconnect();
                console.log('[SYSTEM] All components initialized');
            }
        });
        canvasObserver.observe(document.body, { childList: true, subtree: true });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
