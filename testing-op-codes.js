// ==UserScript==
// @name         Delta.io Spectator Overlay
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Enhanced spectator overlay for Delta.io
// @author       YourName
// @match        *://agar.io/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Spectator data storage
    let spectators = new Map();
    let waveCounts = new Map();

    // Create UI container
    const overlay = document.createElement('div');
    overlay.style = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0,0,0,0.7);
        color: white;
        padding: 10px;
        z-index: 9999;
        max-height: 80vh;
        overflow-y: auto;
    `;
    document.body.appendChild(overlay);

    // Function to update spectator display
    function updateSpectators() {
        overlay.innerHTML = '<h3>Spectators:</h3>';
        
        // Access Delta.io's internal spectator list (adjust based on actual Delta structure)
        const deltaSpectators = window.Delta?.spectators?.list || [];
        
        deltaSpectators.forEach(spec => {
            const specElement = document.createElement('div');
            specElement.style.margin = '5px 0';
            
            // Copy functionality
            specElement.innerHTML = `
                <div>
                    <span class="spec-name" style="cursor: pointer;">${spec.name}</span>
                    <img src="${spec.skin}" style="width: 20px; height: 20px; cursor: pointer;">
                    <span class="wave-count">Waves: ${waveCounts.get(spec.id) || 0}</span>
                </div>
            `;

            // Add click handlers
            specElement.querySelector('.spec-name').addEventListener('click', () => {
                navigator.clipboard.writeText(spec.name);
            });

            specElement.querySelector('img').addEventListener('click', () => {
                navigator.clipboard.writeText(spec.skin);
            });

            overlay.appendChild(specElement);
        });
    }

    // Track wave/ping events (requires Delta.io event hook)
    function hookDeltaPingEvents() {
        const originalPing = window.Delta?.map?.ping;
        if (originalPing) {
            window.Delta.map.ping = function(...args) {
                const specId = window.Delta.player.id; // Adjust based on actual spec ID tracking
                waveCounts.set(specId, (waveCounts.get(specId) || 0) + 1);
                updateSpectators();
                return originalPing.apply(this, args);
            };
        }
    }

    // Chat command system
    function setupChatCommands() {
        const originalSend = window.Delta?.chat?.sendMessage;
        if (originalSend) {
            window.Delta.chat.sendMessage = function(message) {
                // Command processing
                const commands = {
                    '/cmd1': 'Predefined text 1',
                    '/cmd2': 'Predefined text 2',
                    '/wave': `My wave count: ${waveCounts.get(window.Delta.player.id) || 0}`
                };

                for (const [cmd, replacement] of Object.entries(commands)) {
                    if (message.startsWith(cmd)) {
                        message = replacement;
                        break;
                    }
                }

                return originalSend.call(this, message);
            };
        }
    }

    // Initialize
    function init() {
        // Update spectators every second
        setInterval(updateSpectators, 1000);
        
        // Hook into Delta.io events
        hookDeltaPingEvents();
        setupChatCommands();
        
        // Initial update
        updateSpectators();
    }

    // Wait for Delta.io to load
    const checkDelta = setInterval(() => {
        if (window.Delta) {
            clearInterval(checkDelta);
            init();
        }
    }, 1000);
})();
