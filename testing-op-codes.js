// ==UserScript==
// @name         Delta Team Help & Wave Broadcast Mod for Agar.io (with Logging)
// @namespace    http://your-namespace-here.com
// @version      1.1
// @description  Opens local restrictions, adds a team-shared wave effect on canvas, and lets team members broadcast help requests (press "H"). Logs messages in the console when waves are triggered. (Experimental & insecure!)
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

    // Remove current CSP meta tags immediately.
    removeCSPMetaTags();

    // Use a MutationObserver to remove any new CSP tags.
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

    // Insert an extremely permissive CSP meta tag into the <head> when available.
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
     * 3. Set Up the Click-Triggered Wave Effect with Broadcast & Logging
     ***************************************************************/
    const CONFIG = {
        WAVE: {
            MAX_RADIUS: 200,   // Maximum radius before a wave disappears.
            SPEED: 8,          // How fast the wave expands.
            WIDTH: 3,          // Stroke width of the wave circle.
            COLOR: 'rgba(100, 200, 255, 0.4)',  // Base color; the "0.4" will be replaced with dynamic opacity.
            FADE: 0.02         // How fast the wave fades.
        },
        // Replace with your working WebSocket server URL.
        WS_SERVER: 'wss://your-wave-server.example.com'
    };

    // WaveRenderer: draws and animates waves on the canvas.
    class WaveRenderer {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.waves = [];
            this.init();
        }

        init() {
            // On canvas click: create a local wave, log the event, and broadcast the coordinates.
            this.canvas.addEventListener('click', e => {
                const rect = this.canvas.getBoundingClientRect();
                const waveData = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                };
                console.log("Local wave triggered at:", waveData);
                this.createWave(waveData.x, waveData.y);
                broadcastWave(waveData);  // Send to teammates.
            });
            this.startAnimation();
        }

        createWave(x, y) {
            this.waves.push({
                x: x,
                y: y,
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

    // --- WebSocket Broadcast Integration for Waves and Help ---
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
                    // Handle wave events.
                    if (data.type === 'wave') {
                        console.log("Received wave broadcast from teammate:", data);
                        if (window.waveRenderer && typeof data.x === 'number' && typeof data.y === 'number') {
                            window.waveRenderer.createWave(data.x, data.y);
                        }
                    }
                    // Handle help events.
                    else if (data.type === 'help') {
                        console.log("Received help request:", data.message);
                        showHelpMessage(data.message || "A team member is asking for help!");
                    }
                } catch (e) {
                    console.error("Error parsing broadcast message:", e);
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
    initWaveSocket();

    // Function to broadcast a wave event.
    const broadcastWave = (data) => {
        if (waveSocket && waveSocket.readyState === WebSocket.OPEN) {
            const message = { type: 'wave', x: data.x, y: data.y };
            waveSocket.send(JSON.stringify(message));
        }
    };

    /***************************************************************
     * 4. Team Help Broadcast Functionality
     ***************************************************************/
    // Create an overlay element for displaying help messages.
    const createHelpOverlay = () => {
        const overlay = document.createElement('div');
        overlay.id = 'help-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '10px';
        overlay.style.right = '10px';
        overlay.style.padding = '10px';
        overlay.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
        overlay.style.color = 'white';
        overlay.style.fontSize = '20px';
        overlay.style.zIndex = '9999';
        overlay.style.display = 'none';
        document.body.appendChild(overlay);
        return overlay;
    };
    const helpOverlay = createHelpOverlay();

    // Function to display a help message on-screen.
    const showHelpMessage = (msg) => {
        helpOverlay.innerText = msg;
        helpOverlay.style.display = 'block';
        setTimeout(() => {
            helpOverlay.style.display = 'none';
        }, 5000);
    };

    // Function to broadcast a help request to teammates.
    const broadcastHelp = (message) => {
        if (waveSocket && waveSocket.readyState === WebSocket.OPEN) {
            const msg = { type: 'help', message: message };
            waveSocket.send(JSON.stringify(msg));
        }
    };

    // Listen for keydown events—when a team member presses "H", send a help request.
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'h') {
            broadcastHelp("Help needed from a team member!");
            showHelpMessage("You requested help!");
        }
    });

    /***************************************************************
     * 5. Attach the Wave Effect to the Game Canvas
     ***************************************************************/
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

    console.log("Delta script modifications, team wave effect, help broadcast, and console logging setup attempted.");
})();
