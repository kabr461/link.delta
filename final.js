(function() {
  "use strict";

  // ----------------------------
  // BinaryReader utility for parsing binary packets
  // ----------------------------
  class BinaryReader {
    constructor(data) {
      if (data instanceof ArrayBuffer) {
        this.buffer = data;
      } else if (data instanceof Uint8Array) {
        this.buffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
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
    readUInt16() {
      if (this.offset + 2 > this.view.byteLength)
        throw new RangeError("Offset out of bounds");
      const value = this.view.getUint16(this.offset, this.le);
      this.offset += 2;
      return value;
    }
    readUInt32() {
      if (this.offset + 4 > this.view.byteLength)
        throw new RangeError("Offset out of bounds");
      const value = this.view.getUint32(this.offset, this.le);
      this.offset += 4;
      return value;
    }
    readInt16() {
      if (this.offset + 2 > this.view.byteLength)
        throw new RangeError("Offset out of bounds");
      const value = this.view.getInt16(this.offset, this.le);
      this.offset += 2;
      return value;
    }
    readInt32() {
      if (this.offset + 4 > this.view.byteLength)
        throw new RangeError("Offset out of bounds");
      const value = this.view.getInt32(this.offset, this.le);
      this.offset += 4;
      return value;
    }
    readUTF16StringZero() {
      let str = "";
      while (this.offset + 2 <= this.view.byteLength) {
        const code = this.readUInt16();
        if (code === 0) break;
        str += String.fromCharCode(code);
      }
      return str;
    }
    readUTF16StringLength() {
      const len = this.readUInt16();
      let str = "";
      for (let i = 0; i < len; i++) {
        if (this.offset + 2 > this.view.byteLength)
          throw new RangeError("Offset out of bounds");
        const code = this.readUInt16();
        str += String.fromCharCode(code);
      }
      return str;
    }
    readUTF8StringZero() {
      let str = "";
      while (this.offset < this.view.byteLength) {
        const byte = this.readUInt8();
        if (byte === 0) break;
        str += String.fromCharCode(byte);
      }
      return str;
    }
  }

  // ----------------------------
  // Global Game State Hook (runs immediately)
  // ----------------------------
  window.gameState = {
    players: {},   // keyed by playerID; holds registration and token data
    spectators: {} // keyed by playerID; holds spectator info arrays
  };

  // Helper functions to update game state.
  function updatePlayerFromRegister(data) {
    if (data && data.playerID) {
      window.gameState.players[data.playerID] =
        Object.assign(window.gameState.players[data.playerID] || {}, data);
      console.log("Updated player registration:", window.gameState.players[data.playerID]);
    }
  }
  function removePlayer(playerID) {
    console.log("Removing player:", playerID);
    delete window.gameState.players[playerID];
    delete window.gameState.spectators[playerID];
  }
  function updatePlayerToken(data) {
    if (data && data.playerID) {
      window.gameState.players[data.playerID] =
        Object.assign(window.gameState.players[data.playerID] || {}, data);
      console.log("Updated player token tags:", window.gameState.players[data.playerID]);
    }
  }
  function updateSpectator(data) {
    if (Array.isArray(data) && data.length > 0) {
      const playerID = data[0];
      window.gameState.spectators[playerID] = data;
      console.log("Updated spectator info for player", playerID, ":", data);
    }
  }

  // ----------------------------
  // WebSocket Interception – Wrap message events to capture packets.
  // ----------------------------
  const OriginalWebSocket = window.WebSocket;
  const originalAddEventListener = OriginalWebSocket.prototype.addEventListener;
  OriginalWebSocket.prototype.addEventListener = function(type, listener, options) {
    if (type === "message") {
      const wrappedListener = function(event) {
        if (event.data instanceof ArrayBuffer) {
          try {
            const rawData = new Uint8Array(event.data);
            console.log("Raw binary data:", rawData);
            if (window.delta_packet && window.delta_packet.parse) {
              const parsers = window.delta_packet.parse;
              try {
                const authReader = new BinaryReader(event.data);
                const authData = parsers.auth(authReader);
                console.log("Auth data:", authData);
                if (authData && authData.playerID) {
                  window.gameState.players[authData.playerID] =
                    window.gameState.players[authData.playerID] || {};
                  window.gameState.players[authData.playerID].auth = authData;
                }
              } catch (err) { }
              try {
                const regReader = new BinaryReader(event.data);
                const regData = parsers.clientRegisterTab(regReader);
                console.log("Client register data:", regData);
                updatePlayerFromRegister(regData);
              } catch (err) { }
              try {
                const sRegReader = new BinaryReader(event.data);
                const sRegData = parsers.serverRegisteredTab(sRegReader);
                console.log("Server register data:", sRegData);
                updatePlayerFromRegister(sRegData);
              } catch (err) { }
              try {
                const remReader = new BinaryReader(event.data);
                const remData = parsers.clientRemoveTab(remReader);
                console.log("Client remove data:", remData);
                if (remData && remData.playerID) removePlayer(remData.playerID);
              } catch (err) { }
              try {
                const sRemReader = new BinaryReader(event.data);
                const sRemData = parsers.serverRemovedTab(sRemReader);
                console.log("Server remove data:", sRemData);
                if (sRemData && sRemData.playerID) removePlayer(sRemData.playerID);
              } catch (err) { }
              try {
                const tokenReader = new BinaryReader(event.data);
                const tokenData = parsers.clientTokenTag(tokenReader);
                console.log("Token tag data:", tokenData);
                if (tokenData && tokenData.playerID) updatePlayerToken(tokenData);
              } catch (err) { }
              try {
                const commReader = new BinaryReader(event.data);
                const commData = parsers.commander(commReader);
                console.log("Commander (spectator) data:", commData);
                updateSpectator(commData);
              } catch (err) { }
            }
          } catch (processingError) {
            console.error("Error processing WebSocket data for game state:", processingError);
          }
        }
        listener(event);
      };
      originalAddEventListener.call(this, type, wrappedListener, options);
    } else {
      originalAddEventListener.call(this, type, listener, options);
    }
  };

  Object.defineProperty(OriginalWebSocket.prototype, "onmessage", {
    set: function(fn) {
      this.addEventListener("message", fn);
    },
    get: function() {
      return null;
    }
  });

  console.log("Game state hook installed. Current game state:", window.gameState);

  // ----------------------------
  // UI Panel Code (delayed by 6 seconds to wait for DOM load)
  // ----------------------------
  function initUI() {
    console.log("Initializing UI. Current game state:", window.gameState);
    waitForGameState();
  }
  function waitForGameState() {
    if (!window.gameState || !window.gameState.players) {
      console.log("Game state is still undefined. Waiting...");
      return setTimeout(waitForGameState, 1000);
    }
    console.log("Game state is available:", window.gameState);
    updateUI();
  }
  function updateUI() {
    console.log("Updating UI with game state:", window.gameState);
    const myTag = localStorage.getItem("myTag") || "defaultTag";
    const playersDiv = document.getElementById('playersList');
    const spectatorsDiv = document.getElementById('spectatorsList');
    if (playersDiv) {
      playersDiv.innerHTML = '';
      Object.values(window.gameState.players).forEach(player => {
        if (player.tokenTag === myTag) {
          const div = document.createElement('div');
          div.textContent = `Player ${player.playerID} Tag: ${player.tokenTag || ''}`;
          playersDiv.appendChild(div);
        }
      });
    }
    if (spectatorsDiv) {
      spectatorsDiv.innerHTML = '';
      Object.values(window.gameState.spectators).forEach(spect => {
        // Assuming that for commander data, the fourth element (index 3) holds the tag.
        if (spect[3] === myTag) {
          const div = document.createElement('div');
          div.textContent = `Spectator ${spect[0]} Tag: ${spect[3] || ''}`;
          spectatorsDiv.appendChild(div);
        }
      });
    }
  }

  // ----------------------------
  // UI Panel – Spectate Panel Code (as before)
  // ----------------------------
  let cmdObserver = null;
  function initChatObserver() {
    try {
      const chatContainer = document.querySelector('.chatmessages');
      if (!chatContainer) return setTimeout(initChatObserver, 500);
      cmdObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            try {
              if (node.nodeType === Node.ELEMENT_NODE && node.matches("li.message")) {
                node.classList.add("command");
                const textDiv = node.querySelector("div.text");
                if (textDiv) {
                  textDiv.style.fontWeight = "bold";
                }
              }
            } catch (err) {
              console.error("[MutationObserver] Error processing added node:", err);
            }
          });
        });
      });
      cmdObserver.observe(chatContainer, { childList: true, subtree: true });
    } catch (err) {
      console.error("[initChatObserver] Exception:", err);
    }
  }
  window.startCmdObserver = function() {
    if (cmdObserver) return;
    initChatObserver();
  };
  window.stopCmdObserver = function() {
    if (cmdObserver) {
      cmdObserver.disconnect();
      cmdObserver = null;
    }
  };
  function initSpectate() {
    try {
      const spectateBtn = Array.from(document.querySelectorAll('div.btn-layer'))
        .find(el => el.textContent.trim() === 'Spectate');
      if (!spectateBtn) {
        console.log("Spectate button not found. Retrying...");
        return setTimeout(initSpectate, 500);
      }
      spectateBtn.addEventListener('click', function() {
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
            Users (Matching) <span class="arrow">▶</span>
        </div>
        <div class="content player-list" id="playersList">
        </div>
        <div class="collapsible" onclick="toggleCollapse(this)">
            Spectators (Matching) <span class="arrow">▶</span>
        </div>
        <div class="content team" id="spectatorsList">
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
      console.log("Spectate tab created and appended.");
      requestAnimationFrame(() => {
        try {
          spectateTab.style.right = '0';
        } catch (err) {
          console.error("[openSpectateTab] Error during animation:", err);
        }
      });
    } catch (err) {
      console.error("[openSpectateTab] Exception:", err);
    }
  }
  window.toggleCollapse = function(element) {
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
  window.toggleSwitch = function(element) {
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
  window.toggleTick = function(event, element) {
    try {
      element.textContent = element.textContent.trim() === '✓' ? '☐' : '✓';
      event.stopPropagation();
    } catch (err) {
      console.error("[toggleTick] Exception:", err);
    }
  };
  window.copyPlayerInfo = function(event, container) {
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
        if (span) textToCopy = span.textContent.trim();
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
        try { alertEl.remove(); } catch (err) { console.error("[showCopyAlert] Error removing alert:", err); }
      }, 1500);
    } catch (err) {
      console.error("[showCopyAlert] Exception:", err);
    }
  }
  document.addEventListener('keydown', function(e) {
    try {
      if (e.key === 'Escape') {
        const spectateTab = document.getElementById('spectateTab');
        if (spectateTab) {
          spectateTab.style.right = '-15vw';
          setTimeout(() => {
            try { spectateTab.remove(); } catch (err) { console.error("[keydown] Error removing spectate panel:", err); }
          }, 500);
        }
      }
    } catch (err) {
      console.error("[keydown] Exception:", err);
    }
  });
  const style = document.createElement('style');
  style.innerHTML = `
    .spectate-tab { position: fixed; top: 50%; right: -15vw; transform: translateY(-50%); width: 12vw; max-width: 180px; height: 50vh; max-height: 420px; background: #0d0d0d; padding: 0.5vw; border-radius: 5px; border: 1px solid #444; box-shadow: 0 0 10px rgba(0,0,0,0.8); transition: right 0.5s ease-out; color: white; font-family: Arial, sans-serif; z-index: 10000; display: flex; flex-direction: column; }
    .collapsible { cursor: pointer; display: flex; justify-content: space-between; align-items: center; padding: 4px 5px; background: #222; border: 1px solid #444; font-size: 0.9vw; font-weight: bold; }
    .arrow { transform: rotate(0deg); transition: transform 0.3s ease-in-out; }
    .collapsible.active .arrow { transform: rotate(90deg); }
    .content { display: none; padding: 5px; background: #181818; border-top: 1px solid #444; }
    .player { display: flex; align-items: center; justify-content: space-between; padding: 0.3vh 0; font-size: 1vw; color: #ddd; }
    .player-info { display: flex; align-items: center; cursor: pointer; }
    .player-info img { width: 2vw; height: 2vw; border-radius: 50%; margin-right: 0.3vw; cursor: pointer; }
    .player-info span { cursor: pointer; }
    .tick-button { color: #0f0; font-size: 1vw; cursor: pointer; }
    .player-tag { background: #888; padding: 0.2em 0.5em; border-radius: 4px; font-size: 0.85vw; color: #fff; }
    .score { font-size: 0.8vw; background: #555; padding: 0.1em 0.3em; border-radius: 3px; }
    .button-container { display: flex; flex-direction: column; gap: 1px; margin-top: auto; }
    .toggle-container { display: flex; justify-content: space-between; align-items: center; margin: 1px 0; font-size: 0.9vw; padding: 1px; background: #222; border-radius: 2px; }
    .toggle { width: 3vw; height: 1.5vh; background: #555; border-radius: 2px; position: relative; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.8vw; font-weight: bold; color: white; }
    .toggle.active { background: #0f0; }
    .copy-alert { position: absolute; bottom: -1.2em; left: 0; background: #333; padding: 0.1em 0.3em; font-size: 0.7vw; border-radius: 3px; opacity: 0.8; }
  `;
  document.head.appendChild(style);

  // ----------------------------
  // Delay only the UI initialization by 6 seconds (no delay for gameState hooking)
  // ----------------------------
  function mainUI() {
    console.log("Starting UI initialization...");
    initSpectate();
    // Kick off UI update loop after DOM is ready
    waitForGameState();
  }
  function waitForGameState() {
    if (!window.gameState || !window.gameState.players) {
      console.log("Game state is still undefined. Waiting...");
      return setTimeout(waitForGameState, 1000);
    }
    console.log("Game state is available:", window.gameState);
    updateUI();
  }
  function updateUI() {
    console.log("Updating UI with game state:", window.gameState);
    const myTag = localStorage.getItem("myTag") || "defaultTag";
    const playersDiv = document.getElementById('playersList');
    const spectatorsDiv = document.getElementById('spectatorsList');
    if (playersDiv) {
      playersDiv.innerHTML = '';
      Object.values(window.gameState.players).forEach(player => {
        if (player.tokenTag === myTag) {
          const div = document.createElement('div');
          div.textContent = `Player ${player.playerID} Tag: ${player.tokenTag || ''}`;
          playersDiv.appendChild(div);
        }
      });
    }
    if (spectatorsDiv) {
      spectatorsDiv.innerHTML = '';
      Object.values(window.gameState.spectators).forEach(spect => {
        if (spect[3] === myTag) {
          const div = document.createElement('div');
          div.textContent = `Spectator ${spect[0]} Tag: ${spect[3] || ''}`;
          spectatorsDiv.appendChild(div);
        }
      });
    }
  }

  // ----------------------------
  // Start UI initialization after 6 seconds (delay only for UI)
  // ----------------------------
  setTimeout(mainUI, 8000);

  console.log("Combined script loaded – game state hook installed and UI will initialize after a delay.");
})();
