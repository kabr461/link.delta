/* =====================================================
   PART 1: GAME STATE HOOK
   This portion installs a hook on WebSocket messages to
   update a global game state object.
   (Run at document-start.)
===================================================== */
(function installGameStateHook() {
  "use strict";
  console.log("[Hook] Starting game state hook installation...");

  // Create a global game state object.
  window.gameState = {
    players: {},    // { playerID: { playerID, tag, clanTag, auth, … } }
    spectators: {}  // { playerID: [playerID, …, extraInfo] }
  };

  // --- Dummy BinaryReader (replace with your real implementation) ---
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
      return this.view.getUint8(this.offset++);
    }
    // ... add other methods as needed
  }

  // --- Dummy delta packet parsers (replace with your real parsers) ---
  const parsers = {
    auth(reader) {
      try {
        // Example: read one UInt8 as the playerID.
        return { playerID: reader.readUInt8() };
      } catch (e) {
        throw e;
      }
    },
    clientRegisterTab(reader) {
      try {
        const id = reader.readUInt8();
        // For example, create a tag based on the id.
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
        return { playerID: id, clanTag: "Clan" + id };
      } catch (e) {
        throw e;
      }
    },
    commander(reader) {
      try {
        const id = reader.readUInt8();
        // Return an array (dummy data) for a spectator.
        return [id, "spectator", "extra info"];
      } catch (e) {
        throw e;
      }
    }
  };

  // Helper functions to update the global game state.
  function updatePlayer(regData) {
    if (regData && regData.playerID) {
      window.gameState.players[regData.playerID] =
        Object.assign(window.gameState.players[regData.playerID] || {}, regData);
      console.log("[Hook] Updated player registration:", window.gameState.players[regData.playerID]);
    }
  }

  function removePlayer(playerID) {
    console.log("[Hook] Removing player:", playerID);
    delete window.gameState.players[playerID];
    delete window.gameState.spectators[playerID];
  }

  function updateSpectator(specData) {
    if (Array.isArray(specData) && specData.length > 0) {
      const playerID = specData[0];
      window.gameState.spectators[playerID] = specData;
      console.log("[Hook] Updated spectator info for player", playerID, ":", specData);
    }
  }

  // --- Override WebSocket's message handler ---
  const OriginalWebSocket = window.WebSocket;
  const originalAddEventListener = OriginalWebSocket.prototype.addEventListener;

  OriginalWebSocket.prototype.addEventListener = function (type, listener, options) {
    if (type === "message") {
      const wrappedListener = function (event) {
        if (event.data instanceof ArrayBuffer) {
          try {
            const rawData = new Uint8Array(event.data);
            console.log("[Hook] Raw binary data received:", rawData);

            // Try parsing different kinds of packets.
            try {
              const reader = new BinaryReader(event.data);
              const authData = parsers.auth(reader);
              console.log("[Hook] Auth data:", authData);
              if (authData && authData.playerID) {
                window.gameState.players[authData.playerID] =
                  window.gameState.players[authData.playerID] || {};
                window.gameState.players[authData.playerID].auth = authData;
              }
            } catch (e) { /* ignore if not auth packet */ }

            try {
              const reader = new BinaryReader(event.data);
              const regData = parsers.clientRegisterTab(reader);
              console.log("[Hook] Client register data:", regData);
              updatePlayer(regData);
            } catch (e) { /* not a registration packet */ }

            try {
              const reader = new BinaryReader(event.data);
              const remData = parsers.clientRemoveTab(reader);
              console.log("[Hook] Client remove data:", remData);
              if (remData && remData.playerID) removePlayer(remData.playerID);
            } catch (e) { /* not a removal packet */ }

            try {
              const reader = new BinaryReader(event.data);
              const tokenData = parsers.clientTokenTag(reader);
              console.log("[Hook] Token tag data:", tokenData);
              updatePlayer(tokenData);
            } catch (e) { /* not a token packet */ }

            try {
              const reader = new BinaryReader(event.data);
              const specData = parsers.commander(reader);
              console.log("[Hook] Commander (spectator) data:", specData);
              updateSpectator(specData);
            } catch (e) { /* not a commander packet */ }

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

  // Also override the onmessage property.
  Object.defineProperty(OriginalWebSocket.prototype, "onmessage", {
    set: function (fn) {
      this.addEventListener("message", fn);
    },
    get: function () {
      return null;
    }
  });

  console.log("[Hook] Game state hook installed. Current game state:", window.gameState);
})();

/* =====================================================
   PART 2: UI CODE
   This portion waits until the DOM is ready (plus an extra
   6‑second delay) then dynamically builds a UI panel based
   on the global window.gameState.
===================================================== */
(function initUI() {
  "use strict";

  function mainUI() {
    console.log("[UI] Starting UI initialization...");
    console.log("[UI] Current game state:", window.gameState);
    buildSpectatePanel();
  }

  function buildSpectatePanel() {
    // Remove any existing UI panel.
    const oldPanel = document.getElementById("spectateTab");
    if (oldPanel) oldPanel.remove();

    // Create the panel container.
    const panel = document.createElement("div");
    panel.id = "spectateTab";
    panel.className = "spectate-tab";

    // Build Players section dynamically.
    const players = window.gameState.players;
    const playerIDs = Object.keys(players);
    const playerCount = playerIDs.length;
    const playerHeader = document.createElement("div");
    playerHeader.className = "collapsible";
    playerHeader.innerHTML = `Players (${playerCount}) <span class="arrow">▶</span>`;
    playerHeader.onclick = () => toggleCollapse(playerHeader);
    const playerList = document.createElement("div");
    playerList.className = "content player-list";
    if (playerCount === 0) {
      playerList.innerHTML = `<div class="player">No players</div>`;
    } else {
      playerIDs.forEach(id => {
        const player = players[id];
        const tag = player.tag || ("Player " + id);
        const clan = player.clanTag || "";
        const playerDiv = document.createElement("div");
        playerDiv.className = "player";
        playerDiv.innerHTML = `
          <div class="player-info" onclick="copyPlayerInfo(event, this)">
            <img src="https://via.placeholder.com/40" alt="User">
            <span>${tag}</span>
          </div>
          <span class="player-tag">${clan}</span>
        `;
        playerList.appendChild(playerDiv);
      });
    }
    panel.appendChild(playerHeader);
    panel.appendChild(playerList);

    // Build Spectators section dynamically.
    const spectators = window.gameState.spectators;
    const specIDs = Object.keys(spectators);
    const specCount = specIDs.length;
    const specHeader = document.createElement("div");
    specHeader.className = "collapsible";
    specHeader.innerHTML = `Spectators (${specCount}) <span class="arrow">▶</span>`;
    specHeader.onclick = () => toggleCollapse(specHeader);
    const specList = document.createElement("div");
    specList.className = "content player-list";
    if (specCount === 0) {
      specList.innerHTML = `<div class="player">No spectators</div>`;
    } else {
      specIDs.forEach(id => {
        // For example, assume the first element in the array is the ID.
        const specData = spectators[id];
        const specDiv = document.createElement("div");
        specDiv.className = "player";
        specDiv.innerHTML = `
          <div class="player-info" onclick="copyPlayerInfo(event, this)">
            <img src="https://via.placeholder.com/40" alt="User">
            <span>Spectator ${specData[0]}</span>
          </div>
        `;
        specList.appendChild(specDiv);
      });
    }
    panel.appendChild(specHeader);
    panel.appendChild(specList);

    // (Optional) Add other sections (e.g. Teams) as needed...

    // Append panel to body and animate it in.
    document.body.appendChild(panel);
    requestAnimationFrame(() => {
      panel.style.right = "0";
    });
  }

  // UI helper functions (they mirror your previous code).
  window.toggleCollapse = function(element) {
    try {
      element.classList.toggle("active");
      const content = element.nextElementSibling;
      content.style.display = (content.style.display === "block") ? "none" : "block";
      element.querySelector(".arrow").style.transform =
        (content.style.display === "block") ? "rotate(90deg)" : "rotate(0deg)";
    } catch (err) {
      console.error("[toggleCollapse] Exception:", err);
    }
  };

  window.copyPlayerInfo = function(event, container) {
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
        navigator.clipboard.writeText(textToCopy)
          .then(() => showCopyAlert(container, "Copied!"))
          .catch(err => console.error("[copyPlayerInfo] Clipboard write failed:", err));
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
      setTimeout(() => alertEl.remove(), 1500);
    } catch (err) {
      console.error("[showCopyAlert] Exception:", err);
    }
  }

  // Wait for DOM ready then delay UI initialization by 6 seconds.
  function delayedUIInit() {
    console.log("[UI] DOM ready; delaying UI init by 6 seconds.");
    setTimeout(mainUI, 6000);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", delayedUIInit);
  } else {
    delayedUIInit();
  }

  // Append custom styles.
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
    .player-tag {
        background: #888;
        padding: 0.2em 0.5em;
        border-radius: 4px;
        font-size: 0.85vw;
        color: #fff;
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
