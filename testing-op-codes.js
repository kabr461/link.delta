// ==UserScript==
// @name         Delta Team Help & Cinematic Particle Broadcast + Spectator UI (World Coordinates)
// @namespace    http://your-namespace-here.com
// @version      1.5
// @description  Broadcasts team clicks using game world coordinates so that every spectator sees a wave at the same map position.
// @match        *://agar.io/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    /***************************************************************
     * Configuration: Define your game world size (in world units).
     * Adjust this value to match the actual game world dimensions.
     ***************************************************************/
    const WORLD_SIZE = 2000; // Example: world is 2000x2000 units.

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
    
    // Firebase configuration (updated with your credentials)
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
            // Expect broadcast messages to include world map coordinates: mapX and mapY.
            if (data.type === 'cool') {
                console.log("Received cinematic animation message:", data);
                if (window.coolWaveRenderer && typeof data.mapX === 'number' && typeof data.mapY === 'number') {
                    // Convert world coordinates to canvas coordinates.
                    const canvasCoords = mapToCanvas(data.mapX, data.mapY);
                    // Compute scale based on distance from spectator's view center.
                    const viewer = getSpectatorMapCenter();
                    const d = Math.sqrt((data.mapX - viewer.x) ** 2 + (data.mapY - viewer.y) ** 2);
                    const scale = 1 / (0.5 + d / 500);
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
     * Helper Functions: World ↔ Canvas Conversion (Using World Size)
     ***************************************************************/
    // Get the spectator's current map center in world coordinates.
    // In a real game, this might come from the game camera.
    // Here we try to use a global variable, or default to the world center.
    function getSpectatorMapCenter() {
        if (window.spectatorViewCenter) {
            return window.spectatorViewCenter;
        }
        return { x: WORLD_SIZE / 2, y: WORLD_SIZE / 2 };
    }
    
    // Convert world coordinates (mapX, mapY) into canvas coordinates.
    function mapToCanvas(mapX, mapY) {
        const canvas = document.querySelector('canvas');
        if (!canvas) return { x: mapX, y: mapY };
        // Assume a uniform scale factor where the full world width maps to canvas width.
        const scaleFactor = canvas.width / WORLD_SIZE;
        const viewer = getSpectatorMapCenter();
        // The canvas center corresponds to the viewer's map center.
        return { 
            x: canvas.width / 2 + (mapX - viewer.x) * scaleFactor,
            y: canvas.height / 2 + (mapY - viewer.y) * scaleFactor
        };
    }
    
    // Convert canvas coordinates into world coordinates.
    function canvasToMap(canvasX, canvasY) {
        const canvas = document.querySelector('canvas');
        if (!canvas) return { x: canvasX, y: canvasY };
        const scaleFactor = canvas.width / WORLD_SIZE;
        const viewer = getSpectatorMapCenter();
        return { 
            x: viewer.x + (canvasX - canvas.width / 2) / scaleFactor,
            y: viewer.y + (canvasY - canvas.height / 2) / scaleFactor
        };
    }
    
    /***************************************************************
     * 4. Cinematic Circular Wave Animation Effect (Using World Coordinates)
     ***************************************************************/
    // CircularWave: an expanding, fading circle.
    class CircularWave {
        constructor(x, y, scale) {
            this.x = x;
            this.y = y;
            this.radius = 0;
            this.expansionRate = 2; // Adjust as needed.
            this.alpha = 1;
            this.maxRadius = 100 * scale; // Maximum radius scaled.
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
    
    // CoolWaveRenderer: manages and animates waves on the canvas.
    class CoolWaveRenderer {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.waves = [];
            this.init();
        }
        init() {
            // When a team player clicks, convert canvas coordinates to world coordinates and broadcast them.
            this.canvas.addEventListener('click', e => {
                const rect = this.canvas.getBoundingClientRect();
                const canvasX = e.clientX - rect.left;
                const canvasY = e.clientY - rect.top;
                // Convert the canvas click to a world coordinate.
                const mapCoords = canvasToMap(canvasX, canvasY);
                console.log("Team player clicked at (world coordinates):", mapCoords);
                // For local display, convert back to canvas coordinates.
                const canvasCoords = mapToCanvas(mapCoords.x, mapCoords.y);
                const viewer = getSpectatorMapCenter();
                const d = Math.sqrt((mapCoords.x - viewer.x) ** 2 + (mapCoords.y - viewer.y) ** 2);
                const scale = 1 / (0.5 + d / 500);
                this.createWave(canvasCoords.x, canvasCoords.y, scale);
                // Broadcast the world map coordinates.
                broadcastTeamMessage({ type: 'cool', mapX: mapCoords.x, mapY: mapCoords.y });
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
    
    // For spectator mode, we use a simple check on the URL.
    function isSpectatorView() {
        return window.location.href.includes("spectate");
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
    
    console.log("Delta script with spectators UI, world-based circular wave animation, and team communication loaded.");
})();
