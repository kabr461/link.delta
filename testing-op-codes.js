// ==UserScript==
// @name         Agar.io Enhanced with Waves & WebSocket Monitor
// @namespace    http://secure-scripts.com
// @version      6.7
// @description  Enhanced Agar.io script with robust wave effect on click, WebSocket monitoring, and improved error handling.
// @author       
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
        // Remove any existing CSP meta tags.
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
        if (CONFIG.DEBUG_MODE) {
            console.log("✅ [CSP] Content Security Policy applied.");
        }
    }

    /** 2. Update Meta Tags for Mobile Compatibility **/
    function updateMetaTags() {
        // Remove deprecated tag if present.
        document.querySelector('meta[name="apple-mobile-web-app-capable"]')?.remove();
        const mobileMeta = document.createElement('meta');
        mobileMeta.name = 'mobile-web-app-capable';
        mobileMeta.content = 'yes';
        document.head.appendChild(mobileMeta);
        if (CONFIG.DEBUG_MODE) {
            console.log("✅ [Meta] Mobile meta tag updated.");
        }
    }

    /** 3. WebSocket Interceptor (Auto-Reconnect & Debug) **/
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
                    this.ws.addEventListener('message', event => {
                        console.log('[WS] Message:', event.data);
                    });
                    this.ws.addEventListener('close', () => {
                        console.log(\`[WS] Connection closed. Retrying \${this.retryCount + 1}...\`);
                        if (this.retryCount < MAX_RETRIES) {
                            setTimeout(() => {
                                this.retryCount++;
                                this.initSocket();
                            }, BACKOFF_BASE * this.retryCount);
                        }
                    });
                }
            }
            window.WebSocket = function (url) {
                if (${JSON.stringify(CONFIG.ALLOWED_DOMAINS)}.some(d => url.startsWith(d))) {
                    return new WSInterceptor(url).ws;
                } else {
                    return new OriginalWebSocket(url);
                }
            };
        }).toString()})();`;
        document.documentElement.appendChild(script);
        if (CONFIG.DEBUG_MODE) {
            console.log("✅ [WS] WebSocket interceptor installed.");
        }
    }

    /** 4. Wave Effect System with Robust Handling and Detailed Logging **/
    function setupWaveEffect() {
        // Prevent multiple overlay creations.
        if (document.getElementById('wave-overlay')) {
            console.log("✅ [Wave System] Overlay canvas already exists.");
            return;
        }
        
        // Try to locate the game canvas.
        let gameCanvas = document.querySelector('canvas');
        if (!gameCanvas) {
            console.warn("⚠️ [Wave System] Game canvas not found. Proceeding to create overlay regardless.");
        } else {
            if (CONFIG.DEBUG_MODE) {
                console.log("✅ [Wave System] Game canvas detected.");
            }
        }
        
        // Create an overlay canvas that covers the entire viewport.
        const overlayCanvas = document.createElement('canvas');
        overlayCanvas.id = 'wave-overlay';
        overlayCanvas.style.position = 'absolute';
        overlayCanvas.style.left = '0';
        overlayCanvas.style.top = '0';
        overlayCanvas.style.pointerEvents = 'none'; // Let clicks pass through.
        overlayCanvas.style.zIndex = '9999'; // Ensure it stays on top.
        document.body.appendChild(overlayCanvas);
        
        // Set the overlay to cover the entire viewport.
        function resizeCanvas() {
            overlayCanvas.width = window.innerWidth;
            overlayCanvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        const ctx = overlayCanvas.getContext('2d');
        let waves = [];

        // Attach click listener at document level to ensure all clicks are captured.
        document.addEventListener('click', (event) => {
            // Use the overlay's bounding rect if available.
            const rect = overlayCanvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            console.log(`🖱️ [Click Detected] at (${x}, ${y})`);
            
            // Add a new wave object.
            waves.push({ x, y, radius: 0, opacity: 1 });
            
            // After a short delay, check if a wave is in the array.
            setTimeout(() => {
                if (waves.length === 0) {
                    console.warn("⚠️ [Wave System] Wave was NOT generated after click!");
                } else {
                    console.log("🌊 [Wave Generated] Wave successfully added.");
                }
            }, 100);
        });

        // Animation loop: update and draw all waves.
        function animateWaves() {
            try {
                ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
                waves = waves.filter(wave => {
                    // Increase radius and decrease opacity.
                    wave.radius += CONFIG.WAVE.WAVE_SPEED;
                    wave.opacity -= CONFIG.WAVE.FADE_RATE;
                    ctx.beginPath();
                    ctx.arc(wave.x, wave.y, wave.radius, 0, 2 * Math.PI);
                    ctx.lineWidth = CONFIG.WAVE.LINE_WIDTH;
                    ctx.strokeStyle = `rgba(0, 200, 255, ${wave.opacity})`;
                    ctx.stroke();
                    return wave.opacity > 0;
                });
            } catch (e) {
                console.error("❌ [Wave System] Error during animation:", e);
            }
            requestAnimationFrame(animateWaves);
        }
        animateWaves();
        console.log("✅ [Wave System] Overlay and wave system initialized successfully.");
    }

    /** 5. Initialize the Wave System Once the Game Canvas Appears or after a Fallback Timeout **/
    function initWaveSystem() {
        const observer = new MutationObserver(() => {
            if (document.querySelector('canvas')) {
                observer.disconnect();
                setupWaveEffect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // Fallback: if canvas is not found within 5 seconds, create the overlay anyway.
        setTimeout(() => {
            if (!document.getElementById('wave-overlay')) {
                console.warn("⚠️ [Wave System] Fallback: No game canvas detected after 5 seconds, creating overlay anyway.");
                setupWaveEffect();
            }
        }, 5000);
    }

    /** 6. Main Execution **/
    (function main() {
        applySecurityPolicy();
        updateMetaTags();
        installWebSocketHandler();

        // Start the wave system.
        initWaveSystem();
    })();
})();
