// ==UserScript==
// @name         Agar.io Enhanced with Click Debugging & Wave Effects
// @namespace    http://secure-scripts.com
// @version      6.6
// @description  Click Debugging, Wave Effects, WebSocket Monitoring for Agar.io
// @author       Your Name
// @match        *://agar.io/*
// @grant        none
// @run-at       document-start
// @noframes
// ==/UserScript==

(function () {
    'use strict';

    console.log("🚀 [Agar.io Enhanced] Script loaded successfully.");

    /** ✅ WebSocket Monitoring & Auto-Reconnect **/
    function installWebSocketHandler() {
        console.log("🔍 [WebSocket Monitor] Initializing...");
        
        const script = document.createElement('script');
        script.textContent = `(${(() => {
            const OriginalWebSocket = window.WebSocket;
            
            class WSInterceptor {
                constructor(url) {
                    this.url = url;
                    this.retryCount = 0;
                    console.log("🔗 [WS] Attempting connection to:", url);
                    this.initSocket();
                }

                initSocket() {
                    this.ws = new OriginalWebSocket(this.url);
                    this.bindEvents();
                }

                bindEvents() {
                    this.ws.addEventListener('open', () => {
                        console.log("✅ [WS] Connected to:", this.url);
                        this.retryCount = 0;
                    });

                    this.ws.addEventListener('message', event => {
                        console.log("📩 [WS] Message received:", event.data);
                    });

                    this.ws.addEventListener('close', () => {
                        console.log("❌ [WS] Connection closed. Retrying...");
                        this.handleClose();
                    });
                }

                handleClose() {
                    if (this.retryCount < 5) {
                        setTimeout(() => {
                            this.retryCount++;
                            console.log(`♻️ [WS] Reconnecting... Attempt ${this.retryCount}/5`);
                            this.initSocket();
                        }, 2000 * this.retryCount);
                    } else {
                        console.error("🚫 [WS] Max reconnection attempts reached.");
                    }
                }
            }

            window.WebSocket = function (url) {
                return new WSInterceptor(url).ws;
            };
        }).toString()})();`;

        document.documentElement.appendChild(script);
        console.log("✅ [WebSocket Monitor] Installed successfully.");
    }

    /** 🎨 Wave Configuration **/
    const WAVE_CONFIG = {
        MAX_RADIUS: 150,
        WAVE_SPEED: 4,
        LINE_WIDTH: 3,
        STROKE_STYLE: 'rgba(0, 200, 255, 0.6)',
        FADE_RATE: 0.015
    };

    let overlayCanvas, ctx, waves = [];

    /** ✅ Ensures Click Detection is Working **/
    function setupWaveEffect() {
        console.log("🔍 [Wave System] Checking for overlay...");

        if (document.getElementById('wave-overlay')) {
            console.log("✅ [Wave System] Overlay canvas already exists.");
            return;
        }

        // Find the game canvas
        const gameCanvas = document.querySelector('canvas');
        if (!gameCanvas) {
            console.error("❌ [Wave System] Game canvas NOT found! Waves will NOT work.");
            return;
        } else {
            console.log("✅ [Wave System] Game canvas detected.");
        }

        // Create overlay canvas
        overlayCanvas = document.createElement('canvas');
        overlayCanvas.id = 'wave-overlay';
        overlayCanvas.style.position = 'absolute';
        overlayCanvas.style.left = '0';
        overlayCanvas.style.top = '0';
        overlayCanvas.style.pointerEvents = 'none';
        overlayCanvas.style.zIndex = '9999';
        document.body.appendChild(overlayCanvas);

        function resizeCanvas() {
            overlayCanvas.width = window.innerWidth;
            overlayCanvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        ctx = overlayCanvas.getContext('2d');

        /** ✅ Logs Click & Ensures Event Fires **/
        gameCanvas.addEventListener('click', (event) => {
            console.log("🖱️ [Click Detected] Click event fired!");

            // Get coordinates relative to the overlay canvas
            const rect = overlayCanvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            console.log(`🖱️ [Click Position] X: ${x}, Y: ${y}`);

            // Ensure waves are created
            waves.push({ x, y, radius: 0, opacity: 1 });

            setTimeout(() => {
                if (waves.length === 0) {
                    console.warn("⚠️ [Wave System] Wave was NOT generated after click!");
                } else {
                    console.log("🌊 [Wave Generated] Successfully added wave.");
                }
            }, 100);
        });

        /** ✅ Render Waves on Overlay Canvas **/
        function animateWaves() {
            ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

            waves = waves.filter(wave => {
                wave.radius += WAVE_CONFIG.WAVE_SPEED;
                wave.opacity -= WAVE_CONFIG.FADE_RATE;

                ctx.beginPath();
                ctx.arc(wave.x, wave.y, wave.radius, 0, 2 * Math.PI);
                ctx.lineWidth = WAVE_CONFIG.LINE_WIDTH;
                ctx.strokeStyle = `rgba(0, 200, 255, ${wave.opacity})`;
                ctx.stroke();

                return wave.opacity > 0;
            });

            requestAnimationFrame(animateWaves);
        }

        animateWaves();
        console.log("✅ [Wave System] Initialized successfully.");
    }

    /** 🕵️‍♂️ Ensure Canvas Exists Before Running Script **/
    const observer = new MutationObserver(() => {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            observer.disconnect();
            setupWaveEffect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    /** ✅ Main Execution **/
    (function main() {
        console.log("🚀 [Agar.io Enhanced] Starting...");
        installWebSocketHandler();
    })();
})();
