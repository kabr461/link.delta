(function () {
  "use strict";

  // ---------------------------------------------------
  // Global Error Handling & Logging
  // ---------------------------------------------------
  window.onerror = function (message, source, lineno, colno, error) {
    console.error("Global error caught:", message, "at", source, "line:", lineno, "col:", colno, "error:", error);
  };

  window.addEventListener('error', function (e) {
    console.error("Error event caught:", e);
  });

  window.addEventListener('unhandledrejection', function (e) {
    console.error("Unhandled rejection:", e.reason);
  });

  // ---------------------------------------------------
  // 1. GAME STATE HOOK
  // ---------------------------------------------------

  console.log("[Hook] Starting game state hook installation...");

  // Global game state object
  window.gameState = {
    players: {},   // keyed by playerID; will hold registration and tag data
    spectators: {} // keyed by playerID; used to store spectator info
  };

  // Define a full BinaryReader (with all needed methods)
  class BinaryReader {
    constructor(data) {
      if (data instanceof ArrayBuffer) {
        this.buffer = data;
      } else if (data instanceof Uint8Array) {
        // Use a copy of the underlying ArrayBuffer
        this.buffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
      } else {
        throw new Error("Unsupported data type for BinaryReader");
      }
      this.view = new DataView(this.buffer);
      this.offset = 0;
      this.le = true; // little-endian
    }
    readUInt8() {
      if (this.offset + 1 > this.view.byteLength) throw new RangeError("Offset out of bounds");
      const value = this.view.getUint8(this.offset);
      this.offset++;
      return value;
    }
    readUInt16() {
      if (this.offset + 2 > this.view.byteLength) throw new RangeError("Offset out of bounds");
      const value = this.view.getUint16(this.offset, this.le);
      this.offset += 2;
      return value;
    }
    readUInt32() {
      if (this.offset + 4 > this.view.byteLength) throw new RangeError("Offset out of bounds");
      const value = this.view.getUint32(this.offset, this.le);
      this.offset += 4;
      return value;
    }
    readInt16() {
      if (this.offset + 2 > this.view.byteLength) throw new RangeError("Offset out of bounds");
      const value = this.view.getInt16(this.offset, this.le);
      this.offset += 2;
      return value;
    }
    readInt32() {
      if (this.offset + 4 > this.view.byteLength) throw new RangeError("Offset out of bounds");
      const value = this.view.getInt32(this.offset, this.le);
      this.offset += 4;
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
    // Reads a length-prefixed UTF-16 string (first 16-bit length, then that many code units).
    readUTF16StringLength() {
      const len = this.readUInt16();
      let str = "";
      for (let i = 0; i < len; i++) {
        if (this.offset + 2 > this.view.byteLength) throw new RangeError("Offset out of bounds in readUTF16StringLength");
        const code = this.readUInt16();
        str += String.fromCharCode(code);
      }
      return str;
    }
    // Reads a null-terminated UTF-8 string.
    readUTF8StringZero() {
      let str = "";
      while (this.offset < this.view.byteLength) {
        const byte = this.readUInt8();
        if (byte === 0) break;
        str += String.fromCharCode(byte);
      }
      return str;
    }
    // You can add additional methods as required by your parsers.
  }

  // Install the WebSocket hook
  (function installGameStateHook() {
    console.log("[Hook] Installing WebSocket hook...");
    const OriginalWebSocket = window.WebSocket;
    const origAddEventListener = OriginalWebSocket.prototype.addEventListener;

    OriginalWebSocket.prototype.addEventListener = function (type, listener, options) {
      if (type === "message") {
        const wrappedListener = function (event) {
          // Process binary messages only
          if (event.data instanceof ArrayBuffer) {
            try {
              const rawData = new Uint8Array(event.data);
              console.log("[Hook] Raw binary data received:", rawData);

              // If your delta_packet parser exists, process the packet.
              if (window.delta_packet && window.delta_packet.parse) {
                const parsers = window.delta_packet.parse;

                // --- Auth Parsing ---
                try {
                  const authReader = new BinaryReader(event.data);
                  const authData = parsers.auth(authReader);
                  console.log("[Hook] Auth data:", authData);
                  if (authData && authData.playerID) {
                    window.gameState.players[authData.playerID] = window.gameState.players[authData.playerID] || {};
                    window.gameState.players[authData.playerID].auth = authData;
                    // Save our own playerID if applicable
                    window.myPlayerID = authData.playerID;
                  }
                } catch (err) {
                  console.warn("[Hook] Skipping auth parsing:", err.message);
                }

                // --- Client Registration Parsing ---
                try {
                  const regReader = new BinaryReader(event.data);
                  const regData = parsers.clientRegisterTab(regReader);
                  console.log("[Hook] Client register data:", regData);
                  if (regData && regData.playerID) {
                    window.gameState.players[regData.playerID] = Object.assign(window.gameState.players[regData.playerID] || {}, regData);
                    window.myPlayerID = regData.playerID;
                  }
                } catch (err) {
                  console.warn("[Hook] Skipping client register parsing:", err.message);
                }

                // --- Server Registration Parsing ---
                try {
                  const sRegReader = new BinaryReader(event.data);
                  const sRegData = parsers.serverRegisteredTab(sRegReader);
                  console.log("[Hook] Server register data:", sRegData);
                  if (sRegData && sRegData.playerID) {
                    window.gameState.players[sRegData.playerID] = Object.assign(window.gameState.players[sRegData.playerID] || {}, sRegData);
                  }
                } catch (err) {
                  // Ignore if not applicable
                }

                // --- Client Removal Parsing ---
                try {
                  const remReader = new BinaryReader(event.data);
                  const remData = parsers.clientRemoveTab(remReader);
                  console.log("[Hook] Client remove data:", remData);
                  if (remData && remData.playerID) {
                    delete window.gameState.players[remData.playerID];
                    delete window.gameState.spectators[remData.playerID];
                  }
                } catch (err) { }

                // --- Server Removal Parsing ---
                try {
                  const sRemReader = new BinaryReader(event.data);
                  const sRemData = parsers.serverRemovedTab(sRemReader);
                  console.log("[Hook] Server remove data:", sRemData);
                  if (sRemData && sRemData.playerID) {
                    delete window.gameState.players[sRemData.playerID];
                    delete window.gameState.spectators[sRemData.playerID];
                  }
                } catch (err) { }

                // --- Token/Tag Parsing ---
                try {
                  const tokenReader = new BinaryReader(event.data);
                  const tokenData = parsers.clientTokenTag(tokenReader);
                  console.log("[Hook] Token tag data:", tokenData);
                  if (tokenData && tokenData.playerID) {
                    window.gameState.players[tokenData.playerID] = Object.assign(window.gameState.players[tokenData.playerID] || {}, tokenData);
                  }
                } catch (err) { }

                // --- Spectator Parsing (e.g. using the "commander" parser) ---
                try {
                  const commReader = new BinaryReader(event.data);
                  const commData = parsers.commander(commReader);
                  console.log("[Hook] Commander (spectator) data:", commData);
                  if (Array.isArray(commData) && commData.length > 0) {
                    const pid = commData[0];
                    window.gameState.spectators[pid] = commData;
                  }
                } catch (err) { }
              } else {
                console.warn("[Hook] window.delta_packet.parse is not defined");
              }
            } catch (processingError) {
              console.error("[Hook] Error processing WebSocket data:", processingError);
            }
          }
          // Always call the original listener if it exists.
          if (typeof listener === "function") {
            try {
              listener(event);
            } catch (err) {
              console.error("[Hook] Error in original listener:", err);
            }
          }
        };
        origAddEventListener.call(this, type, wrappedListener, options);
      } else {
        origAddEventListener.call(this, type, listener, options);
      }
    };

    // Override onmessage property so that setting it still uses our hook.
    Object.defineProperty(OriginalWebSocket.prototype, "onmessage", {
      set: function (fn) {
        if (typeof fn === "function") {
          this.addEventListener("message", fn);
        }
      },
      get: function () {
        return null;
      }
    });

    console.log("[Hook] Game state hook installed. Current game state:", window.gameState);
  })();

  // ---------------------------------------------------
  // 2. UI CODE (Delayed Only)
  // ---------------------------------------------------
  function mainUI() {
    console.log("[UI] Starting UI initialization...");

    // Initialize spectate panel (which also sets up its own event listeners)
    initSpectate();

    // Update the spectate panel every 2 seconds with info from window.gameState
    setInterval(updateSpectatePanel, 2000);
  }

  // Update the spectate panel from window.gameState data
  function updateSpectatePanel() {
    const spectateTab = document.getElementById("spectateTab");
    if (!spectateTab) {
      console.warn("[UI] Spectate panel not found");
      return;
    }

    // Get our own tag from our player registration (if available)
    const myPlayer = window.gameState.players[window.myPlayerID];
    const myTag = myPlayer && myPlayer.tag ? myPlayer.tag : null;

    let userHtml = "";
    let userCount = 0;
    for (const pid in window.gameState.spectators) {
      const spec = window.gameState.spectators[pid];
      // Only show spectators with the same tag as ours (if we have one)
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

    let teamHtml = "";
    let teamCount = 0;
    for (const pid in window.gameState.players) {
      const player = window.gameState.players[pid];
      // Only show players in our team (adjust the property name as needed)
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

    // Update collapsible headers and content
    const userCollapsible = spectateTab.querySelector(".collapsible");
    if (userCollapsible) {
      userCollapsible.innerHTML = `Users (${userCount}) <span class="arrow">▶</span>`;
    }
    const userList = spectateTab.querySelector(".content.player-list");
    if (userList) {
      userList.innerHTML = userHtml;
    }
    const teamCollapsible = spectateTab.querySelectorAll(".collapsible")[1];
    if (teamCollapsible) {
      teamCollapsible.innerHTML = `Teams (${teamCount}) <span class="arrow">▶</span>`;
    }
    const teamList = spectateTab.querySelector(".content.team");
    if (teamList) {
      teamList.innerHTML = teamHtml;
    }
  }

  // ---------------------------------------------------
  // 3. UI FUNCTIONS (Spectate panel, chat observer, toggles, copy, etc.)
  // ---------------------------------------------------
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
              console.error("[MutationObserver] Error processing node:", err);
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
          console.error("[SpectateButton] Error during click:", err);
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
        <div class="content player-list"></div>
        <div class="collapsible" onclick="toggleCollapse(this)">
            Teams (0) <span class="arrow">▶</span>
        </div>
        <div class="content team"></div>
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
          console.error("[openSpectateTab] Animation error:", err);
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
      if (!textToCopy) return;
      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => showCopyAlert(container, "Copied!"))
          .catch(err => console.error("[copyPlayerInfo] Clipboard error:", err));
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

  // ---------------------------------------------------
  // 4. Delay UI Initialization ONLY (6 seconds)
  // ---------------------------------------------------
  if (document.readyState === "complete" || document.readyState === "interactive") {
    console.log("[UI] DOM ready; delaying UI init by 6 seconds.");
    setTimeout(mainUI, 8000);
  } else {
    window.addEventListener("DOMContentLoaded", function () {
      console.log("[UI] DOMContentLoaded fired; delaying UI init by 6 seconds.");
      setTimeout(mainUI, 8000);
    });
  }

  console.log("[Combined Script] Finished initial setup.");
})();
