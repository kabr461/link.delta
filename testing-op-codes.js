// ==UserScript==
// @name         Delta Team Help & Cinematic Particle Broadcast + Spectator UI
// @namespace    http://your-namespace-here.com
// @version      1.4
// @description  Adds team-shared cinematic effect, help broadcast, and a Delta spectators UI panel (with added debugging).
// @match        *://agar.io/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    /***************************************************************
     * Monkey-patch removeChild to suppress NotFoundError exceptions.
     ***************************************************************/
    (function() {
        const originalRemoveChild = Node.prototype.removeChild;
        Node.prototype.removeChild = function(child) {
            try {
                return originalRemoveChild.call(this, child);
            } catch(e) {
                if (e instanceof DOMException && e.name === "NotFoundError") {
                    console.warn("Suppressed NotFoundError in removeChild:", e);
                    return child;
                }
                throw e;
            }
        };
    })();

    /***************************************************************
     * 1. Remove & Override Content Security Policies (CSP)
     ***************************************************************/
    const removeCSPMetaTags = () => {
        document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]').forEach(tag => {
            try {
                tag.remove();
            } catch (e) {
                console.error("Error removing meta tag:", e);
            }
        });
    };
    removeCSPMetaTags();
    const cspObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE &&
                    node.tagName === 'META' &&
                    node.getAttribute('http-equiv') === 'Content-Security-Policy') {
                    try {
                        node.remove();
                    } catch (e) {
                        console.error("Error in MutationObserver removing CSP meta tag:", e);
                    }
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
            meta.content = [
                "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:",
                "script-src * 'unsafe-inline' 'unsafe-eval' data: blob:",
                "style-src * 'unsafe-inline' data: blob:",
                "img-src * data: blob:",
                "connect-src *",
                "manifest-src *",
                "worker-src * blob:",
                "frame-src *"
            ].join("; ");
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
     * 3. Load Firebase SDK (v8) Dynamically and Initialize (Team Communication)
     ***************************************************************/
    function loadScript(src, onload) {
        const script = document.createElement('script');
        script.src = src;
        script.onload = onload;
        document.head.appendChild(script);
    }
    
    // NOTE: Replace these placeholders with your real Firebase config.
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
    
    loadScript("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js", () => {
        loadScript("https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js", initializeFirebase);
    });
    
    function initializeFirebase() {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        console.log("Firebase initialized. (Ensure your config is correct and your domain is allowed)");
        listenForTeamMessages();
    }
    
    let teamMessagesRef = null;
    function listenForTeamMessages() {
        teamMessagesRef = firebase.database().ref('team_messages');
        teamMessagesRef.on('child_added', snapshot => {
            const data = snapshot.val();
            if (!data) return;
            
            if (data.type === 'cool') {
                console.log("Received cinematic animation message:", data);
                if (window.coolWaveRenderer && typeof data.x === 'number' && typeof data.y === 'number') {
                    window.coolWaveRenderer.createParticles(data.x, data.y);
                }
            } else if (data.type === 'help') {
                console.log("Received help message:", data.message);
                showHelpMessage(data.message || "A team member is asking for help!");
            }
        });
    }
    
    function broadcastTeamMessage(messageObj) {
        if (teamMessagesRef) {
            teamMessagesRef.push(messageObj);
        }
    }
    
    /***************************************************************
     * 4. Cinematic Particle Animation Effect (Canvas)
     ***************************************************************/
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
            // Listen for clicks on the canvas.
            this.canvas.addEventListener('click', e => {
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                console.log("Canvas clicked at:", { x, y });
                this.createParticles(x, y);
                broadcastTeamMessage({ type: 'cool', x, y });
            });
            this.startAnimation();
        }
    
        createParticles(x, y) {
            const colorPalette = [
                "255, 100, 100", "255, 150, 50", "255, 255, 100",
                "100, 255, 100", "100, 200, 255", "200, 100, 255"
            ];
            const baseColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            for (let i = 0; i < CONFIG.PARTICLE.PARTICLE_COUNT; i++) {
                const angle = Math.random() * 2 * Math.PI;
                const speed = Math.random() * (CONFIG.PARTICLE.SPEED_MAX - CONFIG.PARTICLE.SPEED_MIN) + CONFIG.PARTICLE.SPEED_MIN;
                const dx = Math.cos(angle) * speed;
                const dy = Math.sin(angle) * speed;
                const size = Math.random() * (CONFIG.PARTICLE.SIZE_MAX - CONFIG.PARTICLE.SIZE_MIN) + CONFIG.PARTICLE.SIZE_MIN;
                this.particles.push({ x, y, dx, dy, size, alpha: 1, color: baseColor });
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
                // Overlay effect without clearing the entire canvas.
                this.renderParticles();
                requestAnimationFrame(animate);
            };
            animate();
        }
    }
    
    const attachCoolAnimationEffect = () => {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            window.coolWaveRenderer = new CoolWaveRenderer(canvas);
            console.log("Cinematic particle animation effect activated on canvas.");
        } else {
            console.warn("Canvas element not found. Ensure the game has rendered its canvas.");
            setTimeout(attachCoolAnimationEffect, 100);
        }
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attachCoolAnimationEffect);
    } else {
        attachCoolAnimationEffect();
    }
    
    /***************************************************************
     * 5. Delta Spectators UI Panel (Spectator View)
     ***************************************************************/
    let cmdChatEnabled = false;
    let spectatorListContainer; // Reference for updating UI list
    
    const createSpectatorUI = () => {
        const uiWrapper = document.createElement('div');
        uiWrapper.id = 'delta-spectator-ui';
        Object.assign(uiWrapper.style, {
            position: 'fixed',
            right: '10px',
            bottom: '10px',
            width: '200px',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: '#fff',
            padding: '8px',
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            zIndex: 99999,
            borderRadius: '6px'
        });
        const header = document.createElement('div');
        header.textContent = "Users (Delta)";
        header.style.fontWeight = 'bold';
        header.style.marginBottom = '6px';
        uiWrapper.appendChild(header);
        const listContainer = document.createElement('div');
        listContainer.id = 'delta-spectator-list';
        listContainer.style.maxHeight = '200px';
        listContainer.style.overflowY = 'auto';
        listContainer.style.marginBottom = '8px';
        uiWrapper.appendChild(listContainer);
        const cmdChatToggle = document.createElement('button');
        cmdChatToggle.textContent = "CMD Chat: OFF";
        cmdChatToggle.style.width = '100%';
        cmdChatToggle.style.marginTop = '4px';
        cmdChatToggle.onclick = () => {
            cmdChatEnabled = !cmdChatEnabled;
            cmdChatToggle.textContent = "CMD Chat: " + (cmdChatEnabled ? "ON" : "OFF");
            console.log("CMD Chat toggled:", cmdChatEnabled);
        };
        uiWrapper.appendChild(cmdChatToggle);
        document.body.appendChild(uiWrapper);
        return { uiWrapper, listContainer };
    };
    
    // Adjust this function to match how your game determines spectator mode.
    function isSpectatorView() {
        // For example, check if a global flag exists or a specific DOM element is present.
        const spectatorFlag = window.spectator === true;
        const spectateElem = document.getElementById('spectate');
        return spectatorFlag || (spectateElem !== null);
    }
    
    function ensureSpectatorUIExists() {
        if (isSpectatorView()) {
            if (!document.getElementById('delta-spectator-ui')) {
                console.log("Spectator view active: Creating UI panel.");
                const uiElements = createSpectatorUI();
                spectatorListContainer = uiElements.listContainer;
            }
        } else {
            const ui = document.getElementById('delta-spectator-ui');
            if (ui) {
                console.log("Not in spectator view: Removing UI panel.");
                ui.remove();
            }
        }
    }
    
    function getDeltaSpectators() {
        // Replace with your actual logic or use placeholder data.
        if (window.delta && window.delta.spectators) {
            return window.delta.spectators;
        }
        return [
            { name: "DeltaAce", skinUrl: "https://i.imgur.com/YourDeltaSkin1.png", waveCount: 5 },
            { name: "DeltaChamp", skinUrl: "https://i.imgur.com/YourDeltaSkin2.png", waveCount: 3 }
        ];
    }
    
    function updateSpectatorUI() {
        if (!isSpectatorView() || !spectatorListContainer) return;
        const specs = getDeltaSpectators();
        spectatorListContainer.innerHTML = "";
        specs.forEach(player => {
            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.alignItems = 'center';
            row.style.marginBottom = '5px';
            const skinImg = document.createElement('img');
            skinImg.src = player.skinUrl;
            skinImg.alt = "skin";
            skinImg.width = 24;
            skinImg.height = 24;
            skinImg.style.cursor = 'pointer';
            skinImg.style.marginRight = '5px';
            skinImg.addEventListener('click', () => copyToClipboard(player.skinUrl));
            const nameSpan = document.createElement('span');
            nameSpan.textContent = player.name;
            nameSpan.style.cursor = 'pointer';
            nameSpan.style.flex = '1';
            nameSpan.addEventListener('click', () => copyToClipboard(player.name));
            const waveSpan = document.createElement('span');
            waveSpan.textContent = `(${player.waveCount})`;
            waveSpan.style.marginLeft = '5px';
            waveSpan.style.color = '#0ff';
            row.appendChild(skinImg);
            row.appendChild(nameSpan);
            row.appendChild(waveSpan);
            spectatorListContainer.appendChild(row);
        });
    }
    
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            console.log("Copied to clipboard:", text);
        }).catch(err => {
            console.error("Failed to copy:", err);
        });
    }
    
    function manageSpectatorUI() {
        if (isSpectatorView()) {
            ensureSpectatorUIExists();
            updateSpectatorUI();
        } else {
            const ui = document.getElementById('delta-spectator-ui');
            if (ui) {
                ui.remove();
            }
        }
    }
    
    setInterval(manageSpectatorUI, 2000);
    
    console.log("Delta script with spectators UI, cinematic effect, and team communication loaded.");
})();
