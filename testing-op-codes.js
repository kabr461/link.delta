// ==UserScript==
// @name         Delta Spectator Panel & Wave Broadcast Mod (Firebase, Persistent UI)
// @namespace    http://your-namespace-here.com
// @version      1.0.1
// @description  When in spectating mode (with Delta data from Firebase), shows a professional spectator panel and triggers a cinematic particle wave animation on canvas clicks that is broadcast via Firebase. CMD Chat toggle is on by default.
// @match        *://agar.io/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    /***************** Remove Local CSP Meta Tags (Optional) *****************
     * Note: Userscripts cannot override server-sent headers.
     *************************************************************************/
    function removeCSPMetaTags() {
        document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]').forEach(tag => tag.remove());
    }
    removeCSPMetaTags();

    /***************** Insert Professional CSS for the UI *****************/
    function insertSpectatorStyles() {
        if (document.getElementById('delta-spectator-style')) return; // Only once.
        const style = document.createElement('style');
        style.id = 'delta-spectator-style';
        style.textContent = `
            /* Container for the spectator panel */
            #delta-spectator-panel {
                position: fixed;
                top: 20px;
                left: 20px;
                width: 300px;
                max-height: 80%;
                background: linear-gradient(135deg, #1c1c1c, #333);
                color: #f0f0f0;
                font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
                font-size: 14px;
                padding: 15px;
                overflow-y: auto;
                z-index: 10000;
                border: 1px solid #555;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.5);
            }
            /* Header style */
            #delta-spectator-panel h2 {
                margin: 0 0 15px 0;
                font-size: 18px;
                text-align: center;
                border-bottom: 1px solid #555;
                padding-bottom: 5px;
            }
            /* Each spectator entry */
            #delta-spectator-panel .spectator-item {
                display: flex;
                align-items: center;
                margin-bottom: 10px;
                padding: 5px;
                border-bottom: 1px solid #444;
            }
            #delta-spectator-panel .spectator-item:last-child {
                border-bottom: none;
            }
            /* Avatar image style */
            #delta-spectator-panel .spectator-item img {
                width: 45px;
                height: 45px;
                border-radius: 50%;
                margin-right: 10px;
                object-fit: cover;
                border: 1px solid #777;
            }
            /* Spectator name style */
            #delta-spectator-panel .spectator-name {
                flex: 1;
                font-weight: bold;
            }
            /* Wave count style */
            #delta-spectator-panel .spectator-wave {
                background: #e74c3c;
                color: #fff;
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 12px;
            }
            /* CMD Chat toggle style */
            #delta-spectator-panel .cmd-chat-toggle {
                margin-top: 15px;
                text-align: center;
            }
        `;
        document.head.appendChild(style);
    }

    /***************** Create/Remove the Spectator Panel UI *****************/
    function createSpectatorPanel() {
        if (document.getElementById('delta-spectator-panel')) return; // already exists
        insertSpectatorStyles();
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

        // Attach event listener for CMD Chat toggle.
        const cmdChatCheckbox = document.getElementById('cmd-chat-checkbox');
        cmdChatCheckbox.addEventListener('change', function() {
            console.log("CMD Chat " + (this.checked ? "enabled" : "disabled"));
        });
    }
    function removeSpectatorPanel() {
        const panel = document.getElementById('delta-spectator-panel');
        if (panel) panel.remove();
    }

    /***************** Utility: Copy Text to Clipboard *****************/
    function copyToClipboard(text) {
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
    }

    /***************** Firebase Integration *****************/
    function loadScript(src, onload) {
        const script = document.createElement('script');
        script.src = src;
        script.onload = onload;
        document.head.appendChild(script);
    }
    loadScript("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js", function() {
        loadScript("https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js", initializeFirebase);
    });

    // Replace these with your actual Firebase configuration details.
    const firebaseConfig = {
  apiKey: "AIzaSyDtlJnDcRiqO8uhofXqePLOhUTf2dWpEDI",
  authDomain: "agario-bb5ea.firebaseapp.com",
  databaseURL: "https://agario-bb5ea-default-rtdb.firebaseio.com",
  projectId: "agario-bb5ea",
  storageBucket: "agario-bb5ea.firebasestorage.app",
  messagingSenderId: "306389211380",
  appId: "1:306389211380:web:3c1eb559078b05734be6a1",
  measurementId: "G-5NTSETJHM9"
};

    function initializeFirebase() {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        console.log("Firebase initialized.");
        setupSpectatorListener();
        setupWaveListener();
        // Now that Firebase is ready, start checking spectating mode.
        setInterval(checkSpectatingMode, 2000);
        checkSpectatingMode();
    }

    /***************** Listen for Spectator Data from Firebase *****************/
    function setupSpectatorListener() {
        const ref = firebase.database().ref("delta_spectators");
        ref.on("value", snapshot => {
            const data = snapshot.val();
            updateSpectatorListFromFirebase(data);
        }, error => {
            console.error("Firebase spectator listener error: ", error);
        });
    }

    function updateSpectatorListFromFirebase(data) {
        const spectatorList = document.getElementById('spectator-list');
        if (!spectatorList) return;
        spectatorList.innerHTML = "";
        if (data) {
            const spectators = Object.values(data);
            spectators.forEach(spectator => {
                const item = document.createElement('div');
                item.className = 'spectator-item';

                const img = document.createElement('img');
                img.src = spectator.skin;
                img.addEventListener('click', e => {
                    e.stopPropagation();
                    copyToClipboard(spectator.skin);
                });

                const nameDiv = document.createElement('div');
                nameDiv.className = 'spectator-name';
                nameDiv.textContent = spectator.name;
                nameDiv.addEventListener('click', e => {
                    e.stopPropagation();
                    copyToClipboard(spectator.name);
                });

                const waveCount = document.createElement('div');
                waveCount.className = 'spectator-wave';
                waveCount.textContent = spectator.waves || 0;

                item.appendChild(img);
                item.appendChild(nameDiv);
                item.appendChild(waveCount);
                spectatorList.appendChild(item);
            });
        } else {
            spectatorList.innerHTML = "<div style='text-align:center;'>No spectator data</div>";
        }
    }

    /***************** Listen for Wave Events from Firebase *****************/
    function setupWaveListener() {
        const ref = firebase.database().ref("delta_wave_events");
        ref.on("child_added", snapshot => {
            const data = snapshot.val();
            if (data && typeof data.x === 'number' && typeof data.y === 'number') {
                console.log("Received wave event from Firebase:", data);
                if (window.coolWaveRenderer) {
                    window.coolWaveRenderer.createParticles(data.x, data.y);
                }
            }
        }, error => {
            console.error("Firebase wave listener error: ", error);
        });
    }

    /***************** Broadcast a Wave Event to Firebase *****************/
    function broadcastWaveEvent(x, y) {
        if (typeof firebase === "undefined" || !firebase.database) {
            console.warn("Firebase not ready, wave event not broadcasted.");
            return;
        }
        const ref = firebase.database().ref("delta_wave_events");
        ref.push({ x: x, y: y, timestamp: Date.now() });
    }

    /***************** Check Spectating Mode and Manage the Panel *****************/
    function checkSpectatingMode() {
        // Ensure Firebase is ready before checking.
        if (typeof firebase === "undefined" || !firebase.database) {
            console.warn("Firebase not loaded yet, skipping checkSpectatingMode.");
            return;
        }
        const ref = firebase.database().ref("delta_spectators");
        ref.once("value", snapshot => {
            const data = snapshot.val();
            if (data) {
                if (!document.getElementById('delta-spectator-panel')) {
                    createSpectatorPanel();
                }
                updateSpectatorListFromFirebase(data);
            } else {
                removeSpectatorPanel();
            }
        });
    }

    /***************** MutationObserver to Re-Add the Panel if Removed *****************/
    const uiObserver = new MutationObserver(mutations => {
        if (!document.getElementById('delta-spectator-panel')) {
            console.warn("Spectator panel missing! Re-adding...");
            checkSpectatingMode();
        }
    });
    uiObserver.observe(document.body, { childList: true, subtree: true });

    /***************** Cinematic Particle Animation (Wave) Effect *****************/
    const CONFIG = {
        PARTICLE: {
            PARTICLE_COUNT: 50,
            SPEED_MIN: 2,
            SPEED_MAX: 6,
            SIZE_MIN: 3,
            SIZE_MAX: 7,
            FADE: 0.015
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
            this.canvas.addEventListener('click', e => {
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                console.log("Local wave event triggered at:", { x, y });
                this.createParticles(x, y);
                broadcastWaveEvent(x, y);
            });
            this.startAnimation();
        }

        createParticles(x, y) {
            const palette = [
                "255, 100, 100", // red
                "255, 150, 50",  // orange
                "255, 255, 100", // yellow
                "100, 255, 100", // green
                "100, 200, 255", // blue
                "200, 100, 255"  // purple
            ];
            const baseColor = palette[Math.floor(Math.random() * palette.length)];
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
            this.particles = this.particles.filter(p => {
                p.x += p.dx;
                p.y += p.dy;
                p.alpha -= CONFIG.PARTICLE.FADE;
                if (p.alpha <= 0) return false;
                const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
                gradient.addColorStop(0, `rgba(${p.color}, ${p.alpha})`);
                gradient.addColorStop(1, `rgba(${p.color}, 0)`);
                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
                this.ctx.fill();
                return true;
            });
        }

        startAnimation() {
            const animate = () => {
                try {
                    this.renderParticles();
                } catch (err) {
                    console.error("Error in particle animation:", err);
                }
                requestAnimationFrame(animate);
            };
            animate();
        }
    }

    function attachWaveEffect() {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            if (!window.coolWaveRenderer) {
                window.coolWaveRenderer = new CoolWaveRenderer(canvas);
                console.log("Cinematic wave animation effect attached to canvas.");
            }
        } else {
            setTimeout(attachWaveEffect, 100);
        }
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attachWaveEffect);
    } else {
        attachWaveEffect();
    }

    console.log("Delta Spectator Panel & Wave Broadcast Mod is running.");
})();
