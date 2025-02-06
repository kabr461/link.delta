// ==UserScript==
// @name         Agar.io Team Wave Communicator
// @namespace    http://secure-scripts.com
// @version      8.0
// @description  Shared wave effects with WebSocket integration
// @author       Your Name
// @match        *://agar.io/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        DEBUG: true,
        WAVE: {
            RADIUS: 150,
            SPEED: 6,
            WIDTH: 3,
            COLOR: [0, 191, 255, 0.3],  // RGB + Alpha
            FADE: 0.02,
            TEAM_COLOR: [50, 255, 50, 0.4]  // Green for teammates
        },
        WS: {
            ENDPOINTS: [
                'wss://live.agar.io',
                'wss://mca.agar.io',
                'wss://delta.agar.io'
            ],
            RECONNECT_DELAY: 2000,
            MAX_RETRIES: 3
        }
    };

    // Shared WebSocket Manager
    class WaveSocket {
        constructor() {
            this.waves = [];
            this.socket = null;
            this.retries = 0;
            this.connect();
        }

        connect() {
            const validEndpoint = CONFIG.WS.ENDPOINTS.find(endpoint => {
                try { return new WebSocket(endpoint); } 
                catch { return false; }
            });

            if (!validEndpoint) return;

            this.socket = new WebSocket(validEndpoint);
            
            this.socket.onopen = () => {
                this.retries = 0;
                CONFIG.DEBUG && console.log('[WS] Connected to', validEndpoint);
            };

            this.socket.onmessage = (e) => this.handleMessage(e);
            
            this.socket.onclose = (e) => {
                if (this.retries < CONFIG.WS.MAX_RETRIES) {
                    setTimeout(() => this.connect(), CONFIG.WS.RECONNECT_DELAY);
                    this.retries++;
                }
            };
        }

        sendWave(waveData) {
            if (this.socket?.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify({
                    type: 'wave',
                    data: waveData
                }));
            }
        }

        handleMessage(event) {
            try {
                const msg = JSON.parse(event.data);
                if (msg.type === 'wave') this.addRemoteWave(msg.data);
            } catch (e) {
                CONFIG.DEBUG && console.error('Message parse error:', e);
            }
        }

        addRemoteWave(data) {
            this.waves.push({
                ...data,
                isRemote: true,
                radius: 0,
                opacity: 1
            });
        }
    }

    // Wave Renderer
    class WaveRenderer {
        constructor(canvas, waveSocket) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.waveSocket = waveSocket;
            this.originalDraw = this.ctx.draw;
            this.localWaves = [];
            this.init();
        }

        init() {
            // Override canvas draw
            this.ctx.draw = (...args) => {
                this.originalDraw.apply(this.ctx, args);
                this.drawWaves();
            };

            // Click handler
            this.canvas.addEventListener('click', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                const waveData = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                    timestamp: Date.now()
                };
                
                this.localWaves.push({ ...waveData, radius: 0, opacity: 1 });
                this.waveSocket.sendWave(waveData);
            });

            // Animation loop
            const animate = () => {
                requestAnimationFrame(animate);
                this.drawWaves();
            };
            animate();
        }

        drawWaves() {
            // Combine local and remote waves
            const allWaves = [...this.localWaves, ...this.waveSocket.waves];
            
            allWaves.forEach(wave => {
                wave.radius += CONFIG.WAVE.SPEED;
                wave.opacity -= CONFIG.WAVE.FADE;

                this.ctx.beginPath();
                this.ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
                this.ctx.lineWidth = CONFIG.WAVE.WIDTH;
                
                // Use team color for remote waves
                const color = wave.isRemote ? 
                    CONFIG.WAVE.TEAM_COLOR : 
                    CONFIG.WAVE.COLOR;
                
                this.ctx.strokeStyle = `rgba(${color.join(',')})`;
                this.ctx.stroke();
            });

            // Cleanup expired waves
            this.localWaves = this.localWaves.filter(w => 
                w.radius < CONFIG.WAVE.RADIUS && w.opacity > 0
            );
            this.waveSocket.waves = this.waveSocket.waves.filter(w => 
                w.radius < CONFIG.WAVE.RADIUS && w.opacity > 0
            );
        }
    }

    // Main Initialization
    (function main() {
        // Setup security policy
        const csp = document.createElement('meta');
        csp.httpEquiv = "Content-Security-Policy";
        csp.content = [
            "default-src 'self' agar.io *.agar.io",
            "connect-src 'self' ws: wss: *",
            "img-src 'self' data: blob: *",
            "script-src 'self' 'unsafe-inline'",
            "style-src 'self' 'unsafe-inline'"
        ].join('; ');
        document.head.prepend(csp);

        // Wait for canvas
        const canvasObserver = new MutationObserver((_, observer) => {
            const canvas = document.querySelector('canvas');
            if (canvas) {
                observer.disconnect();
                new WaveRenderer(canvas, new WaveSocket());
            }
        });

        canvasObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Update meta tags
        const oldMeta = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
        if (oldMeta) oldMeta.remove();
        
        const newMeta = document.createElement('meta');
        newMeta.name = 'mobile-web-app-capable';
        newMeta.content = 'yes';
        document.head.appendChild(newMeta);
    })();
})();
