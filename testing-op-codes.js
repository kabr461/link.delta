// ==UserScript==
// @name         Delta.io Spectator Overlay Enhanced
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Enhanced spectator overlay for Delta.io with extra chat commands and improved error handling
// @author       YourName
// @match        *://agar.io/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Maps to store spectator-related data.
    const waveCounts = new Map();

    // Create and style the overlay container.
    const overlay = document.createElement('div');
    overlay.id = 'delta-spectator-overlay';
    Object.assign(overlay.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '10px',
        zIndex: '9999',
        maxHeight: '80vh',
        overflowY: 'auto',
        fontFamily: 'Arial, sans-serif'
    });
    document.body.appendChild(overlay);

    // Update the spectator display.
    function updateSpectators() {
        // Clear current content.
        overlay.innerHTML = '<h3 style="margin-top: 0;">Spectators:</h3>';
        
        // Read the spectator list from Delta.io’s internals.
        // Adjust the reference if needed.
        const deltaSpectators = window.Delta?.spectators?.list || [];

        deltaSpectators.forEach(spec => {
            const specId = spec.id;
            const waveCount = waveCounts.get(specId) || 0;
            
            // Create a container for each spectator.
            const specElement = document.createElement('div');
            specElement.style.margin = '5px 0';
            specElement.style.display = 'flex';
            specElement.style.alignItems = 'center';

            // Name element – click to copy the spectator name.
            const nameElement = document.createElement('span');
            nameElement.textContent = spec.name;
            nameElement.style.cursor = 'pointer';
            nameElement.style.marginRight = '10px';
            nameElement.title = 'Click to copy name';
            nameElement.addEventListener('click', () => {
                navigator.clipboard.writeText(spec.name)
                    .then(() => console.log('Name copied to clipboard.'))
                    .catch(err => console.error('Failed to copy name:', err));
            });

            // Skin image – click to copy the skin URL.
            const imgElement = document.createElement('img');
            imgElement.src = spec.skin;
            imgElement.style.width = '20px';
            imgElement.style.height = '20px';
            imgElement.style.cursor = 'pointer';
            imgElement.style.marginRight = '10px';
            imgElement.title = 'Click to copy skin URL';
            imgElement.addEventListener('click', () => {
                navigator.clipboard.writeText(spec.skin)
                    .then(() => console.log('Skin URL copied to clipboard.'))
                    .catch(err => console.error('Failed to copy skin URL:', err));
            });

            // Display wave count.
            const waveElement = document.createElement('span');
            waveElement.textContent = `Waves: ${waveCount}`;

            // Assemble the spectator element.
            specElement.append(nameElement, imgElement, waveElement);
            overlay.appendChild(specElement);
        });
    }

    // Hook into Delta.io's ping/wave events for tracking.
    function hookDeltaPingEvents() {
        try {
            const originalPing = window.Delta?.map?.ping;
            if (typeof originalPing === 'function') {
                window.Delta.map.ping = function(...args) {
                    // Update wave count for the current player/spectator.
                    // Adjust the spectator identification logic as needed.
                    const specId = window.Delta?.player?.id;
                    if (specId) {
                        waveCounts.set(specId, (waveCounts.get(specId) || 0) + 1);
                    }
                    // Refresh the overlay.
                    updateSpectators();
                    return originalPing.apply(this, args);
                };
                console.log('Delta.map.ping successfully hooked.');
            } else {
                console.warn('Delta.map.ping not found. Wave tracking disabled.');
            }
        } catch (err) {
            console.error('Error hooking into Delta.map.ping:', err);
        }
    }

    // Enhance the chat command system.
    function setupChatCommands() {
        try {
            const originalSend = window.Delta?.chat?.sendMessage;
            if (typeof originalSend === 'function') {
                window.Delta.chat.sendMessage = function(message) {
                    // Map of chat commands to their replacements.
                    const commands = {
                        '/cmd1': 'Predefined text 1',
                        '/cmd2': 'Predefined text 2',
                        '/wave': `My wave count: ${waveCounts.get(window.Delta?.player?.id) || 0}`,
                        '/hello': 'Hello everyone!',
                        '/status': 'Spectator overlay is active!'
                    };

                    // Replace the message if it matches a command.
                    for (const [cmd, replacement] of Object.entries(commands)) {
                        if (message.startsWith(cmd)) {
                            message = replacement;
                            break;
                        }
                    }
                    return originalSend.call(this, message);
                };
                console.log('Chat commands successfully hooked.');
            } else {
                console.warn('Delta.chat.sendMessage not found. Chat command enhancements disabled.');
            }
        } catch (err) {
            console.error('Error setting up chat commands:', err);
        }
    }

    // Main initialization.
    function init() {
        // Refresh the spectator list every second.
        setInterval(updateSpectators, 1000);
        // Hook event listeners and chat commands.
        hookDeltaPingEvents();
        setupChatCommands();
        // Initial update.
        updateSpectators();
    }

    // Wait for Delta.io to load before initializing.
    const checkDelta = setInterval(() => {
        if (window.Delta) {
            clearInterval(checkDelta);
            init();
        }
    }, 1000);

    console.log('Delta.io Spectator Overlay Enhanced script loaded.');
})();
