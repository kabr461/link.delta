// ==UserScript==
// @name         Agar.io Enhanced with Waves & WebSocket Monitor
// @namespace    http://secure-scripts.com
// @version      6.6
// @description  WebSocket monitoring & visual wave effects in Agar.io with detailed click logging.
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
        MAX_RETRIES: 5,
        BACKOFF_BASE: 2000,
        ALLOWED_DOMAINS: [
            'wss://live.agar.io',
            'wss://mca.agar.io',
            'wss://delta.agar.io',
            'https://deltav4.gitlab.io'
        ],
        WAVE: {
            MAX_RADIUS: 120,
            WAVE_SPEED: 3,
            LINE_WIDTH: 2,
            STROKE_STYLE: 'rgba(0, 200, 255, 0.5)',
            FADE_RATE: 0.02
        }
    };

    /** 1. Content Security Policy Fix **/
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

    /** 2. WebSocket Interceptor (Auto-Reconnect & Debug) **/
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
                    this.ws.addEventListener('open', () => {
                        console.log("[WS] Connected to:", this.url);
                        this.retryCount = 0;
                    });
                    this.ws.addEventListener('message', event => console.log('[WS] Message:', event.data));
                    this.ws.addEventListener('close', () => this.handleClose());
                }

                handleClose() {
                    console.log(\`[WS] Connection closed. Retrying \${this.retryCount + 1}...\`);
                    if (this.retryCount < MAX_RETRIES) {
                        setTimeout(() => {
                            this.retryCount++;
                            this.initSocket();
                        }, BACKOFF_BASE * this.retryCount);
                    }
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

    /** 3. Wave Effect System with Detailed Click Logging **/
    function setupWaveEffect() {
        if (document.getElementById('wave-overlay')) {
            console.log("✅ [Wave System] Overlay canvas already exists.");
            return;
        }

        // Attempt to get the game canvas.
        const gameCanvas = document.querySelector('canvas');
        if (!gameCanvas) {
            console.error("❌ [Wave System] Game canvas not found! Waves will NOT work.");
            return;
        }

        // Create an overlay canvas covering the entire viewport.
        const overlayCanvas = document.createElement('canvas');
        overlayCanvas.id = 'wave-overlay';
        overlayCanvas.style.position = 'absolute';
        overlayCanvas.style.left = '0';
        overlayCanvas.style.top = '0';
        overlayCanvas.style.pointerEvents = 'none'; // So clicks pass through.
        overlayCanvas.style.zIndex = '9999'; // High z-index ensures visibility.
        document.body.appendChild(overlayCanvas);

        // Size the overlay to cover the full window.
        function resizeCanvas() {
            overlayCanvas.width = window.innerWidth;
            overlayCanvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const ctx = overlayCanvas.getContext('2d');
        let waves = [];

        // Attach click listener to the document (captures all clicks).
        document.addEventListener('click', (event) => {
            const rect = overlayCanvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            console.log(`🖱️ [Click Detected] at (${x}, ${y})`);

            // Add a new wave.
            waves.push({ x, y, radius: 0, opacity: 1 });

            // Verify wave generation after a short delay.
            setTimeout(() => {
                if (waves.length === 0) {
                    console.warn("⚠️ [Wave System] Wave was NOT generated after click!");
                } else {
                    console.log("🌊 [Wave Generated] Successfully added wave.");
                }
            }, 100);
        });

        // Animation loop: clears and redraws waves.
        function animateWaves() {
            ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
            waves = waves.filter(wave => {
                wave.radius += CONFIG.WAVE.WAVE_SPEED;
                wave.opacity -= CONFIG.WAVE.FADE_RATE;
                ctx.beginPath();
                ctx.arc(wave.x, wave.y, wave.radius, 0, 2 * Math.PI);
                ctx.lineWidth = CONFIG.WAVE.LINE_WIDTH;
                ctx.strokeStyle = `rgba(0, 200, 255, ${wave.opacity})`;
                ctx.stroke();
                return wave.opacity > 0;
            });
            requestAnimationFrame(animateWaves);
        }
        animateWaves();
        console.log("✅ [Wave System] Initialized successfully.");
    }

    /** 4. MutationObserver to Initialize Wave System Once the Game Canvas Appears **/
    const observer = new MutationObserver(() => {
        if (document.querySelector('canvas')) {
            observer.disconnect();
            setupWaveEffect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    /** 5. Update Meta Tags for Mobile Compatibility **/
    function updateMetaTags() {
        document.querySelector('meta[name="apple-mobile-web-app-capable"]')?.remove();
        const mobileMeta = document.createElement('meta');
        mobileMeta.name = 'mobile-web-app-capable';
        mobileMeta.content = 'yes';
        document.head.appendChild(mobileMeta);
    }

    /** Main Execution: Run CSP update, meta tag update, and WebSocket handler setup. **/
    (function main() {
        applySecurityPolicy();
        updateMetaTags();
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                installWebSocketHandler();
            });
        } else {
            installWebSocketHandler();
        }
    })();
})();
