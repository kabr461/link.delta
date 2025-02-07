// ==UserScript==
// @name         Delta Spectator & Cinematic Animation Mod for Agar.io (Safe CMD UI)
// @namespace    http://your-namespace-here.com
// @version      1.2.2
// @description  Displays a live spectator window with names, avatars, wave counts, and a CMD Chat toggle (on by default) plus a cinematic, colorful particle explosion effect on canvas clicks. Errors in our mod are caught to help prevent crashing.
// @match        *://agar.io/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Wrap our entire mod code in a try-catch to prevent it from crashing the UI
    try {

        /***************** Optional: Relax CSP (Local Only) *****************
         * Note: Userscripts cannot override server-sent CSP headers.
         *********************************************************************/
        function removeCSPMetaTags() {
            document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]').forEach(tag => {
                tag.remove();
            });
        }
        removeCSPMetaTags();

        /***************** Create Spectator Panel CSS *****************/
        const style = document.createElement('style');
        style.textContent = `
        /* Container for the spectator window */
        #delta-spectator-panel {
            position: fixed;
            top: 10px;
            left: 10px;
            width: 250px;
            max-height: 90%;
            background: rgba(0, 0, 0, 0.75);
            color: #fff;
            font-family: Arial, sans-serif;
            font-size: 14px;
            padding: 10px;
            overflow-y: auto;
            z-index: 10000;
            border: 2px solid #f00;
            border-radius: 5px;
        }
        /* Header style */
        #delta-spectator-panel h2 {
            margin: 0 0 10px 0;
            font-size: 16px;
            text-align: center;
            border-bottom: 1px solid #fff;
            padding-bottom: 5px;
        }
        /* Each spectator entry */
        #delta-spectator-panel .spectator-item {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            cursor: pointer;
        }
        /* Avatar image style */
        #delta-spectator-panel .spectator-item img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 8px;
        }
        /* Spectator name style */
        #delta-spectator-panel .spectator-name {
            flex: 1;
        }
        /* Wave count style */
        #delta-spectator-panel .spectator-wave {
            background: #f00;
            padding: 2px 4px;
            border-radius: 3px;
            margin-left: 5px;
            font-size: 12px;
        }
        /* CMD Chat toggle style */
        #delta-spectator-panel .cmd-chat-toggle {
            margin-top: 10px;
            text-align: center;
        }
        `;
        document.head.appendChild(style);

        /***************** Create the Spectator Panel *****************/
        const panel = document.createElement('div');
        panel.id = 'delta-spectator-panel';
        panel.innerHTML = `
            <h2>Users (Delta)</h2>
            <div id="spectator-list"></div>
            <div class="cmd-chat-toggle">
                <label>
                    <input type="checkbox" id="cmd-chat-checkbox" checked>
                    CMD Chat
                </label>
            </div>
        `;
        document.body.appendChild(panel);

        const spectatorList = document.getElementById('spectator-list');
        const cmdChatCheckbox = document.getElementById('cmd-chat-checkbox');

        // Wrap CMD Chat toggle event in try-catch
        try {
            cmdChatCheckbox.addEventListener('change', function() {
                console.log("CMD Chat " + (this.checked ? "enabled" : "disabled"));
            });
        } catch (e) {
            console.error("Error in CMD Chat toggle:", e);
        }

        /***************** Utility: Copy Text to Clipboard *****************/
        function copyToClipboard(text) {
            try {
                if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(text).then(() => {
                        console.log(`Copied to clipboard: ${text}`);
                    }).catch(err => {
                        console.error('Clipboard write failed: ', err);
                    });
                } else {
                    const textArea = document.createElement("textarea");
                    textArea.value = text;
                    textArea.style.position = "fixed";
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    try {
                        document.execCommand('copy');
                        console.log(`Copied to clipboard: ${text}`);
                    } catch (err) {
                        console.error('Failed to copy text: ', err);
                    }
                    document.body.removeChild(textArea);
                }
            } catch (err) {
                console.error("Error in copyToClipboard:", err);
            }
        }

        /***************** Simulated Spectator Data *****************
         * In a real implementation, fetch live data from Delta.
         ***********************************************************/
        function getSpectatorData() {
            // Using dummyimage.com as a placeholder for avatars.
            const dummySpectators = [
                { name: "PlayerOne", skin: "https://dummyimage.com/40x40/FF0000/FFFFFF.png&text=P1", waves: Math.floor(Math.random() * 10) },
                { name: "PlayerTwo", skin: "https://dummyimage.com/40x40/00FF00/FFFFFF.png&text=P2", waves: Math.floor(Math.random() * 10) },
                { name: "PlayerThree", skin: "https://dummyimage.com/40x40/0000FF/FFFFFF.png&text=P3", waves: Math.floor(Math.random() * 10) },
                { name: "PlayerFour", skin: "https://dummyimage.com/40x40/FFFF00/FFFFFF.png&text=P4", waves: Math.floor(Math.random() * 10) }
            ];
            // Occasionally simulate a new player joining with a random color.
            if (Math.random() < 0.3) {
                const randomColor = Math.floor(Math.random() * 16777215)
                    .toString(16)
                    .padStart(6, '0')
                    .toUpperCase();
                dummySpectators.push({
                    name: "Player" + Math.floor(Math.random() * 100),
                    skin: `https://dummyimage.com/40x40/${randomColor}/FFFFFF.png&text=New`,
                    waves: Math.floor(Math.random() * 10)
                });
            }
            return dummySpectators;
        }

        /***************** Update Spectator List UI *****************/
        function updateSpectatorList() {
            try {
                const spectators = getSpectatorData();
                spectatorList.innerHTML = "";
                spectators.forEach(spectator => {
                    const item = document.createElement('div');
                    item.className = 'spectator-item';
                    // Create avatar image element.
                    const img = document.createElement('img');
                    img.src = spectator.skin;
                    img.addEventListener('click', (e) => {
                        e.stopPropagation();
                        copyToClipboard(spectator.skin);
                    });
                    // Create name element.
                    const nameDiv = document.createElement('div');
                    nameDiv.className = 'spectator-name';
                    nameDiv.textContent = spectator.name;
                    nameDiv.addEventListener('click', (e) => {
                        e.stopPropagation();
                        copyToClipboard(spectator.name);
                    });
                    // Create wave count element.
                    const waveCount = document.createElement('div');
                    waveCount.className = 'spectator-wave';
                    waveCount.textContent = spectator.waves;
                    // Append parts to the spectator item.
                    item.appendChild(img);
                    item.appendChild(nameDiv);
                    item.appendChild(waveCount);
                    spectatorList.appendChild(item);
                });
            } catch (err) {
                console.error("Error updating spectator list:", err);
            }
        }
        setInterval(updateSpectatorList, 5000);
        updateSpectatorList();
        console.log("Delta spectator window initialized.");

        /***************** Cinematic Particle Animation Effect *****************/
        // Configuration for the cinematic particle explosion effect.
        const CONFIG = {
            PARTICLE: {
                PARTICLE_COUNT: 50,    // Number of particles per explosion.
                SPEED_MIN: 2,          // Minimum speed.
                SPEED_MAX: 6,          // Maximum speed.
                SIZE_MIN: 3,           // Minimum particle size.
                SIZE_MAX: 7,           // Maximum particle size.
                FADE: 0.015            // Fade rate per frame.
            }
        };

        class CoolWaveRenderer {
            constructor(canvas) {
                this.canvas = canvas;
                this.ctx = canvas.getContext('2d');
                this.particles = [];
                this.init();
            }

            init() {
                try {
                    // On canvas click: trigger a cinematic animation and (optionally) broadcast the coordinates.
                    this.canvas.addEventListener('click', e => {
                        const rect = this.canvas.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        console.log("Local cinematic animation triggered at:", { x, y });
                        this.createParticles(x, y);
                        // In a real implementation, broadcast to teammates here.
                    });
                    this.startAnimation();
                } catch (err) {
                    console.error("Error in CoolWaveRenderer init:", err);
                }
            }

            createParticles(x, y) {
                // Choose a random base color for the explosion from a vibrant palette.
                const colorPalette = [
                    "255, 100, 100", // soft red
                    "255, 150, 50",  // orange
                    "255, 255, 100", // yellow
                    "100, 255, 100", // green
                    "100, 200, 255", // light blue
                    "200, 100, 255"  // purple
                ];
                const baseColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
                for (let i = 0; i < CONFIG.PARTICLE.PARTICLE_COUNT; i++) {
                    const angle = Math.random() * 2 * Math.PI;
                    const speed = Math.random() * (CONFIG.PARTICLE.SPEED_MAX - CONFIG.PARTICLE.SPEED_MIN) + CONFIG.PARTICLE.SPEED_MIN;
                    const dx = Math.cos(angle) * speed;
                    const dy = Math.sin(angle) * speed;
                    const size = Math.random() * (CONFIG.PARTICLE.SIZE_MAX - CONFIG.PARTICLE.SIZE_MIN) + CONFIG.PARTICLE.SIZE_MIN;
                    this.particles.push({
                        x: x,
                        y: y,
                        dx: dx,
                        dy: dy,
                        size: size,
                        alpha: 1,
                        color: baseColor
                    });
                }
            }

            renderParticles() {
                this.particles = this.particles.filter(particle => {
                    particle.x += particle.dx;
                    particle.y += particle.dy;
                    particle.alpha -= CONFIG.PARTICLE.FADE;
                    if (particle.alpha <= 0) return false;
                    // Create a radial gradient for a cinematic effect.
                    const gradient = this.ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size);
                    gradient.addColorStop(0, `rgba(${particle.color}, ${particle.alpha})`);
                    gradient.addColorStop(1, `rgba(${particle.color}, 0)`);
                    this.ctx.fillStyle = gradient;
                    this.ctx.beginPath();
                    this.ctx.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI);
                    this.ctx.fill();
                    return true;
                });
            }

            startAnimation() {
                const animate = () => {
                    try {
                        // We don't clear the entire canvas as the game might be drawing beneath our effect.
                        this.renderParticles();
                    } catch (err) {
                        console.error("Error in particle animation:", err);
                    }
                    requestAnimationFrame(animate);
                };
                animate();
            }
        }

        /***************** Attach the Cinematic Animation Effect *****************/
        const attachCoolAnimationEffect = () => {
            try {
                const canvas = document.querySelector('canvas');
                if (canvas) {
                    window.coolWaveRenderer = new CoolWaveRenderer(canvas);
                    console.log("Cinematic particle animation effect activated on canvas.");
                } else {
                    setTimeout(attachCoolAnimationEffect, 100);
                }
            } catch (err) {
                console.error("Error attaching cinematic animation effect:", err);
            }
        };
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', attachCoolAnimationEffect);
        } else {
            attachCoolAnimationEffect();
        }

        console.log("Delta mod with spectator window, CMD Chat (on by default), and cinematic animation setup attempted.");
    } catch (overallErr) {
        console.error("Error in Delta mod:", overallErr);
    }
})();
