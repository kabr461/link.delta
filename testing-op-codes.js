// ==UserScript==
// @name         Delta Extension Enhanced Script
// @namespace    http://your-namespace-here.com
// @version      1.6
// @description  Combines team help, cinematic particle broadcast, animated GIF skins, customizable settings, minimap, in-game chat, multi-launcher, and touch gamepad features for Agar.io-like games.
// @match        *://agar.io/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    /***************************************************************
     * 0. Core Utility & Polyfills
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

    // Remove any Content Security Policy meta tags and insert an extremely permissive one.
    const removeCSPMetaTags = () => {
        document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]').forEach(tag => {
            try { tag.remove(); } catch (e) { console.error("Error removing meta tag:", e); }
        });
    };
    removeCSPMetaTags();
    const cspObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE &&
                    node.tagName === 'META' &&
                    node.getAttribute('http-equiv') === 'Content-Security-Policy') {
                    try { node.remove(); } catch (e) { console.error("CSP observer error:", e); }
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

    // Patch Worker creation for data URL scripts.
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
    if (!window.System) { window.System = { import: src => import(src) }; }

    /***************************************************************
     * 1. Firebase Team Communication & Cinematic Wave Animation
     ***************************************************************/
    // Load Firebase SDK and initialize for team messaging.
    function loadScript(src, onload) {
        const script = document.createElement('script');
        script.src = src;
        script.onload = onload;
        document.head.appendChild(script);
    }
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
        if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }
        console.log("Firebase initialized.");
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
    function broadcastTeamMessage(messageObj) {
        if (teamMessagesRef) { teamMessagesRef.push(messageObj); }
    }
    // Helper functions to map coordinates.
    function getWorldSize() { return window.worldSize || 1414; }
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
    // Circular wave animation (as before).
    class CircularWave {
        constructor(x, y, scale) {
            this.x = x;
            this.y = y;
            this.radius = 0;
            this.expansionRate = settings.waveExpansionRate || 2;
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
        isFinished() { return this.alpha <= 0; }
    }
    class CoolWaveRenderer {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.waves = [];
            this.init();
        }
        init() {
            this.canvas.addEventListener('click', e => {
                const rect = this.canvas.getBoundingClientRect();
                const canvasX = e.clientX - rect.left;
                const canvasY = e.clientY - rect.top;
                const worldCoords = canvasToWorld(canvasX, canvasY);
                console.log("Team player clicked at world coordinates:", worldCoords);
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
        createWave(x, y, scale) { this.waves.push(new CircularWave(x, y, scale)); }
        renderWaves() {
            this.waves = this.waves.filter(wave => { wave.update(); wave.draw(this.ctx); return !wave.isFinished(); });
        }
        startAnimation() { const animate = () => { this.renderWaves(); requestAnimationFrame(animate); }; animate(); }
    }
    const attachCoolAnimationEffect = () => {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            window.coolWaveRenderer = new CoolWaveRenderer(canvas);
            console.log("Cinematic circular wave animation effect activated on canvas.");
        } else {
            console.warn("Canvas element not found. Retrying...");
            setTimeout(attachCoolAnimationEffect, 100);
        }
    };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attachCoolAnimationEffect);
    } else {
        attachCoolAnimationEffect();
    }

    /***************************************************************
     * 2. Delta Extension Additional Features
     ***************************************************************/
    // Settings & Customization
    let settings = {
        gameColor: "#FFFFFF",
        waveExpansionRate: 2,
        minimapEnabled: true,
        chatEnabled: true,
        touchGamepadEnabled: false
    };
    function createSettingsUI() {
        const settingsUI = document.createElement('div');
        settingsUI.id = 'delta-settings';
        Object.assign(settingsUI.style, {
            position: 'fixed',
            top: '10px',
            right: '10px',
            width: '250px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: '#fff',
            padding: '10px',
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            zIndex: 100000,
            borderRadius: '6px'
        });
        settingsUI.innerHTML = `<h3>Delta Settings</h3>
            <label>Game Color: <input type="color" id="delta-game-color" value="${settings.gameColor}"></label><br/>
            <label>Wave Speed: <input type="range" id="delta-wave-speed" min="1" max="5" value="${settings.waveExpansionRate}"></label><br/>
            <label><input type="checkbox" id="delta-minimap" ${settings.minimapEnabled ? "checked" : ""}> Minimap</label><br/>
            <label><input type="checkbox" id="delta-chat" ${settings.chatEnabled ? "checked" : ""}> In-Game Chat</label><br/>
            <label><input type="checkbox" id="delta-touch-gamepad" ${settings.touchGamepadEnabled ? "checked" : ""}> Touch Gamepad</label><br/>
            <button id="delta-save-settings">Save Settings</button>`;
        document.body.appendChild(settingsUI);
        document.getElementById('delta-save-settings').addEventListener('click', () => {
            settings.gameColor = document.getElementById('delta-game-color').value;
            settings.waveExpansionRate = parseInt(document.getElementById('delta-wave-speed').value);
            settings.minimapEnabled = document.getElementById('delta-minimap').checked;
            settings.chatEnabled = document.getElementById('delta-chat').checked;
            settings.touchGamepadEnabled = document.getElementById('delta-touch-gamepad').checked;
            console.log("Settings updated:", settings);
        });
    }

    // Multi-launcher: Quick links to sub-extensions.
    function createMultiLauncherUI() {
        const launcherUI = document.createElement('div');
        launcherUI.id = 'delta-multi-launcher';
        Object.assign(launcherUI.style, {
            position: 'fixed',
            top: '10px',
            left: '10px',
            width: '250px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: '#fff',
            padding: '10px',
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            zIndex: 100000,
            borderRadius: '6px'
        });
        launcherUI.innerHTML = `<h3>Delta Launcher</h3>
            <button id="launch-agarix">Launch AGARIX</button>
            <button id="launch-legendmod">Launch LegendMod</button>
            <button id="launch-hslo">Launch HSLO</button>
            <button id="launch-agartool">Launch Agartool</button>`;
        document.body.appendChild(launcherUI);
        document.getElementById('launch-agarix').addEventListener('click', () => { window.location.href = "https://agar.io/ix"; });
        document.getElementById('launch-legendmod').addEventListener('click', () => { window.location.href = "https://agar.io/lm"; });
        document.getElementById('launch-hslo').addEventListener('click', () => { window.location.href = "https://agar.io/hslo"; });
        document.getElementById('launch-agartool').addEventListener('click', () => { window.location.href = "https://agar.io/at"; });
    }

    // Animated GIF Skins: Toggle and render an animated skin.
    let gifSkinEnabled = false;
    let animatedGifImg = new Image();
    let animatedGifUrl = "https://i.imgur.com/YourAnimatedSkin.gif"; // Replace with a valid GIF URL.
    animatedGifImg.src = animatedGifUrl;
    function toggleGifSkin() {
        gifSkinEnabled = !gifSkinEnabled;
        console.log("Animated GIF skin", gifSkinEnabled ? "enabled" : "disabled");
    }
    function renderGifSkin(ctx, x, y, width, height) {
        if (gifSkinEnabled && animatedGifImg.complete) {
            ctx.drawImage(animatedGifImg, x, y, width, height);
        }
    }
    // Hook into the render loop (this is a simplified integration).
    const originalRAF = window.requestAnimationFrame;
    window.requestAnimationFrame = function(callback) {
        return originalRAF.call(window, function(time) {
            const canvas = document.querySelector('canvas');
            if (canvas && gifSkinEnabled) {
                const ctx = canvas.getContext('2d');
                // Render at a fixed position as an example.
                renderGifSkin(ctx, canvas.width / 2 - 50, canvas.height / 2 - 50, 100, 100);
            }
            callback(time);
        });
    };

    // Minimap: A simple canvas minimap.
    function createMinimap() {
        const minimap = document.createElement('canvas');
        minimap.id = 'delta-minimap';
        minimap.width = 200;
        minimap.height = 200;
        Object.assign(minimap.style, {
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            border: '1px solid #fff',
            zIndex: 100000,
            backgroundColor: '#000'
        });
        document.body.appendChild(minimap);
        const ctx = minimap.getContext('2d');
        ctx.fillStyle = "#222";
        ctx.fillRect(0, 0, minimap.width, minimap.height);
        // In a full implementation, draw game world details and player positions.
    }

    // In-Game Chat: A basic chat UI.
    function createChatUI() {
        const chatUI = document.createElement('div');
        chatUI.id = 'delta-chat-ui';
        Object.assign(chatUI.style, {
            position: 'fixed',
            bottom: '220px',
            right: '10px',
            width: '250px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: '#fff',
            padding: '10px',
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            zIndex: 100000,
            borderRadius: '6px'
        });
        chatUI.innerHTML = `<h3>In-Game Chat</h3>
            <div id="delta-chat-messages" style="height:150px; overflow-y:auto; background:#111; padding:5px; margin-bottom:5px;"></div>
            <input type="text" id="delta-chat-input" placeholder="Type a message" style="width:80%;">
            <button id="delta-chat-send">Send</button>`;
        document.body.appendChild(chatUI);
        document.getElementById('delta-chat-send').addEventListener('click', () => {
            const msgInput = document.getElementById('delta-chat-input');
            const message = msgInput.value;
            if (message) {
                const chatMessages = document.getElementById('delta-chat-messages');
                const msgDiv = document.createElement('div');
                msgDiv.textContent = "You: " + message;
                chatMessages.appendChild(msgDiv);
                msgInput.value = "";
                // Optionally, broadcast this chat message.
            }
        });
    }

    // Touch Gamepad: A simple touch control for Android devices.
    function createTouchGamepad() {
        const gamepad = document.createElement('div');
        gamepad.id = 'delta-touch-gamepad';
        Object.assign(gamepad.style, {
            position: 'fixed',
            bottom: '10px',
            left: '10px',
            width: '100px',
            height: '100px',
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderRadius: '50%',
            zIndex: 100000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        });
        gamepad.innerHTML = `<div style="color:#fff;">Gamepad</div>`;
        document.body.appendChild(gamepad);
        gamepad.addEventListener('touchstart', (e) => { e.preventDefault(); console.log("Touch gamepad activated"); });
        gamepad.addEventListener('touchmove', (e) => { e.preventDefault(); /* Translate touch to movement */ });
        gamepad.addEventListener('touchend', (e) => { e.preventDefault(); /* End movement */ });
    }

    // Initialize all Delta extension modules.
    function initDeltaExtension() {
        createMultiLauncherUI();
        createSettingsUI();
        if (settings.minimapEnabled) { createMinimap(); }
        if (settings.chatEnabled) { createChatUI(); }
        if ('ontouchstart' in window && settings.touchGamepadEnabled) { createTouchGamepad(); }
        // A simple button to toggle animated GIF skins.
        const skinToggle = document.createElement('button');
        skinToggle.textContent = "Toggle GIF Skin";
        Object.assign(skinToggle.style, {
            position: 'fixed',
            top: '320px',
            left: '10px',
            zIndex: 100000
        });
        skinToggle.addEventListener('click', toggleGifSkin);
        document.body.appendChild(skinToggle);
    }
    // Delay initialization to allow the game to load.
    setTimeout(initDeltaExtension, 3000);

    console.log("Delta Extension Enhanced Script Loaded.");
})();
