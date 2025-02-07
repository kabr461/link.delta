// ==UserScript==
// @name         Delta & Wave Open Access Mod for Agar.io
// @namespace    http://your-namespace-here.com
// @version      1.0
// @description  Attempts to remove local restrictions (CSP, worker patch, etc.) and adds a click-triggered wave effect. (For testing only—extremely insecure!)
// @match        *://agar.io/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    /***************************************************************
     * 1. Remove & Override Content Security Policies (CSP)
     ***************************************************************/
    // A utility to remove existing CSP meta tags.
    const removeCSPMetaTags = () => {
        document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]').forEach(tag => {
            tag.parentNode.removeChild(tag);
        });
    };

    // Immediately remove any current CSP meta tags.
    removeCSPMetaTags();

    // Use a MutationObserver to continuously remove any new CSP meta tags.
    const cspObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.tagName === 'META' && node.getAttribute('http-equiv') === 'Content-Security-Policy') {
                    node.parentNode.removeChild(node);
                }
            });
        });
    });
    cspObserver.observe(document.documentElement, { childList: true, subtree: true });

    // Wait until document.head exists so we can insert our permissive meta tag properly.
    const insertPermissiveCSP = () => {
        if (document.head) {
            // Remove any existing CSP meta tags (again, just in case).
            removeCSPMetaTags();
            // Create and insert an extremely permissive CSP meta tag.
            const meta = document.createElement('meta');
            meta.httpEquiv = 'Content-Security-Policy';
            meta.content = "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; " +
                           "script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; " +
                           "style-src * 'unsafe-inline' data: blob:; " +
                           "img-src * data: blob:; " +
                           "connect-src *; " +
                           "manifest-src *; " +
                           "worker-src * blob:; " +
                           "frame-src *;";
            // Prepend to ensure it's at the very top of the head.
            document.head.prepend(meta);
            console.log("CSP set to extremely permissive mode.");
        } else {
            setTimeout(insertPermissiveCSP, 10);
        }
    };
    insertPermissiveCSP();

    /***************************************************************
     * 2. Patch Worker Creation and System.import Polyfill
     ***************************************************************/
    // Patch window.Worker to convert inline worker code (data URLs) into Blob URLs.
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

    // Polyfill for System.import (for dynamic module loading) if it doesn't exist.
    if (!window.System) {
        window.System = {
            import: src => import(src)
        };
    }

    /***************************************************************
     * 3. Set Up the Click-Triggered Wave Effect on the Canvas
     ***************************************************************/
    const CONFIG = {
        WAVE: {
            MAX_RADIUS: 200,   // Maximum radius before a wave disappears.
            SPEED: 8,          // How fast the wave expands.
            WIDTH: 3,          // Stroke width of the wave circle.
            COLOR: 'rgba(100, 200, 255, 0.4)',  // Base color (the "0.4" will be replaced with dynamic opacity).
            FADE: 0.02         // How fast the wave fades.
        }
    };

    class WaveRenderer {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.waves = [];
            this.init();
        }

        init() {
            // Listen for clicks on the canvas to create waves.
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
            // Draw and update each wave.
            this.waves = this.waves.filter(wave => {
                wave.radius += CONFIG.WAVE.SPEED;
                wave.opacity -= CONFIG.WAVE.FADE;
                this.ctx.beginPath();
                this.ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
                // Replace the alpha value in the color string with the current opacity.
                this.ctx.strokeStyle = CONFIG.WAVE.COLOR.replace('0.4', wave.opacity.toFixed(2));
                this.ctx.lineWidth = CONFIG.WAVE.WIDTH;
                this.ctx.stroke();
                // Remove the wave if it's too big or fully faded.
                return wave.radius < CONFIG.WAVE.MAX_RADIUS && wave.opacity > 0;
            });
        }

        startAnimation() {
            const animate = () => {
                this.renderWaves();
                requestAnimationFrame(animate);
            };
            animate();
        }
    }

    // Attach the wave effect by waiting until the game canvas is available.
    const attachWaveEffect = () => {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            new WaveRenderer(canvas);
            console.log("Wave effect activated on canvas.");
        } else {
            setTimeout(attachWaveEffect, 100);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attachWaveEffect);
    } else {
        attachWaveEffect();
    }

    console.log("Delta script modifications and wave effect setup attempted.");
})();
