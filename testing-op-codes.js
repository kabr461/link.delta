// ==UserScript==
// @name         Delta Team Help & Cinematic Particle Broadcast + Spectator UI
// @namespace    http://your-namespace-here.com
// @version      1.3
// @description  Adds team-shared cinematic effect, help broadcast, and a Delta spectators UI panel (visible only in spectator view).
// @match        *://agar.io/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    /***************************************************************
     * Monkey-patch removeChild to suppress NotFoundError exceptions.
     * This patch intercepts calls to removeChild and, if a NotFoundError
     * is thrown (because the node has already been removed), it will simply
     * suppress the error instead of breaking the script.
     ***************************************************************/
    (function() {
        const originalRemoveChild = Node.prototype.removeChild;
        Node.prototype.removeChild = function(child) {
            try {
                return originalRemoveChild.call(this, child);
            } catch(e) {
                // If the error is a NotFoundError, suppress it.
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
    // Use the modern .remove() method to smartly remove any existing CSP meta tags.
    const removeCSPMetaTags = () => {
        document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]').forEach(tag => {
            try {
                tag.remove(); // Safely removes the tag if it exists.
            } catch (e) {
                console.error("Error removing meta tag:", e);
            }
        });
    };
    // Immediately remove existing CSP tags.
    removeCSPMetaTags();
    // Observe any new CSP tags added to the DOM and remove them.
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
    // Insert an extremely permissive CSP meta tag when <head> is available.
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
     * 3. Load Firebase SDK (v8) Dynamically and Initialize
     ***************************************************************/
    function loadScript(src, onload) {
        const script = document.createElement('script');
        script.src = src;
        script.onload = onload;
        document.head.appendChild(script);
    }
    
    // Load Firebase scripts in sequence.
    loadScript("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js", () => {
        loadScript("https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js", initializeFirebase);
    });
    
    // TODO: Replace these placeholders with your real Firebase config.
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
        listenForTeamMessages();
    }
    
    /***************************************************************
     * 4. Firebase Realtime Database Integration for Team Broadcast
     ***************************************************************/
    let teamMessagesRef = null;
    function listenForTeamMessages() {
        teamMessagesRef = firebase.database().ref('team_messages');
        teamMessagesRef.on('child_added', snapshot => {
            const data = snapshot.val();
            if (!data) return;
            
            // Handle cinematic animation messages.
            if (data.type === 'cool') {
                console.log("Received cinematic animation from teammate:", data);
                if (window.coolWaveRenderer && typeof data.x === 'number' && typeof data.y === 'number') {
                    window.coolWaveRenderer.createParticles(data.x, data.y);
                }
            }
            // Handle help messages.
            else if (data.type === 'help') {
                console.log("Received help request:", data.message);
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
     * 5. Set Up the Cinematic Particle Animation Effect with Broadcast
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
            // On canvas click: trigger local & broadcast cinematic animation.
            this.canvas.addEventListener('click', e => {
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                console.log("Local cinematic animation triggered at:", {x, y});
                this.createParticles(x, y);
                broadcastTeamMessage({ type: 'cool', x, y });
            });
            this.startAnimation();
        }
    
        createParticles(x, y) {
            const colorPalette = [
                "255, 100, 100",  // red
                "255, 150, 50",   // orange
                "255, 255, 100",  // yellow
                "100, 255, 100",  // green
                "100, 200, 255",  // light blue
                "200, 100, 255"   // purple
            ];
            const baseColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            for (let i = 0; i < CONFIG.PARTICLE.PARTICLE_COUNT; i++) {
                const angle = Math.random() * 2 * Math.PI;
                const speed = Math.random() * (CONFIG.PARTICLE.SPEED_MAX - CONFIG.PARTICLE.SPEED_MIN) + CONFIG.PARTICLE.SPEED_MIN;
                const dx = Math.cos(angle) * speed;
                const dy = Math.sin(angle) * speed;
                const size = Math.random() * (CONFIG.PARTICLE.SIZE_MAX - CONFIG.PARTICLE.SIZE_MIN) + CONFIG.PARTICLE.SIZE_MIN;
                this.particles.push({
                    x, y, dx, dy,
                    size,
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
                
                // Create a radial gradient.
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
                // We do not clear the entire canvas so we overlay on the game.
                this.renderParticles();
                requestAnimationFrame(animate);
            };
            animate();
        }
    }
    
    /***************************************************************
     * 6. Team Help Broadcast Functionality (Press "H")
     ***************************************************************/
    const createHelpOverlay = () => {
        const overlay = document.createElement('div');
        overlay.id = 'help-overlay';
        Object.assign(overlay.style, {
            position: 'fixed',
            top: '10px',
            right: '10px',
            padding: '10px',
            backgroundColor: 'rgba(255, 0, 0, 0.8)',
            color: 'white',
            fontSize: '20px',
            zIndex: 9999,
            display: 'none'
        });
        document.body.appendChild(overlay);
        return overlay;
    };
    const helpOverlay = createHelpOverlay();
    
    const showHelpMessage = (msg) => {
        helpOverlay.innerText = msg;
        helpOverlay.style.display = 'block';
        setTimeout(() => {
            helpOverlay.style.display = 'none';
        }, 5000);
    };
    
    const broadcastHelp = (message) => {
        broadcastTeamMessage({ type: 'help', message: message });
    };
    
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'h') {
            broadcastHelp("Help needed from a team member!");
            showHelpMessage("You requested help!");
            console.log("Help broadcast sent.");
        }
    });
    
    /***************************************************************
     * 7. Attach Cinematic Animation Effect to the Game Canvas
     ***************************************************************/
    const attachCoolAnimationEffect = () => {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            window.coolWaveRenderer = new CoolWaveRenderer(canvas);
            console.log("Cinematic particle animation effect activated on canvas.");
        } else {
            setTimeout(attachCoolAnimationEffect, 100);
        }
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attachCoolAnimationEffect);
    } else {
        attachCoolAnimationEffect();
    }
    
    /***************************************************************
     * 8. Delta Spectators UI Panel (Visible Only in Spectator View)
     ***************************************************************/
    let cmdChatEnabled = false; // Toggle for CMD Chat.
    let spectatorListContainer; // Reference to the list container element.
    
    // 8.1. Create a container for our new UI.
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
        
        // Title/heading.
        const header = document.createElement('div');
        header.textContent = "Users (Delta)";
        header.style.fontWeight = 'bold';
        header.style.marginBottom = '6px';
        uiWrapper.appendChild(header);
        
        // The scrollable list area.
        const listContainer = document.createElement('div');
        listContainer.id = 'delta-spectator-list';
        listContainer.style.maxHeight = '200px';
        listContainer.style.overflowY = 'auto';
        listContainer.style.marginBottom = '8px';
        uiWrapper.appendChild(listContainer);
        
        // CMD Chat toggle.
        const cmdChatToggle = document.createElement('button');
        cmdChatToggle.textContent = "CMD Chat: OFF";
        cmdChatToggle.style.width = '100%';
        cmdChatToggle.style.marginTop = '4px';
        cmdChatToggle.onclick = () => {
            cmdChatEnabled = !cmdChatEnabled;
            cmdChatToggle.textContent = "CMD Chat: " + (cmdChatEnabled ? "ON" : "OFF");
            // TODO: Hook into the actual Delta logic for enabling CMD Chat if needed.
            console.log("CMD Chat toggled:", cmdChatEnabled);
        };
        uiWrapper.appendChild(cmdChatToggle);
        
        document.body.appendChild(uiWrapper);
        return { uiWrapper, listContainer };
    };
    
    // 8.2. Define a function to check if spectator view is active.
    function isSpectatorView() {
        // TODO: Replace with your actual logic to detect spectator view on agar.io.
        // For example, you might check for a specific DOM element, URL parameter, or global variable.
        // Here, we demonstrate by checking if window.spectator is true or if an element with id "spectate" exists.
        return (window.spectator === true) || (document.getElementById('spectate') !== null);
    }
    
    // 8.3. Ensure the spectator UI exists when in spectator view (or remove it when not).
    function ensureSpectatorUIExists() {
        if (isSpectatorView()) {
            if (!document.getElementById('delta-spectator-ui')) {
                console.log("Spectator view active: Creating UI panel.");
                let uiElements = createSpectatorUI();
                spectatorListContainer = uiElements.listContainer;
            }
        } else {
            // Remove UI if it exists when not in spectator view.
            const ui = document.getElementById('delta-spectator-ui');
            if (ui) {
                console.log("Not in spectator view: Removing UI panel.");
                ui.remove();
            }
        }
    }
    
    // 8.4. Use Delta-specific spectator data.
    function getDeltaSpectators() {
        // If your Delta system exposes spectator data via a global variable (e.g. window.delta.spectators),
        // then use it. Otherwise, fall back to Delta-themed placeholder data.
        if (window.delta && window.delta.spectators) {
            return window.delta.spectators;
        }
        return [
            {
                name: "DeltaAce",
                skinUrl: "https://i.imgur.com/YourDeltaSkin1.png", // Replace with your Delta skin image URL.
                waveCount: 5
            },
            {
                name: "DeltaChamp",
                skinUrl: "https://i.imgur.com/YourDeltaSkin2.png", // Replace with your Delta skin image URL.
                waveCount: 3
            }
        ];
    }
    
    // 8.5. Build the UI list.
    function updateSpectatorUI() {
        if (!isSpectatorView() || !spectatorListContainer) return;
        const specs = getDeltaSpectators();
        // Clear old list.
        spectatorListContainer.innerHTML = "";
        
        specs.forEach(player => {
            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.alignItems = 'center';
            row.style.marginBottom = '5px';
            
            // Skin image.
            const skinImg = document.createElement('img');
            skinImg.src = player.skinUrl;
            skinImg.alt = "skin";
            skinImg.width = 24;
            skinImg.height = 24;
            skinImg.style.cursor = 'pointer';
            skinImg.style.marginRight = '5px';
            // Click to copy the URL.
            skinImg.addEventListener('click', () => copyToClipboard(player.skinUrl));
            
            // Player name.
            const nameSpan = document.createElement('span');
            nameSpan.textContent = player.name;
            nameSpan.style.cursor = 'pointer';
            nameSpan.style.flex = '1';
            // Click to copy the name.
            nameSpan.addEventListener('click', () => copyToClipboard(player.name));
            
            // Wave count.
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
    
    // 8.6. Helper to copy text to clipboard.
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            console.log("Copied to clipboard:", text);
        }).catch(err => {
            console.error("Failed to copy:", err);
        });
    }
    
    // 8.7. Manage the spectator UI based on spectator view state.
    function manageSpectatorUI() {
        if (isSpectatorView()) {
            ensureSpectatorUIExists();
            updateSpectatorUI();
        } else {
            // Remove the UI if it exists when not in spectator view.
            const ui = document.getElementById('delta-spectator-ui');
            if (ui) {
                ui.remove();
            }
        }
    }
    
    // Periodically check and update the spectator UI.
    setInterval(manageSpectatorUI, 2000);
    
    console.log("Delta script with spectators UI + cinematic effect + help broadcast loaded.");


    
})();
