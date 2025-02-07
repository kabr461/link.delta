// ==UserScript==
// @name         Delta & Broadcast Wave Mod for Agar.io
// @namespace    http://your-namespace-here.com
// @version      1.0
// @description  Removes local CSP restrictions, adds a click-triggered wave effect, and broadcasts wave events so that every mod user sees the effect.
// @match        *://agar.io/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    /***************************************************************
     * 1. Remove & Override Content Security Policies (CSP)
     ***************************************************************/
    // Immediately remove any existing CSP meta tags.
    const removeCSPMetaTags = () => {
        document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]').forEach(tag => {
            tag.parentNode.removeChild(tag);
        });
    };
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

    // Wait until document.head exists so we can insert our meta tag properly.
    const insertPermissiveCSP = () => {
        if (document.head) {
            // Remove any existing CSP meta tags (again).
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
    // Patch window.Worker so that inline worker code (data URLs) is converted to Blob URLs.
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

    // Polyfill for System.import if it doesn't exist.
    if (!window.System) {
        window.System = {
            import: src => import(src)
        };
    }

    /***************************************************************
     * 3. Set Up a Custom WebSocket for Broadcasting Waves
     ***************************************************************/
    // Replace the URL below with your own WebSocket server.
    window.myWaveSocket = new WebSocket("ws://yourserver.example.com");
    window.myWaveSocket.addEventListener('open', function() {
        console.log("Connected to wave broadcast server");
    });
    window.myWaveSocket.addEventListener('message', function(event) {
        try {
            const data = JSON.parse(event.data);
            if (data.type === "wave") {
                if (waveRendererInstance) {
                    // When a wave event is received from another client, create a wave locally.
                    waveRendererInstance.createWaveAt(data.x, data.y);
                }
            }
        } catch (e) {
            console.error(e);
        }
    });

    // Function to broadcast a wave event.
    function broadcastWave(x, y) {
        if (window.myWaveSocket && window.myWaveSocket.readyState === WebSocket.OPEN) {
            window.myWaveSocket.send(JSON.stringify({ type: "wave", x: x, y: y }));
        }
    }

    /***************************************************************
     * 4. Set Up the Click-Triggered Wave Effect on the Canvas
     ***************************************************************/
    const CONFIG = {
        WAVE: {
            MAX_RADIUS: 200,   // Maximum radius before a wave disappears.
            SPEED: 8,          // How fast the wave expands.
            WIDTH: 3,          // Stroke width of the wave circle.
            COLOR: 'rgba(100, 200, 255, 0.4)',  // Base color; the "0.4" is replaced with dynamic opacity.
            FADE: 0.02         // How fast the wave fades.
        }
    };

    let waveRendererInstance = null;

    class WaveRenderer {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.waves = [];
            this.init();
        }

        init() {
            // Listen for clicks on the canvas to create a wave.
            this.canvas.addEventListener('click', e => this.createWave(e));
            this.startAnimation();
        }

        // Create a wave when you click; also broadcast the event.
        createWave(event) {
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            this.waves.push({ x: x, y: y, radius: 0, opacity: 1 });
            broadcastWave(x, y); // Send the wave event to others.
        }

        // Create a wave at specified coordinates (used when receiving a broadcast).
        createWaveAt(x, y) {
            this.waves.push({ x: x, y: y, radius: 0, opacity: 1 });
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
                // Keep the wave if it's not too big or fully faded.
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

    // Wait until the game canvas is available and then attach the wave effect.
    const attachWaveEffect = () => {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            waveRendererInstance = new WaveRenderer(canvas);
            console.log("Wave effect activated and broadcasting on canvas.");
        } else {
            setTimeout(attachWaveEffect, 100);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attachWaveEffect);
    } else {
        attachWaveEffect();
    }

    console.log("Delta script modifications and broadcast wave effect setup attempted.");
})();
