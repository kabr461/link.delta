// ==UserScript==
// @name         Delta Spectator Window (Firebase Data Reader) for Agar.io
// @namespace    http://your-namespace-here.com
// @version      1.0
// @description  Displays a live spectator window that reads spectator data from Firebase (data provided by Delta). Clicking on a name copies it; clicking on an avatar copies its URL. CMD Chat is enabled by default.
// @match        *://agar.io/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    /***************** OPTIONAL: Remove Local CSP Meta Tags *****************
     * (Note: Userscripts cannot override server-sent CSP headers.)
     *************************************************************************/
    function removeCSPMetaTags() {
        document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]').forEach(tag => tag.remove());
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

    /***************** Create the Spectator Panel UI *****************/
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

    /***************** Load Firebase SDK Dynamically *****************/
    function loadScript(src, onload) {
        const script = document.createElement('script');
        script.src = src;
        script.onload = onload;
        document.head.appendChild(script);
    }
    loadScript("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js", function() {
        loadScript("https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js", initializeFirebase);
    });

    // Replace these placeholders with your actual Firebase project settings.
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
        databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_PROJECT_ID.appspot.com",
        messagingSenderId: "YOUR_SENDER_ID",
        appId: "YOUR_APP_ID"
    };

    function initializeFirebase() {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        console.log("Firebase initialized.");
        setupSpectatorListener();
    }

    /***************** Listen for Spectator Data from Firebase *****************/
    function setupSpectatorListener() {
        // We expect Delta to write spectator data to the "delta_spectators" node.
        const ref = firebase.database().ref("delta_spectators");
        ref.on("value", function(snapshot) {
            const data = snapshot.val();
            updateSpectatorListFromFirebase(data);
        }, function(error) {
            console.error("Firebase spectator listener error: ", error);
        });
    }

    /***************** Update Spectator List UI from Firebase Data *****************/
    function updateSpectatorListFromFirebase(data) {
        // Data is expected to be an object where each key is a unique ID and each value is a spectator object:
        // { name: "PlayerOne", skin: "avatar_url", waves: 3 }
        spectatorList.innerHTML = ""; // Clear current list.
        if (data) {
            // Convert object values into an array.
            const spectators = Object.values(data);
            spectators.forEach(spectator => {
                const item = document.createElement("div");
                item.className = "spectator-item";

                const img = document.createElement("img");
                img.src = spectator.skin;
                img.addEventListener("click", function(e) {
                    e.stopPropagation();
                    copyToClipboard(spectator.skin);
                });

                const nameDiv = document.createElement("div");
                nameDiv.className = "spectator-name";
                nameDiv.textContent = spectator.name;
                nameDiv.addEventListener("click", function(e) {
                    e.stopPropagation();
                    copyToClipboard(spectator.name);
                });

                const waveCount = document.createElement("div");
                waveCount.className = "spectator-wave";
                waveCount.textContent = spectator.waves || 0;

                item.appendChild(img);
                item.appendChild(nameDiv);
                item.appendChild(waveCount);
                spectatorList.appendChild(item);
            });
        } else {
            spectatorList.innerHTML = "<div>No spectators found</div>";
        }
    }

    console.log("Delta Spectator Window (Firebase) initialized.");
})();
