// ==UserScript==
// @name         Ultimate Open Access & Wave Effect Mod for Agar.io
// @namespace    http://your-namespace-here.com
// @version      1.0
// @description  Removes most restrictions so every external resource can load and adds a click wave effect to the canvas. (Extremely insecure!)
// @match        *://agar.io/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    /***************************************************************
     * 1. Remove & Override Content Security Policies (CSP)
     ***************************************************************/
    // Remove any existing CSP meta tags immediately.
    const removeCSP = () => {
        document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]').forEach(tag => {
            tag.parentNode.removeChild(tag);
        });
    };
    removeCSP();

    // Use a MutationObserver to remove any new CSP tags added later.
    const cspObserver = new MutationObserver(() => {
        removeCSP();
    });
    cspObserver.observe(document.documentElement, { childList: true, subtree: true });

    // Insert an extremely permissive CSP meta tag.
    const meta = document.createElement('meta');
    meta.httpEquiv = "Content-Security-Policy";
    meta.content = "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; " +
                   "script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; " +
                   "style-src * 'unsafe-inline' data: blob:; " +
                   "img-src * data: blob:; " +
                   "connect-src *; " +
                   "manifest-src *; " +
                   "worker-src * blob:; " +
                   "frame-src *;";
    document.documentElement.prepend(meta);
    console.log("CSP set to extremely permissive mode.");

    /***************************************************************
     * 2. Patch Worker Creation and System.import Polyfill
     ***************************************************************/
    // Patch window.Worker so that inline code (data URLs) is converted to Blob URLs.
    (function() {
        const OriginalWorker = window.Worker;
        window.Worker = function(script, options) {
            if (typeof script === 'string' && script.startsWith('data:')) {
                try {
                    const commaIndex = script.indexOf(',');
                    const blobContent = decodeURIComponent(script.substring(commaIndex + 1));
                    const blob = new Blob([blobContent], { type: 'application/javascript' });
                    const blobUrl = URL.createObjectURL(blob);
                    return new OriginalWorker(blobUrl, options);
                } catch (e) {
                    console.error("Worker patch error:", e);
                }
            }
            return new OriginalWorker(script, options);
        };
    })();

    // Define System.import polyfill (for dynamic module loading) if it doesn't exist.
    if (!window.System) {
        window.System = {
            import: function(src) {
                return import(src);
            }
        };
    }

    /***************************************************************
     * 3. Set Up the Click Wave Effect on the Canvas
     ***************************************************************/
    // Configuration for the wave effect.
    const CONFIG = {
        WAVE: {
            MAX_RADIUS: 200,   // Maximum radius before a wave disappears
            SPEED: 8,          // How fast the wave expands
            WIDTH: 3,          // Stroke width of the wave circle
            COLOR: 'rgba(100, 200, 255, 0.4)',  // Base color (the "0.4" will be replaced with dynamic opacity)
            FADE: 0.02         // How fast the wave fades out
        }
    };

    // WaveRenderer class creates a ripple effect on the canvas when you click.
    class WaveRenderer {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.waves = [];
            this.init();
        }

        init() {
            // When you click on the canvas, create a new wave.
            this.canvas.addEventListener('click', e => this.createWave(e));
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
            // Clear the canvas overlay if needed (you might not want to clear the whole canvas if the game is drawing).
            // Instead, we simply draw on top.
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
            // Replace the alpha value in the color string with the current opacity.
            return CONFIG.WAVE.COLOR.replace('0.4', opacity.toFixed(2));
        }

        startAnimation() {
            const animate = () => {
                // It is possible that the game itself is drawing on the canvas,
                // so this wave effect will overlay on top.
                this.renderWaves();
                requestAnimationFrame(animate);
            };
            animate();
        }
    }

    // Wait for the game canvas to appear and then attach the WaveRenderer.
    const attachWaveEffect = () => {
        const canvasObserver = new MutationObserver((mutations, observer) => {
            const canvas = document.querySelector('canvas');
            if (canvas) {
                new WaveRenderer(canvas);
                console.log("Wave effect activated on canvas.");
                observer.disconnect();
            }
        });
        canvasObserver.observe(document.body, { childList: true, subtree: true });
    };

    // Start the observer when the document is ready.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attachWaveEffect);
    } else {
        attachWaveEffect();
    }

    console.log("All restrictions have been lifted and wave effect is set up (if canvas is found).");
})();
