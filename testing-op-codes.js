// ==UserScript==
// @name         Delta Team Help & Cinematic Particle Broadcast + Spectator UI (World-Based)
// @namespace    http://your-namespace-here.com
// @version      1.5
// @description  Broadcasts team clicks using world coordinates so that circular waves appear at the same static map location for every spectator.
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
    
    // Use your Firebase credentials.
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
        console.log("Firebase initialized. (Ensure your domain is allowed in Firebase settings)");
        listenForTeamMessages();
    }
    
    let teamMessagesRef = null;
    function listenForTeamMessages() {
        teamMessagesRef = firebase.database().ref('team_messages');
        teamMessagesRef.on('child_added', snapshot => {
            const data = snapshot.val();
            if (!data) return;
            // Expect broadcast messages to include world coordinates as mapX and mapY.
            if (data.type === 'cool') {
                console.log("Received cinematic animation message:", data);
                if (window.coolWaveRenderer && typeof data.mapX === 'number' && typeof data.mapY === 'number') {
                    // Convert world coordinates to canvas coordinates.
                    const canvasCoords = mapToCanvas(data.mapX, data.mapY);
                    // Use world size in scaling.
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
        if (teamMessagesRef) {
            teamMessagesRef.push(messageObj);
        }
    }
    
    /***************************************************************
     * Helper: World & Spectator Coordinate Conversions
     ***************************************************************/
    // Retrieve the world size (game map size) from the game or use a default.
    function getWorldSize() {
        // If the game (agar.io or Delta) exposes the world size, use it.
        return window.worldSize || 1414; // adjust default as needed
    }
    
    // Get the spectator's view center in world coordinates.
    function getSpectatorMapCenter() {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx.getTransform) {
                const transform = ctx.getTransform();
                // We assume transform.e and transform.f are the top-left world offsets.
                return { x: transform.e + canvas.width / 2, y: transform.f + canvas.height / 2 };
            }
            return { x: canvas.width / 2, y: canvas.height / 2 };
        }
        return { x: 0, y: 0 };
    }
    
    // Convert canvas coordinates to world coordinates using current transform.
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
    
    // Convert world (map) coordinates to canvas coordinates for the spectator.
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
     * 4. Cinematic Circular Wave Animation Effect (World-Based)
     ***************************************************************/
    // CircularWave creates an expanding, fading circle.
    class CircularWave {
        constructor(x, y, scale) {
            this.x = x;
            this.y = y;
            this.radius = 0;
            this.expansionRate = 2; // Adjust expansion speed as needed.
            this.alpha = 1;
            this.maxRadius = 100 * scale; // Scale maximum radius using provided scale.
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
    
    // CoolWaveRenderer manages and animates the circular waves.
    class CoolWaveRenderer {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.waves = [];
            this.init();
        }
        init() {
            // When a team player clicks on the canvas, convert the click into world coordinates.
            this.canvas.addEventListener('click', e => {
                const rect = this.canvas.getBoundingClientRect();
                const canvasX = e.clientX - rect.left;
                const canvasY = e.clientY - rect.top;
                // Convert canvas click to world coordinates.
                const worldCoords = canvasToWorld(canvasX, canvasY);
                console.log("Team player clicked at world coordinates:", worldCoords);
                // For local display, convert world coordinates back to canvas coordinates.
                const canvasCoords = mapToCanvas(worldCoords.x, worldCoords.y);
                // Calculate scale based on distance from spectator’s view center and world size.
                const worldSize = getWorldSize();
                const viewer = getSpectatorMapCenter();
                const d = Math.sqrt((worldCoords.x - viewer.x) ** 2 + (worldCoords.y - viewer.y) ** 2);
                const scale = 1 / (0.5 + d / (worldSize / 3));
                this.createWave(canvasCoords.x, canvasCoords.y, scale);
                // Broadcast the world coordinates.
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
    
    const attachCoolAnimationEffect = () => {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            window.coolWaveRenderer = new CoolWaveRenderer(canvas);
            console.log("Cinematic circular wave animation effect activated on canvas.");
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
    let spectatorListContainer; // For updating the UI list
    
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
    
    function isSpectatorView() {
        // For this version, we assume that if the URL contains "spectate" the user is a spectator.
        return window.location.href.includes("spectate");
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
    
    console.log("Delta script with world-based spectators UI, circular wave animation, and team communication loaded.");
})();
