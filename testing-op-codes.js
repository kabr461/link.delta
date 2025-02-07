// ==UserScript==
// @name         Delta Spectator Window with Persistent CMD Chat UI for Agar.io
// @namespace    http://your-namespace-here.com
// @version      1.2.3
// @description  Displays a live spectator window (with a CMD Chat toggle that is ON by default) and smartly re-adds the UI if it’s removed by the page. (Dummy data for simulation.)
// @match        *://agar.io/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    /***************** OPTIONAL: Relax Local CSP Meta Tags *****************
     * (Note: Userscripts cannot override server-sent CSP headers.)
     *********************************************************************/
    function removeCSPMetaTags() {
        document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]').forEach(tag => tag.remove());
    }
    removeCSPMetaTags();

    /***************** Insert Custom CSS for the Spectator Window *****************/
    function insertSpectatorStyles() {
        if (document.getElementById('delta-spectator-style')) return; // Only insert once.
        const style = document.createElement('style');
        style.id = 'delta-spectator-style';
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
    }

    /***************** Function to Create the Spectator Panel UI *****************/
    function createSpectatorPanel() {
        // If the panel already exists, do nothing.
        if (document.getElementById('delta-spectator-panel')) return;

        // Insert our custom CSS.
        insertSpectatorStyles();

        // Create the panel container.
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

        // Attach event listeners.
        const spectatorList = document.getElementById('spectator-list');
        const cmdChatCheckbox = document.getElementById('cmd-chat-checkbox');
        cmdChatCheckbox.addEventListener('change', function() {
            console.log("CMD Chat " + (this.checked ? "enabled" : "disabled"));
        });

        // For demonstration, simulate spectator data update.
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

        // Dummy function to simulate fetching spectator data.
        function getSpectatorData() {
            // Use dummy images via dummyimage.com to avoid DNS issues.
            return [
                { name: "PlayerOne", skin: "https://dummyimage.com/40x40/FF0000/FFFFFF.png&text=P1", waves: Math.floor(Math.random() * 10) },
                { name: "PlayerTwo", skin: "https://dummyimage.com/40x40/00FF00/FFFFFF.png&text=P2", waves: Math.floor(Math.random() * 10) },
                { name: "PlayerThree", skin: "https://dummyimage.com/40x40/0000FF/FFFFFF.png&text=P3", waves: Math.floor(Math.random() * 10) },
                { name: "PlayerFour", skin: "https://dummyimage.com/40x40/FFFF00/FFFFFF.png&text=P4", waves: Math.floor(Math.random() * 10) }
            ];
        }

        function updateSpectatorList() {
            try {
                const spectators = getSpectatorData();
                spectatorList.innerHTML = "";
                spectators.forEach(spectator => {
                    const item = document.createElement('div');
                    item.className = 'spectator-item';

                    const img = document.createElement('img');
                    img.src = spectator.skin;
                    img.addEventListener('click', (e) => {
                        e.stopPropagation();
                        copyToClipboard(spectator.skin);
                    });

                    const nameDiv = document.createElement('div');
                    nameDiv.className = 'spectator-name';
                    nameDiv.textContent = spectator.name;
                    nameDiv.addEventListener('click', (e) => {
                        e.stopPropagation();
                        copyToClipboard(spectator.name);
                    });

                    const waveCount = document.createElement('div');
                    waveCount.className = 'spectator-wave';
                    waveCount.textContent = spectator.waves;
                    
                    item.appendChild(img);
                    item.appendChild(nameDiv);
                    item.appendChild(waveCount);
                    spectatorList.appendChild(item);
                });
            } catch (err) {
                console.error("Error updating spectator list:", err);
            }
        }
        // Update the list every 5 seconds.
        setInterval(updateSpectatorList, 5000);
        updateSpectatorList();

        console.log("Delta spectator window initialized.");
    }

    /***************** Ensure the Spectator Panel Persists *****************/
    // Create the panel initially.
    createSpectatorPanel();

    // Use a MutationObserver to watch the document body for removal of the panel.
    const uiObserver = new MutationObserver((mutations) => {
        if (!document.getElementById('delta-spectator-panel')) {
            console.warn("Spectator panel missing! Re-adding...");
            createSpectatorPanel();
        }
    });
    uiObserver.observe(document.body, { childList: true, subtree: true });

    console.log("Delta Spectator Window with persistent CMD Chat UI is running.");
})();
