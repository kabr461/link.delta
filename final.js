(function () {
  "use strict";

  // ========================
  // 1. Install the Game State Hook Immediately
  // ========================
  // Ensure a global gameState object exists
  window.gameState = {
    players: {},    // player registration info keyed by playerID
    spectators: {}  // spectator info keyed by playerID
  };

  console.log("Game state hook initializing...");

  // Minimal BinaryReader (only needed methods for our parsers)
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
      this.le = true;
    }
    readUInt8() {
      const value = this.view.getUint8(this.offset);
      this.offset++;
      return value;
    }
    readUInt16() {
      const value = this.view.getUint16(this.offset, this.le);
      this.offset += 2;
      return value;
    }
    readInt16() {
      const value = this.view.getInt16(this.offset, this.le);
      this.offset += 2;
      return value;
    }
    // Reads a null-terminated UTF-16 string.
    readUTF16StringZero() {
      let str = "";
      while (this.offset + 2 <= this.view.byteLength) {
        const code = this.readUInt16();
        if (code === 0) break;
        str += String.fromCharCode(code);
      }
      return str;
    }
  }

  // (Assuming that your game’s parser functions exist under window.delta_packet.parse)
  // The hook intercepts WebSocket messages and calls parser functions.
  (function installGameStateHook() {
    // Log that the hook is being installed
    console.log("Installing WebSocket hook to capture game state...");

    // Override WebSocket addEventListener to wrap "message" events.
    const OriginalWebSocket = window.WebSocket;
    const originalAddEventListener = OriginalWebSocket.prototype.addEventListener;

    OriginalWebSocket.prototype.addEventListener = function (type, listener, options) {
      if (type === "message") {
        const wrappedListener = function (event) {
          if (event.data instanceof ArrayBuffer) {
            try {
              // Log the raw binary data for debugging
              const rawData = new Uint8Array(event.data);
              console.log("Raw binary data:", rawData);

              if (window.delta_packet && window.delta_packet.parse) {
                const parsers = window.delta_packet.parse;

                // Process auth events
                try {
                  const authReader = new BinaryReader(event.data);
                  const authData = parsers.auth(authReader);
                  console.log("Auth data:", authData);
                  if (authData && authData.playerID) {
                    window.gameState.players[authData.playerID] =
                      window.gameState.players[authData.playerID] || {};
                    window.gameState.players[authData.playerID].auth = authData;
                    // Optionally, save our own playerID if this is our registration
                    window.myPlayerID = authData.playerID;
                  }
                } catch (err) { /* ignore if not applicable */ }

                // Process client registration
                try {
                  const regReader = new BinaryReader(event.data);
                  const regData = parsers.clientRegisterTab(regReader);
                  console.log("Client register data:", regData);
                  if (regData && regData.playerID) {
                    window.gameState.players[regData.playerID] =
                      Object.assign(window.gameState.players[regData.playerID] || {}, regData);
                    // Mark this as our own player registration if needed
                    window.myPlayerID = regData.playerID;
                  }
                } catch (err) { /* not every packet is a registration */ }

                // Process server registration (if available)
                try {
                  const sRegReader = new BinaryReader(event.data);
                  const sRegData = parsers.serverRegisteredTab(sRegReader);
                  console.log("Server register data:", sRegData);
                  if (sRegData && sRegData.playerID) {
                    window.gameState.players[sRegData.playerID] =
                      Object.assign(window.gameState.players[sRegData.playerID] || {}, sRegData);
                  }
                } catch (err) { }

                // Process player removals (client side)
                try {
                  const remReader = new BinaryReader(event.data);
                  const remData = parsers.clientRemoveTab(remReader);
                  console.log("Client remove data:", remData);
                  if (remData && remData.playerID) {
                    delete window.gameState.players[remData.playerID];
                    delete window.gameState.spectators[remData.playerID];
                  }
                } catch (err) { }

                // Process player removals (server side)
                try {
                  const sRemReader = new BinaryReader(event.data);
                  const sRemData = parsers.serverRemovedTab(sRemReader);
                  console.log("Server remove data:", sRemData);
                  if (sRemData && sRemData.playerID) {
                    delete window.gameState.players[sRemData.playerID];
                    delete window.gameState.spectators[sRemData.playerID];
                  }
                } catch (err) { }

                // Process token/tag events
                try {
                  const tokenReader = new BinaryReader(event.data);
                  const tokenData = parsers.clientTokenTag(tokenReader);
                  console.log("Token tag data:", tokenData);
                  if (tokenData && tokenData.playerID) {
                    window.gameState.players[tokenData.playerID] =
                      Object.assign(window.gameState.players[tokenData.playerID] || {}, tokenData);
                  }
                } catch (err) { }

                // Process spectator info via the "commander" parser
                try {
                  const commReader = new BinaryReader(event.data);
                  const commData = parsers.commander(commReader);
                  console.log("Commander (spectator) data:", commData);
                  // Here we assume commData is an array whose first element is the playerID
                  if (Array.isArray(commData) && commData.length > 0) {
                    const pid = commData[0];
                    window.gameState.spectators[pid] = commData;
                  }
                } catch (err) { }
              }
            } catch (processingError) {
              console.error("Error processing WebSocket data for game state:", processingError);
            }
          }
          // Forward the event to the original listener
          listener(event);
        };
        originalAddEventListener.call(this, type, wrappedListener, options);
      } else {
        originalAddEventListener.call(this, type, listener, options);
      }
    };

    // Also override the onmessage property so that setting it uses our wrapped listener.
    Object.defineProperty(OriginalWebSocket.prototype, "onmessage", {
      set: function (fn) {
        this.addEventListener("message", fn);
      },
      get: function () {
        return null;
      }
    });

    console.log("Game state hook installed. Current game state:", window.gameState);
  })();

  // ========================
  // 2. UI Code (Delayed by 6 seconds)
  // ========================
  function mainUI() {
    console.log("Starting UI initialization...");

    // Initialize the spectate panel
    initSpectate();

    // Start updating the spectate panel periodically (every 2 seconds)
    setInterval(updateSpectatePanel, 2000);
  }

  // Function to update the spectate panel using window.gameState data.
  // Only shows spectators and team players whose "tag" equals our own player's tag.
  function updateSpectatePanel() {
    // For demonstration, assume our own player's tag is stored as gameState.players[myPlayerID].tag
    const myPlayer = window.gameState.players[window.myPlayerID];
    const myTag = myPlayer && myPlayer.tag ? myPlayer.tag : null;
    const spectateTab = document.getElementById("spectateTab");
    if (!spectateTab) return;

    // Build the "Users" list from spectators with matching tag.
    let userHtml = "";
    let userCount = 0;
    for (const pid in window.gameState.spectators) {
      const spec = window.gameState.spectators[pid];
      // (Assume that the tag is stored in spec[?]. For example, here we assume spec[1] holds the tag.)
      if (myTag && spec[1] === myTag) {
        userCount++;
        userHtml += `<div class="player">
          <div class="player-info" onclick="copyPlayerInfo(event, this)">
            <img src="https://via.placeholder.com/40" alt="User">
            <span>${pid}</span>
          </div>
          <span class="player-tag">${myTag}</span>
        </div>`;
      }
    }

    // Build the "Teams" list from players whose team equals our tag.
    let teamHtml = "";
    let teamCount = 0;
    for (const pid in window.gameState.players) {
      const player = window.gameState.players[pid];
      // (Assume that the player's team is stored in player.team.)
      if (myTag && player.team === myTag) {
        teamCount++;
        teamHtml += `<div class="player">
          <div class="tick-button" onclick="toggleTick(event, this)">☐</div>
          <div class="player-info" onclick="copyPlayerInfo(event, this)">
            <img src="https://via.placeholder.com/40" alt="User">
            <span>${pid}</span>
          </div>
          <span class="score">${player.score || 0}</span>
        </div>`;
      }
    }

    // Update the UI elements.
    const userCollapsible = spectateTab.querySelector(".collapsible");
    if (userCollapsible) {
      userCollapsible.textContent = `Users (${userCount})`;
      userCollapsible.innerHTML += `<span class="arrow">▶</span>`;
    }
    const userList = spectateTab.querySelector(".content.player-list");
    if (userList) {
      userList.innerHTML = userHtml;
    }
    const collapsibles = spectateTab.querySelectorAll(".collapsible");
    if (collapsibles.length >= 2) {
      collapsibles[1].textContent = `Teams (${teamCount})`;
      collapsibles[1].innerHTML += `<span class="arrow">▶</span>`;
    }
    const teamList = spectateTab.querySelector(".content.team");
    if (teamList) {
      teamList.innerHTML = teamHtml;
    }
  }

  // UI functions from your working code:

  let cmdObserver = null;
  function initChatObserver() {
    try {
      const chatContainer = document.querySelector(".chatmessages");
      if (!chatContainer) {
        return setTimeout(initChatObserver, 500);
      }
      cmdObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
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
  window.startCmdObserver = function () {
    if (cmdObserver) return;
    initChatObserver();
  };
  window.stopCmdObserver = function () {
    if (cmdObserver) {
      cmdObserver.disconnect();
      cmdObserver = null;
    }
  };

  function initSpectate() {
    try {
      const spectateBtn = Array.from(document.querySelectorAll("div.btn-layer")).find(
        (el) => el.textContent.trim() === "Spectate"
      );
      if (!spectateBtn) {
        return setTimeout(initSpectate, 500);
      }
      spectateBtn.addEventListener("click", function () {
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
      if (document.getElementById("spectateTab")) {
        document.getElementById("spectateTab").style.right = "0";
        return;
      }
      const spectateTab = document.createElement("div");
      spectateTab.id = "spectateTab";
      spectateTab.className = "spectate-tab";
      spectateTab.innerHTML = `
        <div class="collapsible" onclick="toggleCollapse(this)">
            Users (0) <span class="arrow">▶</span>
        </div>
        <div class="content player-list">
        </div>
        <div class="collapsible" onclick="toggleCollapse(this)">
            Teams (0) <span class="arrow">▶</span>
        </div>
        <div class="content team">
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
        try {
          spectateTab.style.right = "0";
        } catch (err) {
          console.error("[openSpectateTab] Error during animation:", err);
        }
      });
    } catch (err) {
      console.error("[openSpectateTab] Exception:", err);
    }
  }

  window.toggleCollapse = function (element) {
    try {
      element.classList.toggle("active");
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
      element.classList.toggle("active");
      element.textContent = element.classList.contains("active") ? "ON" : "OFF";
      if (element.id === "cmdChatToggle") {
        element.classList.contains("active") ? startCmdObserver() : stopCmdObserver();
      }
    } catch (err) {
      console.error("[toggleSwitch] Exception:", err);
    }
  };

  window.toggleTick = function (event, element) {
    try {
      element.textContent = element.textContent.trim() === "✓" ? "☐" : "✓";
      event.stopPropagation();
    } catch (err) {
      console.error("[toggleTick] Exception:", err);
    }
  };

  window.copyPlayerInfo = function (event, container) {
    try {
      event.stopPropagation();
      let textToCopy = "";
      const target = event.target;
      if (target.tagName.toLowerCase() === "img") {
        textToCopy = target.src;
      } else if (target.tagName.toLowerCase() === "span") {
        textToCopy = target.textContent.trim();
      } else {
        const span = container.querySelector("span");
        if (span) {
          textToCopy = span.textContent.trim();
        }
      }
      if (!textToCopy) {
        return;
      }
      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            showCopyAlert(container, "Copied!");
          })
          .catch((err) => {
            console.error("[copyPlayerInfo] Clipboard write failed:", err);
          });
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand("copy");
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
      const alertEl = document.createElement("div");
      alertEl.textContent = message;
      alertEl.className = "copy-alert";
      parent.appendChild(alertEl);
      setTimeout(() => {
        try {
          alertEl.remove();
        } catch (err) {
          console.error("[showCopyAlert] Error removing alert:", err);
        }
      }, 1500);
    } catch (err) {
      console.error("[showCopyAlert] Exception:", err);
    }
  }

  document.addEventListener("keydown", function (e) {
    try {
      if (e.key === "Escape") {
        const spectateTab = document.getElementById("spectateTab");
        if (spectateTab) {
          spectateTab.style.right = "-15vw";
          setTimeout(() => {
            try {
              spectateTab.remove();
            } catch (err) {
              console.error("[keydown] Error removing spectate panel:", err);
            }
          }, 500);
        }
      }
    } catch (err) {
      console.error("[keydown] Exception:", err);
    }
  });

  const style = document.createElement("style");
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

  // ========================
  // 3. Start UI Code after 6 seconds delay
  // ========================
  if (document.readyState === "complete" || document.readyState === "interactive") {
    console.log("DOM already ready; delaying UI init by 6 seconds.");
    setTimeout(mainUI, 6000);
  } else {
    window.addEventListener("DOMContentLoaded", function () {
      console.log("DOMContentLoaded fired; delaying UI init by 6 seconds.");
      setTimeout(mainUI, 6000);
    });
  }
})();
