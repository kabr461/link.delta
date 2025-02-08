// ==UserScript==
// @name         Delta-Style Extension with Minimap, Chat & Animated Skins
// @namespace    http://your-namespace-here.com
// @version      2.0
// @description  Enhanced team help, cinematic waves, spectator UI with minimap and in-game chat. Includes animated GIF skins support (hooked as a placeholder).
// @match        *://agar.io/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    /***************************************************************
     * 0. Utility Patches & CSP Bypass
     ***************************************************************/
    // Patch removeChild to suppress NotFoundError exceptions.
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

    // Remove and override Content Security Policies (CSP)
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

    // Patch Worker creation to allow data URLs.
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
     * 1. Firebase Initialization (for team messages and chat)
     ***************************************************************/
    function loadScript(src, onload) {
        const script = document.createElement('script');
        script.src = src;
        script.onload = onload;
        document.head.appendChild(script);
    }
    
    // Replace these with your Firebase credentials.
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
        console.log("Firebase initialized.");
        listenForTeamMessages();
        listenForChatMessages();
    }
    
    let teamMessagesRef = null;
    let chatMessagesRef = null;
    
    function listenForTeamMessages() {
        teamMessagesRef = firebase.database().ref('team_messages');
        teamMessagesRef.on('child_added', snapshot => {
            const data = snapshot.val();
            if (!data) return;
            if (data.type === 'cool') {
                console.log("Received cinematic wave message:", data);
                if (window.coolWaveRenderer && typeof data.mapX === 'number' && typeof data.mapY === 'number') {
                    const canvasCoords = mapToCanvas(data.mapX, data.mapY);
                    const worldSize = getWorldSize();
                    const viewer = getSpectatorMapCenter();
                    const d = Math.sqrt((data.mapX - viewer.x) ** 2 + (data.mapY - viewer.y) ** 2);
                    const scale = 1 / (0.5 + d / (worldSize / 3));
                    window.coolWaveRenderer.createWave(canvasCoords.x, canvasCoords.y, scale);
                }
            } else if (data.type === 'help') {
                console.log("Received help message:", data.message);
                showHelpMessage(data.message || "A team member is asking for help!");
            }
        });
    }
    
    function listenForChatMessages() {
        chatMessagesRef = firebase.database().ref('chat_messages');
        chatMessagesRef.on('child_added', snapshot => {
            const data = snapshot.val();
            if (!data) return;
            addChatMessage(data.sender, data.message);
        });
    }
    
    function broadcastTeamMessage(messageObj) {
        if (teamMessagesRef) {
            teamMessagesRef.push(messageObj);
        }
    }
    
    function broadcastChatMessage(sender, message) {
        if (chatMessagesRef) {
            chatMessagesRef.push({ sender, message });
        }
    }
    
    /***************************************************************
     * 2. Coordinate Helpers (Canvas & World)
     ***************************************************************/
    function getWorldSize() {
        // Use game-defined world size if available; otherwise, a default.
        return window.worldSize || 1414;
    }
    
    function getSpectatorMapCenter() {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx.getTransform) {
                const transform = ctx.getTransform();
                return { x: transform.e + canvas.width / 2, y: transform.f + canvas.height / 2 };
            }
            return { x: canvas.width / 2, y: canvas.height / 2 };
        }
        return { x: 0, y: 0 };
    }
    
    function canvasToWorld(canvasX, canvasY) {
        const canvas = document.querySelector('canvas');
        if (!canvas) return { x: canvasX, y: canvasY };
        const ctx = canvas.getContext('2d');
        const transform = ctx.getTransform ? ctx.getTransform() : { a: 1, d: 1, e: 0, f: 0 };
        const viewer = getSpectatorMapCenter();
        return {
            x: viewer.x + (canvasX - canvas.width / 2) / transform.a,
            y: viewer.y + (canvasY - canvas.height / 2) / transform.d
        };
    }
    
    function mapToCanvas(mapX, mapY) {
        const canvas = document.querySelector('canvas');
        if (!canvas) return { x: mapX, y: mapY };
        const ctx = canvas.getContext('2d');
        const transform = ctx.getTransform ? ctx.getTransform() : { a: 1, d: 1 };
        const viewer = getSpectatorMapCenter();
        return {
            x: (mapX - viewer.x) * transform.a + canvas.width / 2,
            y: (mapY - viewer.y) * transform.d + canvas.height / 2
        };
    }
    
    /***************************************************************
     * 3. Cinematic Circular Wave Animation Effect
     ***************************************************************/
    class CircularWave {
        constructor(x, y, scale) {
            this.x = x;
            this.y = y;
            this.radius = 0;
            this.expansionRate = 2;
            this.alpha = 1;
            this.maxRadius = 100 * scale;
        }
        update() {
            this.radius += this.expansionRate;
            this.alpha = Math.max(0, 1 - this.radius / this.maxRadius);
        }
        draw(ctx) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.strokeStyle = `rgba(255,255,255,${this.alpha})`;
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();
        }
        isFinished() {
            return this.alpha <= 0;
        }
    }
    
    class CoolWaveRenderer {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.waves = [];
            this.init();
        }
        init() {
            // When the canvas is clicked, calculate world coordinates and broadcast a wave.
            this.canvas.addEventListener('click', e => {
                const rect = this.canvas.getBoundingClientRect();
                const canvasX = e.clientX - rect.left;
                const canvasY = e.clientY - rect.top;
                const worldCoords = canvasToWorld(canvasX, canvasY);
                console.log("Player clicked at world coordinates:", worldCoords);
                const canvasCoords = mapToCanvas(worldCoords.x, worldCoords.y);
                const worldSize = getWorldSize();
                const viewer = getSpectatorMapCenter();
                const d = Math.sqrt((worldCoords.x - viewer.x) ** 2 + (worldCoords.y - viewer.y) ** 2);
                const scale = 1 / (0.5 + d / (worldSize / 3));
                this.createWave(canvasCoords.x, canvasCoords.y, scale);
                broadcastTeamMessage({ type: 'cool', mapX: worldCoords.x, mapY: worldCoords.y });
            });
            this.startAnimation();
        }
        createWave(x, y, scale) {
            this.waves.push(new CircularWave(x, y, scale));
        }
        renderWaves() {
            this.waves = this.waves.filter(wave => {
                wave.update();
                wave.draw(this.ctx);
                return !wave.isFinished();
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
    
    function attachCoolAnimationEffect() {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            window.coolWaveRenderer = new CoolWaveRenderer(canvas);
            console.log("Cinematic circular wave animation activated.");
        } else {
            console.warn("Canvas element not found. Retrying...");
            setTimeout(attachCoolAnimationEffect, 100);
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attachCoolAnimationEffect);
    } else {
        attachCoolAnimationEffect();
    }
    
    /***************************************************************
     * 4. Spectator UI Panel (Users List + CMD Chat Toggle)
     ***************************************************************/
    let cmdChatEnabled = false;
    let spectatorListContainer;
    
    function createSpectatorUI() {
        const uiWrapper = document.createElement('div');
        uiWrapper.id = 'delta-spectator-ui';
        Object.assign(uiWrapper.style, {
            position: 'fixed',
            right: '10px',
            bottom: '10px',
            width: '220px',
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
        // Replace with real spectator data if available.
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
    
    function isSpectatorView() {
        // For this version, we assume the URL includes "spectate" for spectator mode.
        return window.location.href.includes("spectate");
    }
    
    function manageSpectatorUI() {
        if (isSpectatorView()) {
            ensureSpectatorUIExists();
            updateSpectatorUI();
        } else {
            const ui = document.getElementById('delta-spectator-ui');
            if (ui) ui.remove();
        }
    }
    
    setInterval(manageSpectatorUI, 2000);
    
    /***************************************************************
     * 5. In-Game Chat Panel
     ***************************************************************/
    function createChatPanel() {
        const chatWrapper = document.createElement('div');
        chatWrapper.id = 'delta-chat-ui';
        Object.assign(chatWrapper.style, {
            position: 'fixed',
            left: '10px',
            bottom: '10px',
            width: '300px',
            height: '250px',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: '#fff',
            padding: '8px',
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            zIndex: 99999,
            borderRadius: '6px',
            display: 'flex',
            flexDirection: 'column'
        });
        
        const header = document.createElement('div');
        header.textContent = "In-Game Chat";
        header.style.fontWeight = 'bold';
        header.style.marginBottom = '4px';
        chatWrapper.appendChild(header);
        
        const messagesContainer = document.createElement('div');
        messagesContainer.id = 'delta-chat-messages';
        messagesContainer.style.flex = '1';
        messagesContainer.style.overflowY = 'auto';
        messagesContainer.style.marginBottom = '4px';
        chatWrapper.appendChild(messagesContainer);
        
        const inputWrapper = document.createElement('div');
        inputWrapper.style.display = 'flex';
        const chatInput = document.createElement('input');
        chatInput.type = 'text';
        chatInput.placeholder = "Type a message...";
        chatInput.style.flex = '1';
        const sendButton = document.createElement('button');
        sendButton.textContent = "Send";
        sendButton.style.marginLeft = '4px';
        sendButton.onclick = () => {
            const message = chatInput.value.trim();
            if (message) {
                broadcastChatMessage("Player", message);
                chatInput.value = "";
            }
        };
        inputWrapper.appendChild(chatInput);
        inputWrapper.appendChild(sendButton);
        chatWrapper.appendChild(inputWrapper);
        
        document.body.appendChild(chatWrapper);
    }
    
    function addChatMessage(sender, message) {
        const messagesContainer = document.getElementById('delta-chat-messages');
        if (!messagesContainer) return;
        const msgRow = document.createElement('div');
        msgRow.textContent = `${sender}: ${message}`;
        messagesContainer.appendChild(msgRow);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // Show chat panel only in spectator mode (or modify as needed)
    function manageChatPanel() {
        if (isSpectatorView()) {
            if (!document.getElementById('delta-chat-ui')) {
                createChatPanel();
            }
        } else {
            const chatUI = document.getElementById('delta-chat-ui');
            if (chatUI) chatUI.remove();
        }
    }
    
    setInterval(manageChatPanel, 2000);
    
    /***************************************************************
     * 6. Minimap Integration with Animated GIF Skin Support (Placeholder)
     ***************************************************************/
    function createMinimap() {
        const minimapWrapper = document.createElement('div');
        minimapWrapper.id = 'delta-minimap-ui';
        Object.assign(minimapWrapper.style, {
            position: 'fixed',
            left: '10px',
            top: '10px',
            width: '200px',
            height: '200px',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid #fff',
            zIndex: 99999,
            borderRadius: '4px'
        });
        const minimapCanvas = document.createElement('canvas');
        minimapCanvas.width = 200;
        minimapCanvas.height = 200;
        minimapCanvas.id = 'delta-minimap-canvas';
        minimapWrapper.appendChild(minimapCanvas);
        document.body.appendChild(minimapWrapper);
        return minimapCanvas;
    }
    
    // Dummy function to retrieve players data.
    function getPlayersData() {
        // In a real scenario, hook into game state to get actual positions and skin URLs.
        return [
            { name: "DeltaAce", x: 200, y: 300, skinUrl: "https://i.imgur.com/YourDeltaSkin1.png" },
            { name: "DeltaChamp", x: 600, y: 800, skinUrl: "https://i.imgur.com/YourDeltaSkin2.png" }
        ];
    }
    
    function updateMinimap() {
        const canvas = document.getElementById('delta-minimap-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        // Clear minimap.
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background (for example, a simple grid or plain color).
        ctx.fillStyle = 'rgba(20,20,20,0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Assume world size is known.
        const worldSize = getWorldSize();
        const players = getPlayersData();
        
        players.forEach(player => {
            // Map player's world position to minimap coordinates.
            const miniX = (player.x / worldSize) * canvas.width;
            const miniY = (player.y / worldSize) * canvas.height;
            
            // Draw a circle for the player.
            ctx.beginPath();
            ctx.arc(miniX, miniY, 5, 0, 2 * Math.PI);
            ctx.fillStyle = '#0ff';
            ctx.fill();
            
            // For animated GIF skins: as a placeholder, draw the image.
            if (player.skinUrl) {
                const img = new Image();
                img.src = player.skinUrl;
                // Draw the skin image on the minimap.
                img.onload = () => {
                    ctx.drawImage(img, miniX - 10, miniY - 10, 20, 20);
                };
            }
        });
    }
    
    function manageMinimap() {
        // Show minimap only in spectator view (or always, as desired).
        if (isSpectatorView()) {
            if (!document.getElementById('delta-minimap-ui')) {
                createMinimap();
            }
            updateMinimap();
        } else {
            const mini = document.getElementById('delta-minimap-ui');
            if (mini) mini.remove();
        }
    }
    
    setInterval(manageMinimap, 2000);
    
    /***************************************************************
     * 7. Helper: Show Help Message
     ***************************************************************/
    function showHelpMessage(message) {
        alert(message);
    }
    
    console.log("Delta-style extension loaded with cinematic waves, spectator UI, chat and minimap.");
})();
