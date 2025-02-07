// ==UserScript==
// @name         Agar.io Ultimate Mod v7.0 (Comprehensive Fix)
// @namespace    http://secure-scripts.com
// @version      7.0.2
// @description  A comprehensive mod for Agar.io with fixes for CSP issues, missing dependencies, and worker errors.
// @author       Your Name
// @match        *://agar.io/*
// @grant        none
// @run-at       document-start
// @noframes
// ==/UserScript==

(function() {
    'use strict';

    /* -------------------------------------------------------------------------
       1. Patch Worker to handle data: URLs 
       (Some external scripts try to create workers using inline code; this patch
       converts such “data:” URLs into Blob URLs so that they are allowed to run.)
    -------------------------------------------------------------------------- */
    (function() {
        const OriginalWorker = window.Worker;
        window.Worker = function(script, options) {
            if (typeof script === 'string' && script.startsWith('data:')) {
                try {
                    const commaIndex = script.indexOf(',');
                    const blobContent = decodeURIComponent(script.substring(commaIndex+1));
                    const blob = new Blob([blobContent], { type: 'application/javascript' });
                    const blobUrl = URL.createObjectURL(blob);
                    return new OriginalWorker(blobUrl, options);
                } catch (e) {
                    console.error('Worker patch error:', e);
                }
            }
            return new OriginalWorker(script, options);
        };
    })();

    /* -------------------------------------------------------------------------
       2. Define System.import Polyfill 
       (Some external scripts call System.import; we define it to use dynamic import.)
    -------------------------------------------------------------------------- */
    if (!window.System) {
        window.System = {
            import: src => import(src)
        };
    }

    /* -------------------------------------------------------------------------
       3. Configure a Very Permissive Content Security Policy (CSP)
       (This meta tag is added to allow external scripts, styles, images, and workers.
       It makes the site much less restrictive so that the mod’s resources can load.)
    -------------------------------------------------------------------------- */
    const configureSecurity = () => {
        // Remove any existing CSP meta tags.
        document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]').forEach(tag => tag.remove());
        // Very permissive CSP (Note: This reduces security.)
        const cspContent = "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; " +
                           "script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; " +
                           "style-src * 'unsafe-inline' data: blob:; " +
                           "img-src * data: blob:; " +
                           "connect-src *; " +
                           "manifest-src *; " +
                           "worker-src * blob:; " +
                           "frame-src *;";
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Security-Policy';
        meta.content = cspContent;
        document.head.prepend(meta);
        console.log("[CSP] Configured permissively:", cspContent);
    };

    /* -------------------------------------------------------------------------
       4. Utility to Load External Scripts
       (Used to load libraries like jQuery and Preact from trusted CDNs.)
    -------------------------------------------------------------------------- */
    const loadScript = (src, callback) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = callback || function(){ console.log(`Loaded: ${src}`); };
        script.onerror = () => console.error("Failed to load script:", src);
        document.head.appendChild(script);
    };

    /* -------------------------------------------------------------------------
       5. Load External Dependencies: jQuery and Preact
       (Some external code expects jQuery (the $ variable) or Preact to be available.)
    -------------------------------------------------------------------------- */
    const loadDependencies = () => {
        if (typeof window.jQuery === 'undefined') {
            loadScript('https://code.jquery.com/jquery-3.6.0.min.js', () => {
                console.log("jQuery loaded");
            });
        }
        if (typeof window.preact === 'undefined') {
            loadScript('https://unpkg.com/preact@latest/dist/preact.min.js', () => {
                console.log("Preact loaded");
            });
        }
    };

    /* -------------------------------------------------------------------------
       6. Main Mod Functionality
       (This includes a wrapped WebSocket manager and a simple wave effect on the game canvas.)
    -------------------------------------------------------------------------- */
    const CONFIG = {
        DEBUG: true,
        MAX_RETRIES: 5,
        BACKOFF_BASE: 3000,
        DOMAINS: {
            CONNECT: [
                'wss://*.agar.io',
                'wss://*.miniclippt.com'
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

    // WSManager: Wraps and monitors WebSocket connections.
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

    // WaveRenderer: Adds a simple “wave” effect on the game’s canvas when you click.
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

    /* -------------------------------------------------------------------------
       7. Main Initialization
       (This sets up the CSP, loads dependencies, patches WebSocket, and waits for
       the game canvas so that the wave effect can be applied.)
    -------------------------------------------------------------------------- */
    const initialize = () => {
        configureSecurity();
        loadDependencies();

        // Remove deprecated mobile meta tag and add the updated one.
        document.querySelector('meta[name="apple-mobile-web-app-capable"]')?.remove();
        const mobileMeta = document.createElement('meta');
        mobileMeta.name = 'mobile-web-app-capable';
        mobileMeta.content = 'yes';
        document.head.appendChild(mobileMeta);

        WSManager.init();

        // Wait until the game canvas appears, then add the wave effect.
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
