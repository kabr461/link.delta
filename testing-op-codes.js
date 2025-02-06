// ==UserScript==
// @name         Agar.io Ultimate Fix with Waves
// @namespace    http://secure-scripts.com
// @version      10.0
// @description  Complete error resolution with wave effects and WebSocket fixes
// @author       Your Name
// @match        *://agar.io/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // 1. Enhanced CSP Configuration
    const applySecurityPolicy = () => {
        const csp = document.createElement('meta');
        csp.httpEquiv = "Content-Security-Policy";
        csp.content = [
            "default-src 'self' agar.io *.agar.io",
            "style-src 'self' 'unsafe-inline' https://deltav4.gitlab.io",
            "script-src 'self' 'unsafe-inline' https://deltav4.gitlab.io https://www.gstatic.com",
            "connect-src 'self' ws: wss: *.agar.io *.miniclippt.com",
            "img-src 'self' data: blob: https://*.gitlab.io i.imgur.com",
            "manifest-src 'self' https://deltav4.gitlab.io",
            "frame-src https://accounts.google.com",
            "worker-src 'self' blob:"
        ].join('; ');
        document.head.prepend(csp);
    };

    // 2. WebSocket Manager with Fallback
    class WebSocketManager {
        constructor() {
            this.socket = null;
            this.retries = 0;
            this.endpoints = [
                'wss://live.agar.io',
                'wss://mca.agar.io',
                'wss://delta.agar.io'
            ];
            this.connect();
        }

        connect() {
            const endpoint = this.endpoints[this.retries % this.endpoints.length];
            try {
                this.socket = new WebSocket(endpoint);
                this.setupEventHandlers();
            } catch (error) {
                this.handleError(error);
            }
        }

        setupEventHandlers() {
            this.socket.onopen = () => {
                console.log('[WS] Connected to', this.socket.url);
                this.retries = 0;
            };

            this.socket.onerror = (error) => {
                console.error('[WS] Error:', error);
                this.reconnect();
            };

            this.socket.onclose = (event) => {
                if (event.code !== 1000) this.reconnect();
            };
        }

        reconnect() {
            if (this.retries < 3) {
                setTimeout(() => {
                    this.retries++;
                    this.connect();
                }, 2000 * this.retries);
            }
        }

        handleError(error) {
            console.error('[WS] Connection error:', error);
            this.reconnect();
        }
    }

    // 3. Wave Effect System
    class WaveEffect {
        constructor() {
            this.canvas = null;
            this.ctx = null;
            this.waves = [];
            this.observeCanvas();
        }

        observeCanvas() {
            const observer = new MutationObserver(() => {
                const canvas = document.querySelector('canvas');
                if (canvas && !this.canvas) {
                    this.initializeCanvas(canvas);
                    observer.disconnect();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }

        initializeCanvas(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.setupEventListeners();
            this.animationLoop();
        }

        setupEventListeners() {
            this.canvas.addEventListener('click', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                this.createWave(
                    e.clientX - rect.left,
                    e.clientY - rect.top
                );
            });
        }

        createWave(x, y) {
            this.waves.push({
                x,
                y,
                radius: 0,
                opacity: 1,
                color: [0, 191, 255, 0.3] // Blue wave
            });
        }

        animationLoop() {
            const animate = () => {
                this.drawWaves();
                requestAnimationFrame(animate);
            };
            animate();
        }

        drawWaves() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.waves = this.waves.filter(wave => {
                wave.radius += 4;
                wave.opacity -= 0.02;
                
                this.ctx.beginPath();
                this.ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
                this.ctx.strokeStyle = `rgba(${wave.color.join(',')})`;
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
                
                return wave.radius < 150 && wave.opacity > 0;
            });
        }
    }

    // 4. Main Initialization
    (function main() {
        // Apply security policy first
        applySecurityPolicy();

        // Update deprecated meta tags
        const oldMeta = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
        if (oldMeta) oldMeta.remove();
        
        const newMeta = document.createElement('meta');
        newMeta.name = 'mobile-web-app-capable';
        newMeta.content = 'yes';
        document.head.appendChild(newMeta);

        // Initialize systems
        new WebSocketManager();
        new WaveEffect();

        // Safe external resource loading
        const loadResources = () => {
            const manifest = document.createElement('link');
            manifest.rel = 'manifest';
            manifest.href = 'https://deltav4.gitlab.io/v7/manifest.webmanifest';
            document.head.appendChild(manifest);

            const gstaticScript = document.createElement('script');
            gstaticScript.src = 'https://www.gstatic.com/_/mss/boq-identity/_/js/k=boq-identity.IdpIFrameHttp.en_US.VL4JSFaL1zk.es5.O/am=DAY/d=1/rs=AOaEmlG4sNaE1qrZLhoZw7_RR3UL0-ecBw/m=base';
            document.head.appendChild(gstaticScript);
        };

        // Load resources after DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', loadResources);
        } else {
            loadResources();
        }
    })();
})();
