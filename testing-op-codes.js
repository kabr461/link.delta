// ==UserScript==
// @name         Agar.io Enhanced with Waves & WebSocket Monitor
// @namespace    http://secure-scripts.com
// @version      6.1
// @description  WebSocket monitoring & visual wave effects in Agar.io
// @author       Your Name
// @match        *://agar.io/*
// @grant        none
// @run-at       document-start
// @noframes
// ==/UserScript==

(function () {
    'use strict';

    /** Configuration **/
    const CONFIG = {
        DEBUG_MODE: true,
        MAX_RETRIES: 3,
        BACKOFF_BASE: 2000,
        ALLOWED_DOMAINS: [
            'wss://live.agar.io',
            'wss://mca.agar.io',
            'wss://delta.agar.io',
            'https://deltav4.gitlab.io'
        ],

        WAVE: {
            MAX_RADIUS: 150,
            WAVE_SPEED: 6,
            LINE_WIDTH: 3,
            STROKE_STYLE: 'rgba(0, 200, 255, 0.3)',
            FADE_RATE: 0.015
        }
    };

    /** Content Security Policy Fix **/
    function applySecurityPolicy() {
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
    }

    /** WebSocket Interceptor **/
    function installWebSocketHandler() {
        const script = document.createElement('script');
        script.textContent = `(${(() => {
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

                handleOpen() {
                    console.log('[WS] Connected to:', this.url);
                    this.retryCount = 0;
                }

                handleMessage(event) {
                    console.log('[WS] Message:', event.data);
                }

                handleClose(event) {
                    console.log(`[WS] Closed: ${event.reason} (Code: ${event.code})`);
                    if (this.retryCount < MAX_RETRIES) {
                        setTimeout(() => {
                            this.retryCount++;
                            console.log(`[WS] Retrying ${this.retryCount}/${MAX_RETRIES}...`);
                            this.initSocket();
                        }, BACKOFF_BASE * this.retryCount);
                    }
                }

                handleError(event) {
                    console.error('[WS] Error:', event);
                }

                logData(direction, data) {
                    console.log(`[WS] ${direction} Data:`, data);
                }
            }

            window.WebSocket = function (url) {
                return ${JSON.stringify(CONFIG.ALLOWED_DOMAINS)}.some(d => url.startsWith(d))
                    ? new WSInterceptor(url).ws
                    : new OriginalWebSocket(url);
            };
        }).toString()})();`;

        document.documentElement.appendChild(script);
    }

    /** Wave Effect System **/
    class WaveEffect {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.waves = [];
            this.init();
        }

        init() {
            this.canvas.addEventListener('click', (e) => this.createWave(e));
            requestAnimationFrame(() => this.animate());
        }

        createWave(e) {
            const rect = this.canvas.getBoundingClientRect();
            this.waves.push({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                radius: 0,
                opacity: 1
            });
        }

        drawWaves() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.waves = this.waves.filter(wave => {
                wave.radius += CONFIG.WAVE.WAVE_SPEED;
                wave.opacity -= CONFIG.WAVE.FADE_RATE;

                this.ctx.beginPath();
                this.ctx.arc(wave.x, wave.y, wave.radius, 0, 2 * Math.PI);
                this.ctx.lineWidth = CONFIG.WAVE.LINE_WIDTH;
                this.ctx.strokeStyle = `rgba(0, 200, 255, ${wave.opacity})`;
                this.ctx.stroke();

                return wave.opacity > 0;
            });
        }

        animate() {
            this.drawWaves();
            requestAnimationFrame(() => this.animate());
        }
    }

    /** Initialize Wave System **/
    function initWaveSystem() {
        const canvasObserver = new MutationObserver(() => {
            const canvas = document.querySelector('canvas');
            if (canvas) {
                canvasObserver.disconnect();
                new WaveEffect(canvas);
            }
        });

        canvasObserver.observe(document.body, { childList: true, subtree: true });
    }

    /** Update Meta Tags **/
    function updateMetaTags() {
        document.querySelector('meta[name="apple-mobile-web-app-capable"]')?.remove();
        const mobileMeta = document.createElement('meta');
        mobileMeta.name = 'mobile-web-app-capable';
        mobileMeta.content = 'yes';
        document.head.appendChild(mobileMeta);
    }

    /** Main Execution **/
    (function main() {
        applySecurityPolicy();
        updateMetaTags();

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
