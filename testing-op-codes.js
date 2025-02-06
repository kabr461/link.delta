// ==UserScript==
// @name         Agar.io Enhanced with Waves & WebSocket Monitor
// @namespace    http://secure-scripts.com
// @version      6.0
// @description  Combined WebSocket monitoring and visual wave effects
// @author       Your Name
// @match        *://agar.io/*
// @grant        none
// @run-at       document-start
// @noframes
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
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
            STROKE_STYLE: 'rgba(0, 200, 255, 0.3)',
            FADE_RATE: 0.015
        }
    };

    /* ================= WebSocket Interceptor ================= */
    const applySecurityPolicy = () => {
        document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]').forEach(tag => tag.remove());
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

                    // ... (rest of WebSocket interceptor code from previous version)
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

    /* ================= Wave Effect System ================= */
    class WaveEffect {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.waves = [];
            this.originalDraw = this.ctx.draw;
            this.init();
        }

        init() {
            this.canvas.addEventListener('click', (e) => this.createWave(e));
            this.ctx.draw = (...args) => {
                this.originalDraw.apply(this.ctx, args);
                this.drawWaves();
            };
            this.animate();
        }

        createWave(e) {
            const rect = this.canvas.getBoundingClientRect();
            this.waves.push({
                position: {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                },
                radius: 0,
                opacity: 1
            });
        }

        drawWaves() {
            this.waves = this.waves.filter(wave => {
                wave.radius += CONFIG.WAVE.WAVE_SPEED;
                wave.opacity -= CONFIG.WAVE.FADE_RATE;

                this.ctx.beginPath();
                this.ctx.arc(
                    wave.position.x,
                    wave.position.y,
                    wave.radius,
                    0,
                    2 * Math.PI
                );
                this.ctx.lineWidth = CONFIG.WAVE.LINE_WIDTH;
                this.ctx.strokeStyle = this.getWaveColor(wave.opacity);
                this.ctx.stroke();

                return wave.radius < CONFIG.WAVE.MAX_RADIUS && wave.opacity > 0;
            });
        }

        getWaveColor(opacity) {
            return \`rgba(\${CONFIG.WAVE.STROKE_STYLE.slice(5, -1)}, \${opacity})\`;
        }

        animate() {
            const animateFrame = () => {
                requestAnimationFrame(animateFrame);
                this.drawWaves();
            };
            animateFrame();
        }
    }

    /* ================= Main Initialization ================= */
    const initWaveSystem = () => {
        const canvasObserver = new MutationObserver((mutations) => {
            const canvas = document.querySelector('canvas');
            if (canvas) {
                canvasObserver.disconnect();
                new WaveEffect(canvas);
            }
        });

        canvasObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    };

    const updateMetaTags = () => {
        document.querySelector('meta[name="apple-mobile-web-app-capable"]')?.remove();
        const mobileMeta = document.createElement('meta');
        mobileMeta.name = 'mobile-web-app-capable';
        mobileMeta.content = 'yes';
        document.head.appendChild(mobileMeta);
    };

    (function main() {
        applySecurityPolicy();
        updateMetaTags();
        
        // Initialize WebSocket interceptor
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                installWebSocketHandler();
                initWaveSystem();
            });
        } else {
            installWebSocketHandler();
            initWaveSystem();
        }
    })();
})();
