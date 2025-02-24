(function () {
  "use strict";

  // ====================================================
  // GAME STATE HOOK SECTION (runs immediately)
  // ====================================================
  console.log("[Hook] Starting game state hook installation...");

  // Create a global gameState object
  window.gameState = {
    players: {},    // e.g. {1234: {playerID:1234, tag:"Hook", ...}, ...}
    spectators: {}  // e.g. {5678: [5678, ...], ...}
  };

  // Minimal BinaryReader for demonstration (use your actual one)
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
      if (this.offset + 1 > this.view.byteLength)
        throw new RangeError("Offset out of bounds");
      const value = this.view.getUint8(this.offset);
      this.offset++;
      return value;
    }
    // ... Add additional methods as needed
  }

  // Dummy parsers for demonstration (replace these with your actual parsing logic)
  const deltaPacketParsers = {
    auth(reader) {
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
        // In a real scenario, you’d extract a tag or nickname from the packet.
        return { playerID: id, tag: "Player" + id };
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
        // Again, replace this with real fields.
        return { playerID: id, clanTag: "Clan" + id };
      } catch (e) {
        throw e;
      }
    },
    commander(reader) {
      try {
        const id = reader.readUInt8();
        // For example, return an array with a playerID and additional data.
        return [id, "spectator", "extra info"];
      } catch (e) {
        throw e;
      }
    }
  };

  // Override WebSocket to intercept messages
  const OriginalWebSocket = window.WebSocket;
  const originalAddEventListener = OriginalWebSocket.prototype.addEventListener;
  OriginalWebSocket.prototype.addEventListener = function (type, listener, options) {
    if (type === "message") {
      const wrappedListener = function (event) {
        if (event.data instanceof ArrayBuffer) {
          try {
            const rawData = new Uint8Array(event.data);
            console.log("[Hook] Raw binary data received:", rawData);

            // Try parsing auth data
            try {
              const authReader = new BinaryReader(event.data);
              const authData = deltaPacketParsers.auth(authReader);
              console.log("[Hook] Auth data:", authData);
              if (authData && authData.playerID) {
                window.gameState.players[authData.playerID] =
                  window.gameState.players[authData.playerID] || {};
                window.gameState.players[authData.playerID].auth = authData;
              }
            } catch (e) { }

            // Try parsing client registration
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

            // Try parsing client removal
            try {
              const remReader = new BinaryReader(event.data);
              const remData = deltaPacketParsers.clientRemoveTab(remReader);
              console.log("[Hook] Client remove data:", remData);
              if (remData && remData.playerID) {
                delete window.gameState.players[remData.playerID];
                delete window.gameState.spectators[remData.playerID];
              }
            } catch (e) { }

            // Try parsing token/tag data
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

            // Try parsing spectator (commander) data
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

  Object.defineProperty(OriginalWebSocket.prototype, "onmessage", {
    set: function (fn) {
      this.addEventListener("message", fn);
    },
    get: function () {
      return null;
    }
  });

  console.log("[Hook] Game state hook installed. Current game state:", window.gameState);

  // ====================================================
  // UI CODE SECTION (Delayed by 6 seconds after DOM ready)
  // ====================================================
  function initUI() {
    console.log("[UI] Starting UI initialization...");
    console.log("[UI] Current game state:", window.gameState);
    buildSpectatePanel();
  }

  function buildSpectatePanel() {
    // Remove any existing panel first.
    const oldPanel = document.getElementById("spectateTab");
    if (oldPanel) oldPanel.remove();

    // Create a new panel container.
    const panel = document.createElement("div");
    panel.id = "spectateTab";
    panel.className = "spectate-tab";

    // Build dynamic content based on window.gameState
    // Create a section for players
    const playerSection = document.createElement("div");
    playerSection.className = "content player-list";
    const playerHeader = document.createElement("div");
    playerHeader.className = "collapsible";
    playerHeader.innerHTML = `Players (${Object.keys(window.gameState.players).length}) <span class="arrow">▶</span>`;
    playerHeader.onclick = () => toggleCollapse(playerHeader);
    panel.appendChild(playerHeader);
    panel.appendChild(playerSection);

    // Add each player dynamically
    Object.values(window.gameState.players).forEach(player => {
      const playerDiv = document.createElement("div");
      playerDiv.className = "player";
      playerDiv.innerHTML = `
        <div class="player-info" onclick="copyPlayerInfo(event, this)">
          <img src="https://via.placeholder.com/40" alt="User">
          <span>${player.tag || "Player " + player.playerID}</span>
        </div>
        <span class="player-tag">${player.clanTag || ""}</span>
      `;
      playerSection.appendChild(playerDiv);
    });

    // Create a section for spectators
    const specSection = document.createElement("div");
    specSection.className = "content player-list";
    const specHeader = document.createElement("div");
    specHeader.className = "collapsible";
    specHeader.innerHTML = `Spectators (${Object.keys(window.gameState.spectators).length}) <span class="arrow">▶</span>`;
    specHeader.onclick = () => toggleCollapse(specHeader);
    panel.appendChild(specHeader);
    panel.appendChild(specSection);

    // Add each spectator dynamically
    Object.values(window.gameState.spectators).forEach(spec => {
      const specDiv = document.createElement("div");
      specDiv.className = "player";
      // Assuming commData[1] holds some info; adjust as needed.
      specDiv.innerHTML = `
        <div class="player-info" onclick="copyPlayerInfo(event, this)">
          <img src="https://via.placeholder.com/40" alt="User">
          <span>Spectator ${spec[0]}</span>
        </div>
      `;
      specSection.appendChild(specDiv);
    });

    // Append the panel to the body.
    document.body.appendChild(panel);
    // Animate in:
    requestAnimationFrame(() => {
      panel.style.right = "0";
    });
  }

  function delayedUIInit() {
    console.log("[UI] DOM ready; delaying UI init by 6 seconds.");
    setTimeout(initUI, 6000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", delayedUIInit);
  } else {
    delayedUIInit();
  }

  // UI helper functions (they remain mostly unchanged)
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
      // If needed, start or stop command chat observer here.
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
          .then(() => {
            showCopyAlert(container, "Copied!");
          })
          .catch(err => {
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
        alertEl.remove();
      }, 1500);
    } catch (err) {
      console.error("[showCopyAlert] Exception:", err);
    }
  }

  // Append custom styles for the UI.
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

  console.log("[Combined Script] Finished initial setup.");
})();
