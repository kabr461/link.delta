// ==UserScript==
// @name         Delta Team Help & Cinematic Particle Broadcast + Spectator UI + CMD Chat
// @namespace    http://your-namespace-here.com
// @version      1.4
// @description  Adds team-shared cinematic effect, help broadcast, a Delta spectators UI panel (visible only in spectator view), and a basic CMD Chat hook.
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
            
            // Cinematic animation messages.
            if (data.type === 'cool') {
                console.log("Received cinematic animation from teammate:", data);
                if (window.coolWaveRenderer && typeof data.x === 'number' && typeof data.y === 'number') {
                    window.coolWaveRenderer.createParticles(data.x, data.y);
                }
            }
            // Help messages.
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
                // Overlay particles without fully clearing the canvas.
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
    
    // 8.1. Create the spectator UI container.
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
        
        // Header.
        const header = document.createElement('div');
        header.textContent = "Users (Delta)";
        header.style.fontWeight = 'bold';
        header.style.marginBottom = '6px';
        uiWrapper.appendChild(header);
        
        // Scrollable list container.
        const listContainer = document.createElement('div');
        listContainer.id = 'delta-spectator-list';
        listContainer.style.maxHeight = '200px';
        listContainer.style.overflowY = 'auto';
        listContainer.style.marginBottom = '8px';
        uiWrapper.appendChild(listContainer);
        
        // CMD Chat toggle button.
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
    
    // 8.2. Check if spectator view is active.
    function isSpectatorView() {
        // TODO: Replace with your actual logic to detect spectator view on agar.io.
        return (window.spectator === true) || (document.getElementById('spectate') !== null);
    }
    
    // 8.3. Create or remove the spectator UI based on spectator view state.
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
    
    // 8.4. Fetch Delta spectator data (from Delta developer tools if available).
    function getDeltaSpectators() {
        if (window.delta && window.delta.spectators) {
            return window.delta.spectators;
        }
        // Sample data matching your outlined UI (with names "naze" and "Hook").
        return [
            {
                name: "naze",
                skinUrl: "https://i.imgur.com/YourDeltaSkin1.png", // Replace with your actual Delta skin URL.
                waveCount: 7
            },
            {
                name: "Hook",
                skinUrl: "https://i.imgur.com/YourDeltaSkin2.png", // Replace with your actual Delta skin URL.
                waveCount: 4
            }
        ];
    }
    
    // 8.5. Build the UI list.
    function updateSpectatorUI() {
        if (!isSpectatorView() || !spectatorListContainer) return;
        const specs = getDeltaSpectators();
        spectatorListContainer.innerHTML = "";
        
        specs.forEach(player => {
            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.alignItems = 'center';
            row.style.marginBottom = '5px';
            
            // Skin image element.
            const skinImg = document.createElement('img');
            skinImg.src = player.skinUrl;
            skinImg.alt = "skin";
            skinImg.width = 24;
            skinImg.height = 24;
            skinImg.style.cursor = 'pointer';
            skinImg.style.marginRight = '5px';
            skinImg.addEventListener('click', () => copyToClipboard(player.skinUrl));
            
            // Player name element.
            const nameSpan = document.createElement('span');
            nameSpan.textContent = player.name;
            nameSpan.style.cursor = 'pointer';
            nameSpan.style.flex = '1';
            nameSpan.addEventListener('click', () => copyToClipboard(player.name));
            
            // Wave count element.
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
    
    // 8.6. Clipboard helper.
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            console.log("Copied to clipboard:", text);
        }).catch(err => {
            console.error("Failed to copy:", err);
        });
    }
    
    // 8.7. Manage the spectator UI state.
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
    
    console.log("Delta script with spectators UI, cinematic effect, help broadcast, and CMD chat loaded.");
    
    /***************************************************************
     * 9. CMD Chat Integration (Basic Hook)
     ***************************************************************/
    // Placeholder function to process CMD chat messages.
    function processCMDChat(message) {
        // Implement your custom CMD chat logic here.
        console.log("Processing CMD chat message:", message);
        // For example, you could parse prefixes or commands and transform the text.
        return message;
    }
    
    // Attach CMD Chat handler once a chat input element appears.
    function attachCMDChatHandler() {
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            chatInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && cmdChatEnabled) {
                    e.preventDefault();
                    let msg = chatInput.value;
                    msg = processCMDChat(msg);
                    // TODO: Replace this with your actual method for sending CMD chat messages.
                    console.log("CMD Chat message sent:", msg);
                    chatInput.value = "";
                }
            });
            console.log("CMD Chat handler attached.");
        }
    }
    // Periodically check for the chat input element.
    const chatInputInterval = setInterval(() => {
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            attachCMDChatHandler();
            clearInterval(chatInputInterval);
        }
    }, 1000);

})();
