// ==UserScript==
// @name         Delta.io Spectator & Team Overlay Enhanced
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Enhanced spectator overlay for Delta.io with team member detection, extra chat commands, and console logs showing search results for team members.
// @author       YourName
// @match        *://agar.io/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Maps to store spectator-related data.
    const waveCounts = new Map();

    // ---------------------------
    // Overlay for Spectators
    // ---------------------------
    const spectatorOverlay = document.createElement('div');
    spectatorOverlay.id = 'delta-spectator-overlay';
    Object.assign(spectatorOverlay.style, {
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
    document.body.appendChild(spectatorOverlay);

    function updateSpectators() {
        spectatorOverlay.innerHTML = '<h3 style="margin-top: 0;">Spectators:</h3>';

        // Access Delta.io's internal spectator list.
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
            spectatorOverlay.appendChild(specElement);
        });
    }

    // ---------------------------
    // Overlay for Team Members
    // ---------------------------
    const teamOverlay = document.createElement('div');
    teamOverlay.id = 'delta-team-overlay';
    Object.assign(teamOverlay.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '10px',
        zIndex: '9999',
        fontFamily: 'Arial, sans-serif'
    });
    document.body.appendChild(teamOverlay);

    // Function to search for team member information.
    function searchForTeamMembers() {
        console.log("Searching for team member data...");

        // First, try known references.
        if (window.Delta?.player?.team?.members && Array.isArray(window.Delta.player.team.members)) {
            console.log("Found team members at window.Delta.player.team.members");
            return window.Delta.player.team.members;
        }
        if (window.Delta?.team?.members && Array.isArray(window.Delta.team.members)) {
            console.log("Found team members at window.Delta.team.members");
            return window.Delta.team.members;
        }

        // If not found, perform a recursive search.
        const seen = new Set();

        function recursiveSearch(obj) {
            if (!obj || typeof obj !== 'object' || seen.has(obj)) return null;
            seen.add(obj);
            for (const key in obj) {
                if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
                try {
                    const val = obj[key];
                    if (val && typeof val === 'object') {
                        // Check if the key name hints at team info and contains a members array.
                        if (key.toLowerCase().includes('team') && val.members && Array.isArray(val.members)) {
                            if (val.members.length > 0 && typeof val.members[0].name === 'string') {
                                console.log(`Found team members at property "${key}" with ${val.members.length} member(s).`);
                                return val.members;
                            }
                        }
                        // Also, if the value itself is an array that might be team members.
                        if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'object' && 'name' in val[0]) {
                            if (key.toLowerCase().includes('member') || key.toLowerCase().includes('team')) {
                                console.log(`Found team member array at property "${key}" with ${val.length} member(s).`);
                                return val;
                            }
                        }
                        // Recursive search deeper.
                        const result = recursiveSearch(val);
                        if (result) return result;
                    }
                } catch (error) {
                    console.error('Error searching key:', key, error);
                }
            }
            return null;
        }
        const result = recursiveSearch(window.Delta);
        if (result) {
            console.log(`Team member data found using recursive search: ${result.length} member(s) found.`);
        } else {
            console.log("No team member data found in Delta.");
        }
        return result;
    }

    function updateTeamMembers() {
        teamOverlay.innerHTML = '<h3 style="margin-top: 0;">Team Members:</h3>';

        // Get team member data via the search function.
        const teamMembers = searchForTeamMembers() || [];
        if (teamMembers.length === 0) {
            teamOverlay.innerHTML += '<div>No team members found.</div>';
        } else {
            console.log(`There are ${teamMembers.length} team member(s) joined.`);
            teamMembers.forEach(member => {
                const memberElement = document.createElement('div');
                memberElement.style.margin = '5px 0';
                memberElement.style.cursor = 'pointer';
                memberElement.textContent = member.name || 'Unnamed';

                // Clicking on the name copies it to clipboard.
                memberElement.title = 'Click to copy team member name';
                memberElement.addEventListener('click', () => {
                    navigator.clipboard.writeText(member.name)
                        .then(() => console.log('Team member name copied to clipboard.'))
                        .catch(err => console.error('Failed to copy team member name:', err));
                });
                teamOverlay.appendChild(memberElement);
            });
        }
    }

    // ---------------------------
    // Hooking into Delta.io events
    // ---------------------------
    function hookDeltaPingEvents() {
        try {
            const originalPing = window.Delta?.map?.ping;
            if (typeof originalPing === 'function') {
                window.Delta.map.ping = function(...args) {
                    // Update wave count for the current player/spectator.
                    const specId = window.Delta?.player?.id;
                    if (specId) {
                        waveCounts.set(specId, (waveCounts.get(specId) || 0) + 1);
                    }
                    // Refresh the spectator overlay.
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

    // ---------------------------
    // Chat command enhancements
    // ---------------------------
    function setupChatCommands() {
        try {
            const originalSend = window.Delta?.chat?.sendMessage;
            if (typeof originalSend === 'function') {
                window.Delta.chat.sendMessage = function(message) {
                    // Chat command mapping.
                    const commands = {
                        '/cmd1': 'Predefined text 1',
                        '/cmd2': 'Predefined text 2',
                        '/wave': `My wave count: ${waveCounts.get(window.Delta?.player?.id) || 0}`,
                        '/hello': 'Hello everyone!',
                        '/status': 'Spectator overlay is active!'
                    };

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

    // ---------------------------
    // Initialization
    // ---------------------------
    function init() {
        // Update overlays every second.
        setInterval(() => {
            updateSpectators();
            updateTeamMembers();
        }, 1000);

        // Hook into events.
        hookDeltaPingEvents();
        setupChatCommands();

        // Initial overlay updates.
        updateSpectators();
        updateTeamMembers();
    }

    // Wait for Delta.io to load before initializing.
    const checkDelta = setInterval(() => {
        if (window.Delta) {
            clearInterval(checkDelta);
            init();
        }
    }, 1000);

    console.log('Delta.io Spectator & Team Overlay Enhanced script loaded.');
})();
