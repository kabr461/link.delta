// ==UserScript==
// @name         Delta Spectator UI with CMD Chat Toggle
// @namespace    http://your-namespace-here.com
// @version      1.0
// @description  Displays Delta spectator details (name, skin image, wave count) with copy-to-clipboard functionality and a toggleable detailed view for CMD chat options.
// @match        *://agar.io/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    let spectatorListContainer = null;

    // Create the main UI panel for Delta spectators.
    function createSpectatorUI() {
        const uiWrapper = document.createElement('div');
        uiWrapper.id = 'delta-spectator-ui';
        Object.assign(uiWrapper.style, {
            position: 'fixed',
            right: '10px',
            bottom: '10px',
            width: '250px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: '#fff',
            padding: '10px',
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            zIndex: 9999,
            borderRadius: '8px'
        });

        const header = document.createElement('div');
        header.textContent = "Delta Spectators";
        header.style.fontWeight = 'bold';
        header.style.marginBottom = '8px';
        uiWrapper.appendChild(header);

        const listContainer = document.createElement('div');
        listContainer.id = 'delta-spectator-list';
        listContainer.style.maxHeight = '300px';
        listContainer.style.overflowY = 'auto';
        uiWrapper.appendChild(listContainer);

        document.body.appendChild(uiWrapper);
        spectatorListContainer = listContainer;
    }

    // Update the spectator list UI.
    function updateSpectatorUI() {
        if (!spectatorListContainer) return;

        // Fetch spectator data from Delta (using dummy data if not available)
        const spectators = window.delta && window.delta.spectators ? window.delta.spectators : [
            { name: "DeltaAce", skinUrl: "https://i.imgur.com/YourDeltaSkin1.png", waveCount: 5 },
            { name: "DeltaChamp", skinUrl: "https://i.imgur.com/YourDeltaSkin2.png", waveCount: 3 }
        ];

        // Clear the previous list.
        spectatorListContainer.innerHTML = "";

        // Build a row for each spectator.
        spectators.forEach(spectator => {
            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.flexDirection = 'column';
            row.style.border = '1px solid rgba(255,255,255,0.3)';
            row.style.borderRadius = '4px';
            row.style.padding = '5px';
            row.style.marginBottom = '5px';
            row.style.cursor = 'pointer';

            // Create a summary row with basic info.
            const summaryRow = document.createElement('div');
            summaryRow.style.display = 'flex';
            summaryRow.style.alignItems = 'center';

            // Skin image element.
            const skinImg = document.createElement('img');
            skinImg.src = spectator.skinUrl;
            skinImg.alt = "Skin";
            skinImg.style.width = '24px';
            skinImg.style.height = '24px';
            skinImg.style.marginRight = '8px';
            skinImg.style.cursor = 'pointer';
            // Copy skin URL on click.
            skinImg.addEventListener('click', (e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(spectator.skinUrl)
                    .then(() => console.log("Copied skin URL:", spectator.skinUrl))
                    .catch(err => console.error("Copy failed:", err));
            });

            // Name element.
            const nameSpan = document.createElement('span');
            nameSpan.textContent = spectator.name;
            nameSpan.style.flex = '1';
            nameSpan.style.cursor = 'pointer';
            // Copy name on click.
            nameSpan.addEventListener('click', (e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(spectator.name)
                    .then(() => console.log("Copied name:", spectator.name))
                    .catch(err => console.error("Copy failed:", err));
            });

            // Wave count element.
            const waveSpan = document.createElement('span');
            waveSpan.textContent = `(${spectator.waveCount})`;
            waveSpan.style.marginLeft = '8px';
            waveSpan.style.color = '#0ff';

            summaryRow.appendChild(skinImg);
            summaryRow.appendChild(nameSpan);
            summaryRow.appendChild(waveSpan);
            row.appendChild(summaryRow);

            // Create a hidden details panel (for CMD chat or additional info).
            const detailsPanel = document.createElement('div');
            detailsPanel.style.display = 'none';
            detailsPanel.style.marginTop = '5px';
            detailsPanel.style.padding = '5px';
            detailsPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            detailsPanel.style.borderRadius = '4px';
            detailsPanel.innerHTML = `<div>CMD Chat Options (placeholder)</div>`;
            row.appendChild(detailsPanel);

            // Toggle the details panel when the row is clicked.
            row.addEventListener('click', () => {
                detailsPanel.style.display = detailsPanel.style.display === 'none' ? 'block' : 'none';
            });

            spectatorListContainer.appendChild(row);
        });
    }

    // Initialize the Delta spectator UI and update periodically.
    function initDeltaSpectatorUI() {
        createSpectatorUI();
        updateSpectatorUI();
        // Refresh the spectator list every 2 seconds.
        setInterval(updateSpectatorUI, 2000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDeltaSpectatorUI);
    } else {
        initDeltaSpectatorUI();
    }
})();
