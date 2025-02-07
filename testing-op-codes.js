// ==UserScript==
// @name         Agar.io Ultimate Mod v7.0 (Fixed)
// @namespace    http://secure-scripts.com
// @version      7.0.1
// @description  Fixed version with CSP and dependency fixes
// @author       Your Name
// @match        *://agar.io/*
// @grant        none
// @run-at       document-start
// @noframes
// ==/UserScript==

(function() {
    'use strict';

    // ===== Configuration =====
    const CONFIG = {
        DEBUG: true,
        MAX_RETRIES: 5,
        BACKOFF_BASE: 3000,
        DOMAINS: {
            CONNECT: [
                'wss://*.agar.io',
                'wss://*.miniclippt.com'
                // Removed 'wss://delta.agar.io' to avoid 404 errors.
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

    // ===== Security Policy Management =====
    const configureSecurity = () => {
        // Remove any existing CSP meta tags
        document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]').forEach(tag => tag.remove());

        // Build a new CSP meta tag with extra allowances for inline scripts, eval, and blob workers.
        const csp = document.createElement('meta');
        csp.httpEquiv = "Content-Security-Policy";
        csp.content = `
            default-src 'self' agar.io;
            connect-src 'self' ${CONFIG.DOMAINS.CONNECT.join(' ')};
            script-src 'self' 'unsafe-inline' 'unsafe-eval' ${CONFIG.DOMAINS.SCRIPT.join(' ')};
            style-src 'self' 'unsafe-inline';
            img-src 'self' data: blob: ${CONFIG.DOMAINS.IMG.join(' ')};
            worker-src 'self' blob:;
            manifest-src 'self';
            frame-src https://accounts.google.com;
        `.replace(/\s{2,}/g, ' ').trim();
        document.head.prepend(csp);
        if (CONFIG.DEBUG) console.log("[CSP] Configured:", csp.content);
    };

    // ===== WebSocket Management System =====
    class WSManager {
        static init() {
            this.originalWS = window.WebSocket;
            window.WebSocket = this.createWrappedWS();
            if (CONFIG.DEBUG) console.log("[WSManager] Wrapped WebSocket initialized");
        }

        static createWrappedWS() {
            return class CustomWS {
                constructor(url, protocols) {
                    this.url = url;
                    this.protocols = protocols;
                    this.instance = null;
                    this.retries = 0;
                    this.connect();
                }

                connect() {
                    try {
                        this.instance = new WSManager.originalWS(this.url, this.protocols);
                        this.configureListeners();
                    } catch (err) {
                        console.error("[WS ERROR] Connection error:", err);
                    }
                }

                configureListeners() {
                    this.instance.addEventListener('open', () => this.handleOpen());
                    this.instance.addEventListener('message', e => this.handleMessage(e));
                    this.instance.addEventListener('close', e => this.handleClose(e));
                    this.instance.addEventListener('error', e => this.handleError(e));
                }

                handleOpen() {
                    if (CONFIG.DEBUG) console.log(`[WS OPEN] ${this.url}`);
                    this.retries = 0;
                }

                handleMessage(event) {
                    this.processData('IN', event.data);
                }

                handleClose(event) {
                    if (CONFIG.DEBUG) console.warn(`[WS CLOSE] ${event.code} ${event.reason}`);
                    if (this.retries < CONFIG.MAX_RETRIES) {
                        setTimeout(() => this.reconnect(), CONFIG.BACKOFF_BASE * Math.pow(2, this.retries));
                        this.retries++;
                    }
                }

                handleError(error) {
                    console.error("[WS ERROR]", error);
                }

                processData(direction, data) {
                    if (data instanceof Blob) {
                        this.processBlob(direction, data);
                    } else if (data instanceof ArrayBuffer) {
                        this.processBuffer(direction, data);
                    } else if (typeof data === 'string') {
                        this.processText(direction, data);
                    } else {
                        if (CONFIG.DEBUG) console.log(`[WS ${direction}] Unknown data type`);
                    }
                }

                processBlob(direction, blob) {
                    blob.arrayBuffer().then(buf => this.analyzeData(direction, new Uint8Array(buf)));
                }

                processBuffer(direction, buffer) {
                    this.analyzeData(direction, new Uint8Array(buffer));
                }

                processText(direction, text) {
                    if (CONFIG.DEBUG) console.log(`[WS ${direction}] ${text.slice(0, 100)}`);
                }

                analyzeData(direction, uintArray) {
                    const header = Array.from(uintArray.slice(0, 4), b => b.toString(16).padStart(2, '0')).join(' ');
                    if (CONFIG.DEBUG) console.log(`[WS ${direction}] Header: ${header}`);
                }

                send(data) {
                    this.processData('OUT', data);
                    this.instance.send(data);
                }

                reconnect() {
                    if (CONFIG.DEBUG) console.log(`[WS] Reconnecting: ${this.url}`);
                    this.connect();
                }
            };
        }
    }

    // ===== Wave Effect System =====
    class WaveRenderer {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.waves = [];
            this.init();
        }

        init() {
            this.canvas.addEventListener('click', e => this.createWave(e));
            this.startAnimation();
        }

        createWave(event) {
            const rect = this.canvas.getBoundingClientRect();
            this.waves.push({
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
                radius: 0,
                opacity: 1
            });
        }

        renderWaves() {
            this.waves = this.waves.filter(wave => {
                wave.radius += CONFIG.WAVE.SPEED;
                wave.opacity -= CONFIG.WAVE.FADE;
                
                this.ctx.beginPath();
                this.ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
                this.ctx.strokeStyle = this.getWaveStyle(wave.opacity);
                this.ctx.lineWidth = CONFIG.WAVE.WIDTH;
                this.ctx.stroke();
                
                return wave.radius < CONFIG.WAVE.MAX_RADIUS && wave.opacity > 0;
            });
        }

        getWaveStyle(opacity) {
            return CONFIG.WAVE.COLOR.replace('0.4', opacity.toFixed(2));
        }

        startAnimation() {
            const animate = () => {
                this.renderWaves();
                requestAnimationFrame(animate);
            };
            animate();
        }
    }

    // ===== Load jQuery (if needed) =====
    const loadjQuery = () => {
        if (!window.jQuery) {
            const script = document.createElement('script');
            script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
            script.integrity = 'sha256-/xUj+3OJ+Yh8iY/6Nr3GH3InVQJ6lE/5ODJln+1XECY=';
            script.crossOrigin = 'anonymous';
            document.head.appendChild(script);
            if (CONFIG.DEBUG) console.log("[jQuery] Loading jQuery...");
        }
    };

    // ===== Dummy Globals for External Scripts =====
    if (typeof window.PropTypes === 'undefined') window.PropTypes = {};
    if (typeof window.System === 'undefined') window.System = {};

    // ===== Main Initialization =====
    const initialize = () => {
        configureSecurity();

        // Remove the deprecated apple-mobile-web-app-capable meta tag and add the updated one.
        document.querySelector('meta[name="apple-mobile-web-app-capable"]')?.remove();
        const mobileMeta = document.createElement('meta');
        mobileMeta.name = 'mobile-web-app-capable';
        mobileMeta.content = 'yes';
        document.head.appendChild(mobileMeta);

        WSManager.init();
        loadjQuery();

        // Wait for the game canvas to appear, then add the wave effect.
        const canvasObserver = new MutationObserver((mutations, observer) => {
            const canvas = document.querySelector('canvas');
            if (canvas) {
                observer.disconnect();
                new WaveRenderer(canvas);
                if (CONFIG.DEBUG) console.log("[SYSTEM] All components initialized");
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
