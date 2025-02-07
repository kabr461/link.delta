// ==UserScript==
// @name         Team Wave Broadcast Mod for Agar.io
// @namespace    http://your-namespace-here.com
// @version      1.0
// @description  Removes local restrictions, adds a wave effect on canvas, and broadcasts clicks so all teammates see the waves. (For testing only—extremely insecure!)
// @match        *://agar.io/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    /***************************************************************
     * 1. Remove & Override Content Security Policies (CSP)
     ***************************************************************/
    const removeCSPMetaTags = () => {
        document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]').forEach(tag => {
            tag.parentNode.removeChild(tag);
        });
    };
    removeCSPMetaTags();

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

    const insertPermissiveCSP = () => {
        if (document.head) {
            removeCSPMetaTags();
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

    if (!window.System) {
        window.System = { import: src => import(src) };
    }

    /***************************************************************
     * 3. Set Up the Click-Triggered Wave Effect with Broadcast
     ***************************************************************/
    // Configuration for the wave effect.
    const CONFIG = {
        WAVE: {
            MAX_RADIUS: 200,   // Maximum radius before a wave disappears.
            SPEED: 8,          // How fast the wave expands.
            WIDTH: 3,          // Stroke width of the wave circle.
            COLOR: 'rgba(100, 200, 255, 0.4)',  // Base color (the "0.4" will be replaced with dynamic opacity).
            FADE: 0.02         // How fast the wave fades.
        },
        // WebSocket server URL (you must set up or use a broadcast server here)
        WS_SERVER: 'wss://your-wave-server.example.com'  // <-- Replace with your working WebSocket server URL.
    };

    // WaveRenderer creates and animates wave effects on a canvas.
    class WaveRenderer {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.waves = [];
            this.init();
        }

        init() {
            // When you click, create a wave and broadcast it.
            this.canvas.addEventListener('click', e => {
                const rect = this.canvas.getBoundingClientRect();
                const waveData = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                };
                this.createWave(waveData.x, waveData.y);
                broadcastWave(waveData);  // send to other clients
            });
            this.startAnimation();
        }

        createWave(x, y) {
            // Add a wave at the given coordinates.
            this.waves.push({
                x: x,
                y: y,
                radius: 0,
                opacity: 1
            });
        }

        renderWaves() {
            // Update and draw each wave.
            this.waves = this.waves.filter(wave => {
                wave.radius += CONFIG.WAVE.SPEED;
                wave.opacity -= CONFIG.WAVE.FADE;
                this.ctx.beginPath();
                this.ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
                // Replace the alpha value in the color string with the current opacity.
                this.ctx.strokeStyle = CONFIG.WAVE.COLOR.replace('0.4', wave.opacity.toFixed(2));
                this.ctx.lineWidth = CONFIG.WAVE.WIDTH;
                this.ctx.stroke();
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

    // --- WebSocket Broadcast Integration ---
    // Establish a WebSocket connection to the broadcast server.
    let waveSocket;
    const initWaveSocket = () => {
        try {
            waveSocket = new WebSocket(CONFIG.WS_SERVER);
            waveSocket.onopen = () => {
                console.log("Wave broadcast socket connected.");
            };
            waveSocket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'wave') {
                        // When a wave event is received, add it to the renderer.
                        if (window.waveRenderer && typeof data.x === 'number' && typeof data.y === 'number') {
                            window.waveRenderer.createWave(data.x, data.y);
                        }
                    }
                } catch (e) {
                    console.error("Error parsing wave message:", e);
                }
            };
            waveSocket.onerror = (err) => {
                console.error("Wave socket error:", err);
            };
            waveSocket.onclose = () => {
                console.warn("Wave socket closed. Reconnecting in 5 seconds...");
                setTimeout(initWaveSocket, 5000);
            };
        } catch (e) {
            console.error("Failed to initialize wave WebSocket:", e);
        }
    };

    // Call the function to open the WebSocket connection.
    initWaveSocket();

    // Function to broadcast a wave event to the server.
    const broadcastWave = (data) => {
        if (waveSocket && waveSocket.readyState === WebSocket.OPEN) {
            const message = { type: 'wave', x: data.x, y: data.y };
            waveSocket.send(JSON.stringify(message));
        }
    };

    // --- Attach the Wave Effect to the Game Canvas ---
    const attachWaveEffect = () => {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            window.waveRenderer = new WaveRenderer(canvas);
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

    console.log("Delta script modifications and team wave effect setup attempted.");
})();
