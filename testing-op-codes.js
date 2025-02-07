// ==UserScript==
// @name         Delta Spectator Window (Creative Version) for Agar.io
// @namespace    http://your-namespace-here.com
// @version      1.0
// @description  Shows a live-updating spectator window with names, avatars, wave counts, and a CMD Chat toggle. Click a name to copy it or an image to copy its URL.
// @match        *://agar.io/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    /********************* Optional: Relax CSP ************************
     * (Note: Userscripts cannot override server-sent CSP headers.)
     *******************************************************************/
    function removeCSPMetaTags() {
        document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]').forEach(tag => {
            tag.remove();
        });
    }
    removeCSPMetaTags();

    /********************* Create the Spectator Panel CSS *********************/
    const style = document.createElement('style');
    style.textContent = `
    /* Container style for the spectator window */
    #delta-spectator-panel {
        position: fixed;
        top: 10px;
        left: 10px;
        width: 250px;
        max-height: 90%;
        background: rgba(0, 0, 0, 0.75);
        color: #fff;
        font-family: Arial, sans-serif;
        font-size: 14px;
        padding: 10px;
        overflow-y: auto;
        z-index: 10000;
        border: 2px solid #f00;
        border-radius: 5px;
    }
    /* Header style */
    #delta-spectator-panel h2 {
        margin: 0 0 10px 0;
        font-size: 16px;
        text-align: center;
        border-bottom: 1px solid #fff;
        padding-bottom: 5px;
    }
    /* Each spectator entry */
    #delta-spectator-panel .spectator-item {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        cursor: pointer;
    }
    /* Avatar image style */
    #delta-spectator-panel .spectator-item img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 8px;
    }
    /* Spectator name style */
    #delta-spectator-panel .spectator-name {
        flex: 1;
    }
    /* Wave count style */
    #delta-spectator-panel .spectator-wave {
        background: #f00;
        padding: 2px 4px;
        border-radius: 3px;
        margin-left: 5px;
        font-size: 12px;
    }
    /* CMD Chat toggle style */
    #delta-spectator-panel .cmd-chat-toggle {
        margin-top: 10px;
        text-align: center;
    }
    `;
    document.head.appendChild(style);

    /********************* Create the Spectator Panel *********************/
    const panel = document.createElement('div');
    panel.id = 'delta-spectator-panel';
    panel.innerHTML = `
        <h2>Users (Delta)</h2>
        <div id="spectator-list"></div>
        <div class="cmd-chat-toggle">
            <label>
                <input type="checkbox" id="cmd-chat-checkbox">
                CMD Chat
            </label>
        </div>
    `;
    document.body.appendChild(panel);

    const spectatorList = document.getElementById('spectator-list');
    const cmdChatCheckbox = document.getElementById('cmd-chat-checkbox');

    // When the CMD Chat toggle changes, log its state.
    cmdChatCheckbox.addEventListener('change', function() {
        if (this.checked) {
            console.log("CMD Chat enabled");
        } else {
            console.log("CMD Chat disabled");
        }
    });

    /********************* Utility: Copy Text to Clipboard *********************/
    function copyToClipboard(text) {
        // Use the Clipboard API if available
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                console.log(`Copied to clipboard: ${text}`);
            }).catch(err => {
                console.error('Clipboard write failed: ', err);
            });
        } else {
            // Fallback for older browsers
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed"; // Avoid scrolling to bottom
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                console.log(`Copied to clipboard: ${text}`);
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
            document.body.removeChild(textArea);
        }
    }

    /********************* Simulate Spectator Data *************************
     * In a real implementation, you'd fetch this data from Delta.
     *********************************************************************/
    function getSpectatorData() {
        // Dummy data simulating Delta players
        const dummySpectators = [
            { name: "PlayerOne", skin: "https://via.placeholder.com/40/FF0000/FFFFFF?text=P1", waves: Math.floor(Math.random() * 10) },
            { name: "PlayerTwo", skin: "https://via.placeholder.com/40/00FF00/FFFFFF?text=P2", waves: Math.floor(Math.random() * 10) },
            { name: "PlayerThree", skin: "https://via.placeholder.com/40/0000FF/FFFFFF?text=P3", waves: Math.floor(Math.random() * 10) },
            { name: "PlayerFour", skin: "https://via.placeholder.com/40/FFFF00/FFFFFF?text=P4", waves: Math.floor(Math.random() * 10) }
        ];
        // Occasionally simulate a new player joining
        if (Math.random() < 0.3) {
            dummySpectators.push({
                name: "Player" + Math.floor(Math.random() * 100),
                skin: "https://via.placeholder.com/40/" + Math.floor(Math.random() * 16777215).toString(16) + "/FFFFFF?text=New",
                waves: Math.floor(Math.random() * 10)
            });
        }
        return dummySpectators;
    }

    /********************* Update Spectator List UI ************************/
    function updateSpectatorList() {
        const spectators = getSpectatorData();
        spectatorList.innerHTML = ""; // Clear current list
        spectators.forEach(spectator => {
            const item = document.createElement('div');
            item.className = 'spectator-item';
            // Create avatar image element
            const img = document.createElement('img');
            img.src = spectator.skin;
            // Clicking on the avatar copies the skin URL
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                copyToClipboard(spectator.skin);
            });
            // Create name element
            const nameDiv = document.createElement('div');
            nameDiv.className = 'spectator-name';
            nameDiv.textContent = spectator.name;
            // Clicking on the name copies the player's name
            nameDiv.addEventListener('click', (e) => {
                e.stopPropagation();
                copyToClipboard(spectator.name);
            });
            // Create wave count element
            const waveCount = document.createElement('div');
            waveCount.className = 'spectator-wave';
            waveCount.textContent = spectator.waves;
            // Append all parts to the spectator item
            item.appendChild(img);
            item.appendChild(nameDiv);
            item.appendChild(waveCount);
            spectatorList.appendChild(item);
        });
    }

    // Refresh the spectator list every 5 seconds
    setInterval(updateSpectatorList, 5000);
    updateSpectatorList(); // Initial population

    console.log("Delta spectator window initialized.");

})();
