// ==UserScript==
// @name         Agar.io Enhanced with Waves & WebSocket Monitor
// @namespace    http://secure-scripts.com
// @version      6.1
// @description  Combined WebSocket monitoring and visual wave effects with improved overlay handling
// @author       
// @match        *://agar.io/*
// @grant        none
// @run-at       document-start
// @noframes
// ==/UserScript==

(function() {
    'use strict';

    // Configuration Object
    const CONFIG = {
        // WebSocket Config
        DEBUG_MODE: true,
        MAX_RETRIES: 3,
        BACKOFF_BASE: 2000,
        ALLOWED_DOMAINS: [
            'wss://live.agar.io',
            'wss://mca.agar.io',
            'wss://delta.agar.io',
            'https://deltav4.gitlab.io'
        ],
        // Wave Effect Config
        WAVE: {
            MAX_RADIUS: 150,
            WAVE_SPEED: 6,
            LINE_WIDTH: 3,
            // We use the beginning of an rgba string and later append the opacity value and a closing parenthesis.
            STROKE_STYLE: 'rgba(0,200,255',
            FADE_RATE: 0.015
        }
    };

    /* ================= Custom Content Security Policy ================= */
    function applySecurityPolicy() {
        // Remove any existing CSP meta tags
        document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]').forEach(tag => tag.remove());
        // Create a new CSP meta tag with allowed sources
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
    }

    /* ================= WebSocket Interceptor Injection ================= */
    function installWebSocketHandler() {
        const script = document.createElement('script');
        // The injected script uses inlined configuration values so that it runs independently.
        script.textContent = `
            (function() {
                const OriginalWebSocket = window.WebSocket;
                const MAX_RETRIES = ${CONFIG.MAX_RETRIES};
                const BACKOFF_BASE = ${CONFIG.BACKOFF_BASE};
                const DEBUG_MODE = ${CONFIG.DEBUG_MODE};
                const ALLOWED_DOMAINS = ${JSON.stringify(CONFIG.ALLOWED_DOMAINS)};
                
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
                        
                        // Wrap the send function to log outgoing messages.
                        const originalSend = this.ws.send.bind(this.ws);
                        this.ws.send = data => {
                            if (DEBUG_MODE) console.log('[WS OUTGOING]', data);
                            originalSend(data);
                        };
                    }
                    handleOpen() {
                        if (DEBUG_MODE) console.log('[WS OPEN]', this.url);
                    }
                    handleMessage(e) {
                        if (DEBUG_MODE) console.log('[WS MESSAGE]', e.data);
                    }
                    handleClose(e) {
                        if (DEBUG_MODE) console.log('[WS CLOSE]', this.url, e);
                    }
                    handleError(e) {
                        if (DEBUG_MODE) console.error('[WS ERROR]', this.url, e);
                    }
                }
                
                // Override the native WebSocket constructor for allowed domains.
                window.WebSocket = function(url, protocols) {
                    if (ALLOWED_DOMAINS.some(d => url.startsWith(d))) {
                        if (DEBUG_MODE) console.log('[INTERCEPTING]', url);
                        return new WSInterceptor(url).ws;
                    }
                    return new OriginalWebSocket(url, protocols);
                };
            })();
        `;
        document.documentElement.appendChild(script);
    }

    /* ================= Meta Tag Update for Mobile Compatibility ================= */
    function updateMetaTags() {
        // Remove deprecated Apple meta tag if present
        document.querySelector('meta[name="apple-mobile-web-app-capable"]')?.remove();
        // Add the modern mobile-web-app-capable meta tag
        const mobileMeta = document.createElement('meta');
        mobileMeta.name = 'mobile-web-app-capable';
        mobileMeta.content = 'yes';
        document.head.appendChild(mobileMeta);
    }

    /* ================= Wave Effect System ================= */
    class WaveEffect {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.waves = [];
            this.resize();
            window.addEventListener('resize', () => this.resize());
            this.animate();
        }
        // Ensure the canvas always fills the viewport.
        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
        // Create a new wave at the given (x, y) coordinates.
        createWave(x, y) {
            this.waves.push({
                x: x,
                y: y,
                radius: 0,
                opacity: 1
            });
        }
        // Clear and redraw all active waves.
        drawWaves() {
            const ctx = this.ctx;
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.waves = this.waves.filter(wave => {
                wave.radius += CONFIG.WAVE.WAVE_SPEED;
                wave.opacity -= CONFIG.WAVE.FADE_RATE;
                if (wave.opacity <= 0) return false;
                ctx.beginPath();
                ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
                ctx.lineWidth = CONFIG.WAVE.LINE_WIDTH;
                ctx.strokeStyle = \`\${CONFIG.WAVE.STROKE_STYLE},\${wave.opacity})\`;
                ctx.stroke();
                return wave.radius < CONFIG.WAVE.MAX_RADIUS;
            });
        }
        // Animate the wave effect continuously.
        animate() {
            this.drawWaves();
            requestAnimationFrame(() => this.animate());
        }
    }

    // Create an overlay canvas for wave effects and attach a click listener.
    function initWaveSystem() {
        const waveCanvas = document.createElement('canvas');
        waveCanvas.id = 'waveCanvas';
        waveCanvas.style.position = 'fixed';
        waveCanvas.style.top = '0';
        waveCanvas.style.left = '0';
        waveCanvas.style.width = '100%';
        waveCanvas.style.height = '100%';
        // Set a high z-index so the waves are visible, yet allow clicks to pass to the underlying page.
        waveCanvas.style.zIndex = '9999';
        // Allow mouse events to pass through the canvas so the game isn’t blocked.
        waveCanvas.style.pointerEvents = 'none';
        document.body.appendChild(waveCanvas);

        // Instantiate the wave effect system.
        const waveEffect = new WaveEffect(waveCanvas);
        // Listen for clicks on the document (the overlay canvas does not capture events)
        document.addEventListener('click', (e) => {
            waveEffect.createWave(e.clientX, e.clientY);
        });
    }

    /* ================= Main Initialization ================= */
    function main() {
        applySecurityPolicy();
        updateMetaTags();
        installWebSocketHandler();
        initWaveSystem();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();
