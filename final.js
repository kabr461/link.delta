
(function () {
  "use strict";

  // ------------------------------
  // GAME STATE HOOK SECTION
  // ------------------------------
  console.log("[Hook] Starting game state hook installation...");

  // Create a global gameState object to hold players and spectators data.
  window.gameState = {
    players: {},
    spectators: {}
  };

  // Dummy parser functions for demonstration.
  const deltaPacketParsers = {
    auth(reader) {
      // Example: Read one UInt8 (your real parser would do more)
      try {
        const id = reader.readUInt8();
        return { playerID: id };
      } catch (e) {
        throw e;
      }
    },
    clientRegisterTab(reader) {
      try {
        const id = reader.readUInt8();
        return { playerID: id, callbackID: Date.now() };
      } catch (e) {
        throw e;
      }
    },
    clientRemoveTab(reader) {
      try {
        const id = reader.readUInt8();
        return { playerID: id };
      } catch (e) {
        throw e;
      }
    },
    clientTokenTag(reader) {
      try {
        const id = reader.readUInt8();
        return { playerID: id, clanTag: "dummyTag" };
      } catch (e) {
        throw e;
      }
    },
    commander(reader) {
      try {
        const id = reader.readUInt8();
        return [id, "extra", "data"];
      } catch (e) {
        throw e;
      }
    }
  };

  // Minimal BinaryReader for our parsers.
  class BinaryReader {
    constructor(data) {
      if (data instanceof ArrayBuffer) {
        this.buffer = data;
      } else if (data instanceof Uint8Array) {
        this.buffer = data.buffer.slice(
          data.byteOffset,
          data.byteOffset + data.byteLength
        );
      } else {
        throw new Error("Unsupported data type for BinaryReader");
      }
      this.view = new DataView(this.buffer);
      this.offset = 0;
      this.le = true; // little-endian
    }
    readUInt8() {
      if (this.offset + 1 > this.view.byteLength)
        throw new RangeError("Offset out of bounds");
      const value = this.view.getUint8(this.offset);
      this.offset++;
      return value;
    }
    // Add other methods as needed…
  }

  // Hook the WebSocket "message" events so that our parsers update the gameState.
  const OriginalWebSocket = window.WebSocket;
  const originalAddEventListener = OriginalWebSocket.prototype.addEventListener;
  OriginalWebSocket.prototype.addEventListener = function (type, listener, options) {
    if (type === "message") {
      const wrappedListener = function (event) {
        if (event.data instanceof ArrayBuffer) {
          try {
            const rawData = new Uint8Array(event.data);
            console.log("[Hook] Raw binary data received:", rawData);

            // Use our parsers to update gameState.
            try {
              const authReader = new BinaryReader(event.data);
              const authData = deltaPacketParsers.auth(authReader);
              console.log("[Hook] Auth data:", authData);
              if (authData && authData.playerID) {
                window.gameState.players[authData.playerID] =
                  window.gameState.players[authData.playerID] || {};
                window.gameState.players[authData.playerID].auth = authData;
              }
            } catch (e) {
              // Not an auth packet.
            }

            try {
              const regReader = new BinaryReader(event.data);
              const regData = deltaPacketParsers.clientRegisterTab(regReader);
              console.log("[Hook] Client register data:", regData);
              if (regData && regData.playerID) {
                window.gameState.players[regData.playerID] =
                  window.gameState.players[regData.playerID] || {};
                Object.assign(window.gameState.players[regData.playerID], regData);
              }
            } catch (e) { }

            try {
              const remReader = new BinaryReader(event.data);
              const remData = deltaPacketParsers.clientRemoveTab(remReader);
              console.log("[Hook] Client remove data:", remData);
              if (remData && remData.playerID) {
                delete window.gameState.players[remData.playerID];
                delete window.gameState.spectators[remData.playerID];
              }
            } catch (e) { }

            try {
              const tokenReader = new BinaryReader(event.data);
              const tokenData = deltaPacketParsers.clientTokenTag(tokenReader);
              console.log("[Hook] Token tag data:", tokenData);
              if (tokenData && tokenData.playerID) {
                window.gameState.players[tokenData.playerID] =
                  window.gameState.players[tokenData.playerID] || {};
                Object.assign(window.gameState.players[tokenData.playerID], tokenData);
              }
            } catch (e) { }

            try {
              const commReader = new BinaryReader(event.data);
              const commData = deltaPacketParsers.commander(commReader);
              console.log("[Hook] Commander (spectator) data:", commData);
              if (Array.isArray(commData) && commData.length > 0) {
                const playerID = commData[0];
                window.gameState.spectators[playerID] = commData;
              }
            } catch (e) { }

          } catch (processingError) {
            console.error("[Hook] Error processing WebSocket data:", processingError);
          }
        }
        listener(event);
      };
      originalAddEventListener.call(this, type, wrappedListener, options);
    } else {
      originalAddEventListener.call(this, type, listener, options);
    }
  };

  // Override the onmessage property so assignments are hooked.
  Object.defineProperty(OriginalWebSocket.prototype, "onmessage", {
    set: function (fn) {
      this.addEventListener("message", fn);
    },
    get: function () {
      return null;
    }
  });

  console.log("[Hook] Game state hook installed. Current game state:", window.gameState);

  // ------------------------------
  // UI CODE SECTION (Delayed by 6 seconds)
  // ------------------------------
  function initUI() {
    console.log("[UI] Starting UI initialization...");
    // For demonstration, we log the gameState.
    console.log("[UI] Current game state:", window.gameState);
    // Call UI functions (like initSpectate) to build your UI.
    initSpectate();
  }

  // UI functions (unchanged from your working code)
  function initSpectate() {
    try {
      const spectateBtn = Array.from(document.querySelectorAll('div.btn-layer'))
        .find(el => el.textContent.trim() === 'Spectate');
      if (!spectateBtn) {
        console.log("[UI] Spectate button not found, retrying in 500ms");
        return setTimeout(initSpectate, 500);
      }
      spectateBtn.addEventListener('click', function () {
        try {
          openSpectateTab();
        } catch (err) {
          console.error("[SpectateButton] Error during click event:", err);
        }
      });
    } catch (err) {
      console.error("[initSpectate] Exception:", err);
    }
  }

  function openSpectateTab() {
    try {
      if (document.getElementById('spectateTab')) {
        document.getElementById('spectateTab').style.right = '0';
        return;
      }
      const spectateTab = document.createElement('div');
      spectateTab.id = 'spectateTab';
      spectateTab.className = 'spectate-tab';
      spectateTab.innerHTML = `
        <div class="collapsible" onclick="toggleCollapse(this)">
            Users (2) <span class="arrow">▶</span>
        </div>
        <div class="content player-list">
            <div class="player">
                <div class="player-info" onclick="copyPlayerInfo(event, this)">
                    <img src="https://via.placeholder.com/40" alt="User">
                    <span>naze</span>
                </div>
                <span class="player-tag">naze</span>
            </div>
            <div class="player">
                <div class="player-info" onclick="copyPlayerInfo(event, this)">
                    <img src="https://via.placeholder.com/40" alt="User">
                    <span>Hook</span>
                </div>
                <span class="player-tag">Hook</span>
            </div>
        </div>
        <div class="collapsible" onclick="toggleCollapse(this)">
            Teams (1) <span class="arrow">▶</span>
        </div>
        <div class="content team">
            <div class="player">
                <div class="tick-button" onclick="toggleTick(event, this)">☐</div>
                <div class="player-info" onclick="copyPlayerInfo(event, this)">
                    <img src="https://via.placeholder.com/40" alt="User">
                    <span>naze</span>
                </div>
                <span class="score">1</span>
            </div>
            <div class="player">
                <div class="tick-button" onclick="toggleTick(event, this)">☐</div>
                <div class="player-info" onclick="copyPlayerInfo(event, this)">
                    <img src="https://via.placeholder.com/40" alt="User">
                    <span>Hook</span>
                </div>
                <span class="score">0</span>
            </div>
        </div>
        <div class="button-container">
            <div class="toggle-container">
                <span>Spy Tag</span>
                <div class="toggle" onclick="toggleSwitch(this)">OFF</div>
            </div>
            <div class="toggle-container">
                <span>Cmd Chat</span>
                <div id="cmdChatToggle" class="toggle" onclick="toggleSwitch(this)">OFF</div>
            </div>
        </div>
      `;
      document.body.appendChild(spectateTab);
      requestAnimationFrame(() => {
        spectateTab.style.right = '0';
      });
    } catch (err) {
      console.error("[openSpectateTab] Exception:", err);
    }
  }

  window.toggleCollapse = function (element) {
    try {
      element.classList.toggle('active');
      const content = element.nextElementSibling;
      content.style.display = content.style.display === "block" ? "none" : "block";
      element.querySelector(".arrow").style.transform =
        content.style.display === "block" ? "rotate(90deg)" : "rotate(0deg)";
    } catch (err) {
      console.error("[toggleCollapse] Exception:", err);
    }
  };

  window.toggleSwitch = function (element) {
    try {
      element.classList.toggle('active');
      element.textContent = element.classList.contains('active') ? 'ON' : 'OFF';
      if (element.id === 'cmdChatToggle') {
        element.classList.contains('active') ? startCmdObserver() : stopCmdObserver();
      }
    } catch (err) {
      console.error("[toggleSwitch] Exception:", err);
    }
  };

  window.toggleTick = function (event, element) {
    try {
      element.textContent = element.textContent.trim() === '✓' ? '☐' : '✓';
      event.stopPropagation();
    } catch (err) {
      console.error("[toggleTick] Exception:", err);
    }
  };

  window.copyPlayerInfo = function (event, container) {
    try {
      event.stopPropagation();
      let textToCopy = '';
      const target = event.target;
      if (target.tagName.toLowerCase() === 'img') {
        textToCopy = target.src;
      } else if (target.tagName.toLowerCase() === 'span') {
        textToCopy = target.textContent.trim();
      } else {
        const span = container.querySelector('span');
        if (span) {
          textToCopy = span.textContent.trim();
        }
      }
      if (!textToCopy) return;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showCopyAlert(container, "Copied!");
        }).catch(err => {
          console.error("[copyPlayerInfo] Clipboard write failed:", err);
        });
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          showCopyAlert(container, "Copied!");
        } catch (err) {
          console.error("[copyPlayerInfo] Fallback copy failed:", err);
        }
        document.body.removeChild(textarea);
      }
    } catch (err) {
      console.error("[copyPlayerInfo] Exception:", err);
    }
  };

  function showCopyAlert(parent, message) {
    try {
      const alertEl = document.createElement('div');
      alertEl.textContent = message;
      alertEl.className = 'copy-alert';
      parent.appendChild(alertEl);
      setTimeout(() => {
        alertEl.remove();
      }, 1500);
    } catch (err) {
      console.error("[showCopyAlert] Exception:", err);
    }
  }

  document.addEventListener('keydown', function (e) {
    try {
      if (e.key === 'Escape') {
        const spectateTab = document.getElementById('spectateTab');
        if (spectateTab) {
          spectateTab.style.right = '-15vw';
          setTimeout(() => {
            spectateTab.remove();
          }, 500);
        }
      }
    } catch (err) {
      console.error("[keydown] Exception:", err);
    }
  });

  // Add custom styles for the UI.
  const style = document.createElement('style');
  style.innerHTML = `
    .spectate-tab {
        position: fixed;
        top: 50%;
        right: -15vw;
        transform: translateY(-50%);
        width: 12vw;
        max-width: 180px;
        height: 50vh;
        max-height: 420px;
        background: #0d0d0d;
        padding: 0.5vw;
        border-radius: 5px;
        border: 1px solid #444;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
        transition: right 0.5s ease-out;
        color: white;
        font-family: Arial, sans-serif;
        z-index: 10000;
        display: flex;
        flex-direction: column;
    }
    .collapsible {
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 4px 5px;
        background: #222;
        border: 1px solid #444;
        font-size: 0.9vw;
        font-weight: bold;
    }
    .arrow {
        transform: rotate(0deg);
        transition: transform 0.3s ease-in-out;
    }
    .collapsible.active .arrow {
        transform: rotate(90deg);
    }
    .content {
        display: none;
        padding: 5px;
        background: #181818;
        border-top: 1px solid #444;
    }
    .player {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.3vh 0;
        font-size: 1vw;
        color: #ddd;
    }
    .player-info {
        display: flex;
        align-items: center;
        cursor: pointer;
    }
    .player-info img {
        width: 2vw;
        height: 2vw;
        border-radius: 50%;
        margin-right: 0.3vw;
        cursor: pointer;
    }
    .player-info span {
        cursor: pointer;
    }
    .tick-button {
        color: #0f0;
        font-size: 1vw;
        cursor: pointer;
    }
    .player-tag {
        background: #888;
        padding: 0.2em 0.5em;
        border-radius: 4px;
        font-size: 0.85vw;
        color: #fff;
    }
    .score {
        font-size: 0.8vw;
        background: #555;
        padding: 0.1em 0.3em;
        border-radius: 3px;
    }
    .button-container {
        display: flex;
        flex-direction: column;
        gap: 1px;
        margin-top: auto;
    }
    .toggle-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 1px 0;
        font-size: 0.9vw;
        padding: 1px;
        background: #222;
        border-radius: 2px;
    }
    .toggle {
        width: 3vw;
        height: 1.5vh;
        background: #555;
        border-radius: 2px;
        position: relative;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8vw;
        font-weight: bold;
        color: white;
    }
    .toggle.active {
        background: #0f0;
    }
    .copy-alert {
        position: absolute;
        bottom: -1.2em;
        left: 0;
        background: #333;
        padding: 0.1em 0.3em;
        font-size: 0.7vw;
        border-radius: 3px;
        opacity: 0.8;
    }
  `;
  document.head.appendChild(style);

  // ------------------------------
  // DELAY UI INIT UNTIL DOM IS READY, THEN WAIT 6 SECONDS
  // ------------------------------
  function delayedUIInit() {
    console.log("[UI] DOM ready; delaying UI init by 6 seconds.");
    setTimeout(() => {
      initUI();
    }, 6000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", delayedUIInit);
  } else {
    delayedUIInit();
  }

  console.log("[Combined Script] Finished initial setup.");
})();
