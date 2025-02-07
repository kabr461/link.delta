// ==UserScript==
// @name         Delta Spectator Window (Creative Cinematic Version) for Agar.io
// @namespace    http://your-namespace-here.com
// @version      1.1.1
// @description  Displays a live spectator window with names, avatars, wave counts, and a CMD Chat toggle (which is ON by default). Clicking a name or image copies details to the clipboard. (Dummy data is used for simulation.)
// @match        *://agar.io/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    /***************** Optional: Relax CSP (Local Only) *****************
     * Note: Userscripts cannot override server-sent CSP headers.
     *********************************************************************/
    function removeCSPMetaTags() {
        document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]').forEach(tag => {
            tag.remove();
        });
    }
    removeCSPMetaTags();

    /***************** Create Spectator Panel CSS *****************/
    const style = document.createElement('style');
    style.textContent = `
    /* Container for the spectator window */
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

    /***************** Create the Spectator Panel *****************/
    const panel = document.createElement('div');
    panel.id = 'delta-spectator-panel';
    panel.innerHTML = `
        <h2>Users (Delta)</h2>
        <div id="spectator-list"></div>
        <div class="cmd-chat-toggle">
            <label>
                <input type="checkbox" id="cmd-chat-checkbox" checked>
                CMD Chat
            </label>
        </div>
    `;
    document.body.appendChild(panel);

    const spectatorList = document.getElementById('spectator-list');
    const cmdChatCheckbox = document.getElementById('cmd-chat-checkbox');

    // Log CMD Chat toggle state changes.
    cmdChatCheckbox.addEventListener('change', function() {
        console.log("CMD Chat " + (this.checked ? "enabled" : "disabled"));
    });

    /***************** Utility: Copy Text to Clipboard *****************/
    function copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                console.log(`Copied to clipboard: ${text}`);
            }).catch(err => {
                console.error('Clipboard write failed: ', err);
            });
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
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

    /***************** Simulated Spectator Data *****************
     * In a real implementation, fetch live data from Delta.
     ***********************************************************/
    function getSpectatorData() {
        // Using dummyimage.com instead of via.placeholder.com to avoid DNS errors.
        const dummySpectators = [
            { name: "PlayerOne", skin: "https://dummyimage.com/40x40/FF0000/FFFFFF.png&text=P1", waves: Math.floor(Math.random() * 10) },
            { name: "PlayerTwo", skin: "https://dummyimage.com/40x40/00FF00/FFFFFF.png&text=P2", waves: Math.floor(Math.random() * 10) },
            { name: "PlayerThree", skin: "https://dummyimage.com/40x40/0000FF/FFFFFF.png&text=P3", waves: Math.floor(Math.random() * 10) },
            { name: "PlayerFour", skin: "https://dummyimage.com/40x40/FFFF00/FFFFFF.png&text=P4", waves: Math.floor(Math.random() * 10) }
        ];
        // Occasionally simulate a new player joining with a random color.
        if (Math.random() < 0.3) {
            const randomColor = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
            dummySpectators.push({
                name: "Player" + Math.floor(Math.random() * 100),
                skin: `https://dummyimage.com/40x40/${randomColor}/FFFFFF.png&text=New`,
                waves: Math.floor(Math.random() * 10)
            });
        }
        return dummySpectators;
    }

    /***************** Update Spectator List UI *****************/
    function updateSpectatorList() {
        const spectators = getSpectatorData();
        spectatorList.innerHTML = "";
        spectators.forEach(spectator => {
            const item = document.createElement('div');
            item.className = 'spectator-item';
            // Create avatar image element.
            const img = document.createElement('img');
            img.src = spectator.skin;
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                copyToClipboard(spectator.skin);
            });
            // Create name element.
            const nameDiv = document.createElement('div');
            nameDiv.className = 'spectator-name';
            nameDiv.textContent = spectator.name;
            nameDiv.addEventListener('click', (e) => {
                e.stopPropagation();
                copyToClipboard(spectator.name);
            });
            // Create wave count element.
            const waveCount = document.createElement('div');
            waveCount.className = 'spectator-wave';
            waveCount.textContent = spectator.waves;
            // Append parts to the spectator item.
            item.appendChild(img);
            item.appendChild(nameDiv);
            item.appendChild(waveCount);
            spectatorList.appendChild(item);
        });
    }
    setInterval(updateSpectatorList, 5000);
    updateSpectatorList();

    console.log("Delta spectator window initialized.");

    /***************** (Optional) Firebase Integration for Team Features *****************
     * In this example, we simulate team features; you would replace this
     * section with live Firebase integration.
     * For this demonstration, we'll omit Firebase to focus on the spectator window.
     *****************************************************************************************/

    /***************** End of Spectator Window Code *****************/


    
})();
