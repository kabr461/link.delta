(function () {
  "use strict";

  // -------------------------------
  // Local Game State & Message Handler
  // -------------------------------
  const gameState = {
    players: {},
    spectators: {}
  };

  // This function processes incoming messages and updates our local state.
  // For demonstration, we assume messages are JSON strings. In your real case,
  // you might need to decode binary data using your parsers.
  function processMessage(data) {
    try {
      let message;
      if (typeof data === "string") {
        message = JSON.parse(data);
      } else if (data instanceof ArrayBuffer) {
        // Assume a JSON-encoded message in an ArrayBuffer for demonstration.
        const decoder = new TextDecoder("utf-8");
        message = JSON.parse(decoder.decode(new Uint8Array(data)));
      }
      // Example handling based on a message type:
      if (message.type === "auth" || message.type === "register") {
        gameState.players[message.playerID] = Object.assign(
          gameState.players[message.playerID] || {},
          message
        );
      } else if (message.type === "spectate") {
        gameState.spectators[message.playerID] = message;
      } else if (message.type === "remove") {
        delete gameState.players[message.playerID];
        delete gameState.spectators[message.playerID];
      }
      // Update the UI after processing the message.
      updateUI();
    } catch (err) {
      console.error("Error processing message:", err);
    }
  }

  // -------------------------------
  // Install a WebSocket Message Hook
  // -------------------------------
  (function installWebSocketHook() {
    const OriginalWebSocket = window.WebSocket;
    const originalAddEventListener = OriginalWebSocket.prototype.addEventListener;

    OriginalWebSocket.prototype.addEventListener = function (type, listener, options) {
      if (type === "message") {
        const wrappedListener = function (event) {
          // Process the message for our UI updates.
          processMessage(event.data);
          // Then call the original listener.
          listener(event);
        };
        originalAddEventListener.call(this, type, wrappedListener, options);
      } else {
        originalAddEventListener.call(this, type, listener, options);
      }
    };

    // Also override the onmessage property so that assignments get wrapped.
    Object.defineProperty(OriginalWebSocket.prototype, "onmessage", {
      set: function (fn) {
        this.addEventListener("message", fn);
      },
      get: function () {
        return null;
      }
    });
  })();

  // -------------------------------
  // UI Code: Create & Update Spectate Panel
  // -------------------------------
  function createSpectatePanel() {
    if (document.getElementById("spectateTab")) return; // Prevent duplicate panels

    const spectateTab = document.createElement("div");
    spectateTab.id = "spectateTab";
    spectateTab.className = "spectate-tab";
    spectateTab.innerHTML = `
      <div class="collapsible" onclick="toggleCollapse(this)">
          Users (<span id="userCount">0</span>) <span class="arrow">▶</span>
      </div>
      <div class="content player-list" id="userList"></div>
      <div class="collapsible" onclick="toggleCollapse(this)">
          Teams (<span id="teamCount">0</span>) <span class="arrow">▶</span>
      </div>
      <div class="content team" id="teamList"></div>
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
    // Animate panel into view
    requestAnimationFrame(() => {
      spectateTab.style.right = "0";
    });
  }

  // Updates the spectate panel using current gameState
  function updateUI() {
    const userList = document.getElementById("userList");
    const teamList = document.getElementById("teamList");
    const userCountEl = document.getElementById("userCount");
    const teamCountEl = document.getElementById("teamCount");
    if (!userList || !teamList) return;

    let userHtml = "";
    let userCount = 0;
    // For demonstration, display all spectators.
    for (const pid in gameState.spectators) {
      userCount++;
      const spec = gameState.spectators[pid];
      userHtml += `<div class="player">
        <div class="player-info" onclick="copyPlayerInfo(event, this)">
          <img src="https://via.placeholder.com/40" alt="User">
          <span>${pid}</span>
        </div>
        <span class="player-tag">${spec.tag || ""}</span>
      </div>`;
    }

    let teamHtml = "";
    let teamCount = 0;
    for (const pid in gameState.players) {
      const player = gameState.players[pid];
      if (player.team) {
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
    userList.innerHTML = userHtml;
    teamList.innerHTML = teamHtml;
    userCountEl.textContent = userCount;
    teamCountEl.textContent = teamCount;
  }

  // -------------------------------
  // UI Helper Functions (exposed globally for inline event handlers)
  // -------------------------------
  window.toggleCollapse = function (element) {
    try {
      element.classList.toggle("active");
      const content = element.nextElementSibling;
      content.style.display = content.style.display === "block" ? "none" : "block";
      const arrow = element.querySelector(".arrow");
      if (arrow) {
        arrow.style.transform = content.style.display === "block" ? "rotate(90deg)" : "rotate(0deg)";
      }
    } catch (err) {
      console.error("Error in toggleCollapse:", err);
    }
  };

  window.toggleSwitch = function (element) {
    try {
      element.classList.toggle("active");
      element.textContent = element.classList.contains("active") ? "ON" : "OFF";
      // Optionally, add behavior for command chat toggling here.
    } catch (err) {
      console.error("Error in toggleSwitch:", err);
    }
  };

  window.toggleTick = function (event, element) {
    try {
      element.textContent = element.textContent.trim() === "✓" ? "☐" : "✓";
      event.stopPropagation();
    } catch (err) {
      console.error("Error in toggleTick:", err);
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
        navigator.clipboard.writeText(textToCopy)
          .then(() => showCopyAlert(container, "Copied!"))
          .catch(err => console.error("Clipboard write failed:", err));
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand("copy");
          showCopyAlert(container, "Copied!");
        } catch (err) {
          console.error("Fallback copy failed:", err);
        }
        document.body.removeChild(textarea);
      }
    } catch (err) {
      console.error("Error in copyPlayerInfo:", err);
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
          console.error("Error removing alert:", err);
        }
      }, 1500);
    } catch (err) {
      console.error("Error in showCopyAlert:", err);
    }
  }

  // Allow closing the spectate panel with Escape.
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      const spectateTab = document.getElementById("spectateTab");
      if (spectateTab) {
        spectateTab.style.right = "-15vw";
        setTimeout(() => spectateTab.remove(), 500);
      }
    }
  });

  // -------------------------------
  // Insert CSS Styles for the UI
  // -------------------------------
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

  // -------------------------------
  // Initialize UI on DOM Ready
  // -------------------------------
  if (document.readyState === "complete" || document.readyState === "interactive") {
    createSpectatePanel();
  } else {
    document.addEventListener("DOMContentLoaded", createSpectatePanel);
  }

  // Now this independent script both creates the UI and connects to WebSocket messages.
})();
