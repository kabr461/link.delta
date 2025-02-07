// ==UserScript==
// @name         Delta Spectator Panel (Spectating Mode Only, Professional UI with Waves)
// @namespace    http://your-namespace-here.com
// @version      1.0
// @description  Displays a professional spectator panel (with names, avatars from Delta, wave counts, and a "wave" button) only when spectating. The CMD Chat toggle is on by default. The panel reappears if removed.
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

    /***************** Insert Professional CSS for the Spectator Panel *****************/
    function insertSpectatorStyles() {
        if (document.getElementById('delta-spectator-style')) return; // Insert only once.
        const style = document.createElement('style');
        style.id = 'delta-spectator-style';
        style.textContent = `
            /* Container for the spectator panel */
            #delta-spectator-panel {
                position: fixed;
                top: 20px;
                left: 20px;
                width: 300px;
                max-height: 80%;
                background: linear-gradient(135deg, #1c1c1c, #333);
                color: #f0f0f0;
                font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
                font-size: 14px;
                padding: 15px;
                overflow-y: auto;
                z-index: 10000;
                border: 1px solid #555;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
            }
            /* Header style */
            #delta-spectator-panel h2 {
                margin: 0 0 15px 0;
                font-size: 18px;
                text-align: center;
                border-bottom: 1px solid #555;
                padding-bottom: 5px;
            }
            /* Each spectator entry */
            #delta-spectator-panel .spectator-item {
                display: flex;
                align-items: center;
                margin-bottom: 10px;
                padding: 5px;
                border-bottom: 1px solid #444;
            }
            #delta-spectator-panel .spectator-item:last-child {
                border-bottom: none;
            }
            /* Avatar image style */
            #delta-spectator-panel .spectator-item img {
                width: 45px;
                height: 45px;
                border-radius: 50%;
                margin-right: 10px;
                object-fit: cover;
                border: 1px solid #777;
            }
            /* Spectator name style */
            #delta-spectator-panel .spectator-name {
                flex: 1;
                font-weight: bold;
            }
            /* Wave count style */
            #delta-spectator-panel .spectator-wave {
                background: #e74c3c;
                color: #fff;
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 12px;
                margin-right: 5px;
            }
            /* Wave button style */
            #delta-spectator-panel .wave-btn {
                cursor: pointer;
                font-size: 16px;
                padding: 2px 5px;
                border: none;
                background: none;
                color: #f0f0f0;
            }
            /* CMD Chat toggle style */
            #delta-spectator-panel .cmd-chat-toggle {
                margin-top: 15px;
                text-align: center;
            }
        `;
        document.head.appendChild(style);
    }

    /***************** Create/Remove the Spectator Panel UI *****************/
    function createSpectatorPanel() {
        if (document.getElementById('delta-spectator-panel')) return; // Already exists.
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

        // Attach event listener for the CMD Chat toggle.
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

    /***************** Smartly Get Spectator Data from Delta *****************
     * We assume Delta sets a global array "window.deltaSpectators" when in spectating mode.
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
            data.forEach((spectator, index) => {
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

                // Create a "Wave" button (hand emoji) that, when clicked, sends a wave.
                const waveBtn = document.createElement('button');
                waveBtn.className = 'wave-btn';
                waveBtn.textContent = '👋';
                waveBtn.title = "Send a wave";
                waveBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    sendWave(index);
                });

                item.appendChild(img);
                item.appendChild(nameDiv);
                item.appendChild(waveCount);
                item.appendChild(waveBtn);
                spectatorList.appendChild(item);
            });
        } else {
            spectatorList.innerHTML = "<div style='text-align:center;'>Not in spectating mode</div>";
        }
    }

    // In our dummy simulation, "sendWave" increments the wave count for that spectator.
    function sendWave(index) {
        if (window.deltaSpectators && window.deltaSpectators[index]) {
            window.deltaSpectators[index].waves = (window.deltaSpectators[index].waves || 0) + 1;
            console.log(`Sent wave to ${window.deltaSpectators[index].name}`);
            updateSpectatorList();
        }
    }

    /***************** Check Spectating Mode and Update UI *****************/
    function checkSpectatingMode() {
        const data = getSpectatorData();
        if (data) {
            if (!document.getElementById('delta-spectator-panel')) {
                createSpectatorPanel();
            }
            updateSpectatorList();
        } else {
            removeSpectatorPanel();
        }
    }
    // Check spectating mode every 2 seconds.
    setInterval(checkSpectatingMode, 2000);
    checkSpectatingMode();

    /***************** MutationObserver to Ensure the Panel Persists *****************/
    const uiObserver = new MutationObserver((mutations) => {
        if (!document.getElementById('delta-spectator-panel')) {
            console.warn("Spectator panel missing! Re-adding...");
            checkSpectatingMode();
        }
    });
    uiObserver.observe(document.body, { childList: true, subtree: true });

    console.log("Delta Spectator Panel (Spectating Mode Only) script is running.");

    /***************** For Testing Purposes Only: Dummy Delta Data *****************
     * In production, Delta should provide live data. For testing, we simulate it.
     ********************************************************************************/
    if (!window.deltaSpectators) {
        window.deltaSpectators = [
            { name: "DeltaPlayer1", skin: "https://dummyimage.com/45x45/FF5733/FFFFFF.png&text=D1", waves: 3 },
            { name: "DeltaPlayer2", skin: "https://dummyimage.com/45x45/33FF57/FFFFFF.png&text=D2", waves: 5 },
            { name: "DeltaPlayer3", skin: "https://dummyimage.com/45x45/3357FF/FFFFFF.png&text=D3", waves: 2 }
        ];
        // Update dummy wave counts every 10 seconds.
        setInterval(() => {
            window.deltaSpectators.forEach(s => {
                s.waves = Math.floor(Math.random() * 10);
            });
        }, 10000);
    }
    /************************************************************************************/

})();
