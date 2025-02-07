// ==UserScript==
// @name         Delta Spectators UI for Agar.io (with CMD Chat and Wave Count)
// @namespace    http://your-namespace-here.com
// @version      1.0
// @description  Displays Delta players (spectators) with their name, skin image (URL), and wave count in a UI panel. Clicking on the name or skin copies the info to clipboard. Includes a toggle for CMD Chat.
// @match        *://agar.io/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    /***************************************************************
     * Create UI Panel for Delta Spectators
     ***************************************************************/
    // Create a container for the UI
    const uiContainer = document.createElement('div');
    uiContainer.id = 'delta-ui-panel';
    // Style the container: fixed position, red border, semi-transparent background, etc.
    uiContainer.style.position = 'fixed';
    uiContainer.style.top = '10px';
    uiContainer.style.right = '10px';
    uiContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    uiContainer.style.color = '#fff';
    uiContainer.style.padding = '10px';
    uiContainer.style.zIndex = '9999';
    uiContainer.style.fontFamily = 'Arial, sans-serif';
    uiContainer.style.fontSize = '12px';
    uiContainer.style.maxHeight = '90vh';
    uiContainer.style.overflowY = 'auto';
    uiContainer.style.border = '2px solid red'; // red outline as per your screenshot
    document.body.appendChild(uiContainer);

    // Create header with title and a CMD Chat toggle button
    const header = document.createElement('div');
    header.style.marginBottom = '10px';
    header.innerHTML = `<strong>Delta Spectators</strong> `;
    uiContainer.appendChild(header);

    // Create a toggle button for "CMD Chat"
    const cmdChatToggle = document.createElement('button');
    cmdChatToggle.textContent = 'CMD Chat: OFF';
    let cmdChatEnabled = false;
    cmdChatToggle.style.marginLeft = '10px';
    cmdChatToggle.addEventListener('click', () => {
        cmdChatEnabled = !cmdChatEnabled;
        cmdChatToggle.textContent = `CMD Chat: ${cmdChatEnabled ? 'ON' : 'OFF'}`;
        console.log("CMD Chat toggled to", cmdChatEnabled);
        // (Insert additional CMD Chat functionality here as needed.)
    });
    header.appendChild(cmdChatToggle);

    // Create a container (list) for the spectator rows
    const spectatorList = document.createElement('div');
    uiContainer.appendChild(spectatorList);

    /***************************************************************
     * Utility: Copy Text to Clipboard
     ***************************************************************/
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            console.log(`Copied to clipboard: ${text}`);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }

    /***************************************************************
     * Update the UI from Delta Spectators Data
     ***************************************************************/
    function updateSpectatorsUI() {
        // Clear the current list
        spectatorList.innerHTML = '';

        // Get the spectator data from Delta.
        // (Your Delta script must set window.deltaSpectators as an array of objects with keys:
        //  name, skin (image URL), and waveCount.)
        const spectators = window.deltaSpectators || [];

        spectators.forEach(spec => {
            // Create a row for each spectator
            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.alignItems = 'center';
            row.style.marginBottom = '5px';

            // Skin image element
            const img = document.createElement('img');
            img.src = spec.skin;
            img.style.width = '24px';
            img.style.height = '24px';
            img.style.marginRight = '5px';
            img.style.cursor = 'pointer';
            img.title = 'Click to copy skin URL';
            img.addEventListener('click', () => {
                copyToClipboard(spec.skin);
            });
            row.appendChild(img);

            // Name element
            const nameSpan = document.createElement('span');
            nameSpan.textContent = spec.name;
            nameSpan.style.marginRight = '5px';
            nameSpan.style.cursor = 'pointer';
            nameSpan.title = 'Click to copy name';
            nameSpan.addEventListener('click', () => {
                copyToClipboard(spec.name);
            });
            row.appendChild(nameSpan);

            // Wave count element
            const waveCountSpan = document.createElement('span');
            waveCountSpan.textContent = `Wave: ${spec.waveCount}`;
            // Push the wave count to the right (if desired)
            waveCountSpan.style.marginLeft = 'auto';
            row.appendChild(waveCountSpan);

            spectatorList.appendChild(row);
        });
    }

    // Update the UI periodically (every 2 seconds)
    setInterval(updateSpectatorsUI, 2000);

    console.log("Delta Spectators UI has been initialized.");
})();
