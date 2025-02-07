// ==UserScript==
// @name         Agar.io Enhanced with Click Debugging & Wave Effects
// @namespace    http://secure-scripts.com
// @version      6.4
// @description  Click Debugging, Wave Effects, WebSocket Monitoring for Agar.io
// @author       Your Name
// @match        *://agar.io/*
// @grant        none
// @run-at       document-start
// @noframes
// ==/UserScript==

(function () {
    'use strict';

    /** 🔄 Wave Configuration **/
    const WAVE_CONFIG = {
        MAX_RADIUS: 120,
        WAVE_SPEED: 3,
        LINE_WIDTH: 2,
        STROKE_STYLE: 'rgba(0, 200, 255, 0.5)',
        FADE_RATE: 0.02
    };

    let overlayCanvas, ctx, waves = [];

    /** ✅ Ensures Click Detection is Working **/
    function setupWaveEffect() {
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

})();
