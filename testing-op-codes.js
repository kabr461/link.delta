// ==UserScript==
// @name         Delta Spectator Window (Spectating Mode Only) for Agar.io
// @namespace    http://your-namespace-here.com
// @version      1.0
// @description  Displays a floating spectator panel (with names, avatars, and wave counts) only when in spectating mode—using Delta’s data smartly. Clicking a name copies it; clicking an avatar copies its URL. CMD Chat is enabled by default.
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

    /***************** Insert Custom CSS for the Spectator Panel *****************/
    function insertSpectatorStyles() {
        if (document.getElementById('delta-spectator-style')) return; // only insert once
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

    /***************** Create/Remove the Spectator Panel UI *****************/
    function createSpectatorPanel() {
        if (document.getElementById('delta-spectator-panel')) return;
        insertSpectatorStyles();
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

        // Attach event listener for CMD Chat toggle.
        const cmdChatCheckbox = document.getElementById('cmd-chat-checkbox');
        cmdChatCheckbox.addEventListener('change', function() {
            console.log("CMD Chat " + (this.checked ? "enabled" : "disabled"));
        });
    }

    function removeSpectatorPanel() {
        const panel = document.getElementById('delta-spectator-panel');
        if (panel) {
            panel.remove();
        }
    }

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

    /***************** Get Spectator Data from Delta (Smartly) *****************
     * In a real setup, Delta should provide live data.
     * For this example, we assume that when in spectating mode, a global
     * variable `window.deltaSpectators` exists and is an array of objects:
     * { name: "PlayerOne", skin: "https://example.com/avatar.png", waves: 3 }
     **********************************************************************/
    function getSpectatorData() {
        if (window.deltaSpectators && Array.isArray(window.deltaSpectators) && window.deltaSpectators.length > 0) {
            return window.deltaSpectators;
        }
        return null;
    }

    /***************** Update the Spectator List UI from Delta Data *****************/
    function updateSpectatorList() {
        const data = getSpectatorData();
        const spectatorList = document.getElementById('spectator-list');
        if (!spectatorList) return;
        spectatorList.innerHTML = "";
        if (data) {
            data.forEach(spectator => {
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
                waveCount.textContent = spectator.waves || 0;

                item.appendChild(img);
                item.appendChild(nameDiv);
                item.appendChild(waveCount);
                spectatorList.appendChild(item);
            });
        } else {
            spectatorList.innerHTML = "<div>No spectators (not in spectating mode)</div>";
        }
    }

    /***************** Check Spectating Mode & Persist the Panel *****************
     * We assume that Delta sets window.deltaSpectators when in spectating mode.
     * If that data exists, we show (or update) the panel; if not, we remove it.
     ******************************************************************************/
    function checkSpectatingMode() {
        const data = getSpectatorData();
        if (data) {
            // In spectating mode—ensure the panel exists and update it.
            if (!document.getElementById('delta-spectator-panel')) {
                createSpectatorPanel();
            }
            updateSpectatorList();
        } else {
            // Not in spectating mode—remove the panel if it exists.
            removeSpectatorPanel();
        }
    }

    // Check spectating mode every 5 seconds.
    setInterval(checkSpectatingMode, 5000);
    // Also run once immediately.
    checkSpectatingMode();

    /***************** MutationObserver to Re-Add the UI if Removed *****************/
    const uiObserver = new MutationObserver((mutations) => {
        if (!document.getElementById('delta-spectator-panel')) {
            console.warn("Spectator panel missing! Re-adding it...");
            checkSpectatingMode();
        }
    });
    uiObserver.observe(document.body, { childList: true, subtree: true });

    console.log("Delta Spectator Window (Spectating Mode Only) script is running.");

    /***************** (Optional) For Testing: Simulate Delta Data *****************
     * Remove or disable this section in production.
     * This dummy simulation makes window.deltaSpectators available.
     ******************************************************************************/
    if (!window.deltaSpectators) {
        window.deltaSpectators = [
            { name: "DeltaPlayer1", skin: "https://dummyimage.com/40x40/FF5733/FFFFFF.png&text=D1", waves: 3 },
            { name: "DeltaPlayer2", skin: "https://dummyimage.com/40x40/33FF57/FFFFFF.png&text=D2", waves: 5 },
            { name: "DeltaPlayer3", skin: "https://dummyimage.com/40x40/3357FF/FFFFFF.png&text=D3", waves: 2 }
        ];
        // For testing, update the dummy data every 10 seconds.
        setInterval(() => {
            window.deltaSpectators.forEach(s => s.waves = Math.floor(Math.random() * 10));
        }, 10000);
    }
    /***************** End of Dummy Simulation Section *****************/

})();
