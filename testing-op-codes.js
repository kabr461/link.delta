// ==UserScript==
// @name         Agar.io Ultimate Mod v7.0
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
                'wss://*.agar.io',
                'wss://*.miniclippt.com',
                'wss://delta.agar.io'
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

    // 1. Security Policy Management
    const configureSecurity = () => {
        // Remove existing CSP
        document.querySelectorAll('meta[http-equiv]').forEach(tag => tag.remove());

        // Build new CSP
        const csp = document.createElement('meta');
        csp.httpEquiv = "Content-Security-Policy";
        csp.content = [
            `default-src 'self' agar.io`,
            `connect-src ${CONFIG.DOMAINS.CONNECT.join(' ')}`,
            `script-src 'self' 'unsafe-inline' ${CONFIG.DOMAINS.SCRIPT.join(' ')}`,
            `style-src 'self' 'unsafe-inline'`,
            `img-src 'self' data: blob: ${CONFIG.DOMAINS.IMG.join(' ')}`,
            `manifest-src 'self'`,
            `frame-src https://accounts.google.com`,
            `report-uri https://agar.io/csp-report`
        ].join('; ');
        document.head.prepend(csp);
    };

    // 2. WebSocket Management System
    class WSManager {
        static init() {
            this.originalWS = window.WebSocket;
            window.WebSocket = this.createWrappedWS();
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

    // 3. Wave Effect System
    class WaveRenderer {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.waves = [];
            this.originalDraw = this.ctx.draw;
            this.init();
        }

        init() {
            this.canvas.addEventListener('click', e => this.createWave(e));
            this.ctx.draw = (...args) => {
                this.originalDraw.apply(this.ctx, args);
                this.renderWaves();
            };
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

    // 4. Main Initialization
    const initialize = () => {
        // Security Configuration
        configureSecurity();

        // Update meta tags
        document.querySelector('meta[name="apple-mobile-web-app-capable"]')?.remove();
        const mobileMeta = document.createElement('meta');
        mobileMeta.name = 'mobile-web-app-capable';
        mobileMeta.content = 'yes';
        document.head.appendChild(mobileMeta);

        // Initialize systems
        WSManager.init();

        // Wait for game canvas
        const canvasObserver = new MutationObserver((_, observer) => {
            const canvas = document.querySelector('canvas');
            if (canvas) {
                observer.disconnect();
                new WaveRenderer(canvas);
                CONFIG.DEBUG && console.log('[SYSTEM] All components initialized');
            }
        });
        canvasObserver.observe(document.body, { childList: true, subtree: true });
    };

    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
