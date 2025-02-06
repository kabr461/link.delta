// ==UserScript==
// @name         Agar.io Wave Effect
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Generate waves on click in Agar.io
// @author       Your Name
// @match        *://agar.io/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Wait for game canvas to load
    const waitForCanvas = setInterval(() => {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            clearInterval(waitForCanvas);
            initWaveEffect(canvas);
        }
    }, 100);

    function initWaveEffect(canvas) {
        // Store wave properties
        let waves = [];
        const waveProperties = {
            maxRadius: 100,
            waveSpeed: 5,
            lineWidth: 2,
            strokeStyle: 'rgba(255, 255, 255, 0.5)'
        };

        // Save original context
        const ctx = canvas.getContext('2d');
        const originalDraw = ctx.draw;

        // Add click listener
        canvas.addEventListener('click', createWave);

        // Override draw function to add waves
        ctx.draw = function() {
            originalDraw.apply(ctx, arguments);
            drawWaves();
        };

        function createWave(e) {
            const rect = canvas.getBoundingClientRect();
            const pos = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
            
            waves.push({
                position: pos,
                radius: 0,
                opacity: 1
            });
        }

        function drawWaves() {
            waves = waves.filter(wave => {
                // Update wave properties
                wave.radius += waveProperties.waveSpeed;
                wave.opacity -= 0.02;

                // Draw wave
                ctx.beginPath();
                ctx.arc(
                    wave.position.x,
                    wave.position.y,
                    wave.radius,
                    0,
                    2 * Math.PI
                );
                ctx.lineWidth = waveProperties.lineWidth;
                ctx.strokeStyle = `rgba(255, 255, 255, ${wave.opacity})`;
                ctx.stroke();

                // Remove expired waves
                return wave.radius < waveProperties.maxRadius && wave.opacity > 0;
            });
        }

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            drawWaves();
        }
        animate();
    }
})();
