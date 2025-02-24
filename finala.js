(function() {
  function main() {
    // ========================
    // Global Error Handling & Logging
    // ========================
    window.onerror = function(message, source, lineno, colno, error) {
      console.error("Global error caught:", message, "at", source, "line:", lineno, "col:", colno, "error:", error);
    };

    window.addEventListener('error', function(e) {
      console.error("Error event caught:", e);
    });

    window.addEventListener('unhandledrejection', function(e) {
      console.error("Unhandled rejection:", e.reason);
    });

    // ========================
    // Chat Observer Logic
    // ========================
    let cmdObserver = null;
    function initChatObserver() {
      try {
        const chatContainer = document.querySelector('.chatmessages');
        if (!chatContainer) {
          return setTimeout(initChatObserver, 500);
        }
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

    // ========================
    // Message Processing & Game State
    // ========================
    const gameState = {
      players: {},
      spectators: {}
    };

    // Process incoming WebSocket messages.
    // (Replace the JSON parsing below with your BinaryReader/parsers if needed.)
    function processMessage(data) {
      try {
        let msg;
        if (typeof data === "string") {
          msg = JSON.parse(data);
        } else if (data instanceof ArrayBuffer) {
          const decoder = new TextDecoder("utf-8");
          msg = JSON.parse(decoder.decode(new Uint8Array(data)));
        }
        // Example handling:
        if (msg.type === "auth" || msg.type === "register") {
          gameState.players[msg.playerID] = Object.assign({}, msg);
        } else if (msg.type === "spectate") {
          gameState.spectators[msg.playerID] = msg;
        } else if (msg.type === "remove") {
          delete gameState.players[msg.playerID];
          delete gameState.spectators[msg.playerID];
        }
        updateSpectatePanel();
      } catch (err) {
        console.error("Error processing message:", err);
      }
    }

    // ========================
    // Install WebSocket Hook
    // ========================
    (function installWebSocketHook() {
      const OriginalWebSocket = window.WebSocket;
      const originalAddEventListener = OriginalWebSocket.prototype.addEventListener;
      OriginalWebSocket.prototype.addEventListener = function(type, listener, options) {
        if (type === "message") {
          const wrappedListener = function(event) {
            processMessage(event.data);
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
        get: function() { return null; }
      });
    })();

    // ========================
    // Spectate Panel UI (same as your second script)
    // ========================
    function initSpectate() {
      try {
        const spectateBtn = Array.from(document.querySelectorAll('div.btn-layer'))
          .find(el => el.textContent.trim() === 'Spectate');
        if (!spectateBtn) {
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
        // Use the same layout as your working UI
        spectateTab.innerHTML = `
          <div class="collapsible" onclick="toggleCollapse(this)">
              Users (<span id="userCount">0</span>) <span class="arrow">▶</span>
          </div>
          <div class="content player-list" id="userList">
              <!-- Dynamic list will be inserted here -->
          </div>
          <div class="collapsible" onclick="toggleCollapse(this)">
              Teams (<span id="teamCount">0</span>) <span class="arrow">▶</span>
          </div>
          <div class="content team" id="teamList">
              <!-- Dynamic list will be inserted here -->
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
            spectateTab.style.right = '0';
          } catch (err) {
            console.error("[openSpectateTab] Error during animation:", err);
          }
        });
        updateSpectatePanel();
      } catch (err) {
        console.error("[openSpectateTab] Exception:", err);
      }
    }

    // Update UI using gameState (called after each message)
    function updateSpectatePanel() {
      const userList = document.getElementById('userList');
      const teamList = document.getElementById('teamList');
      const userCountEl = document.getElementById('userCount');
      const teamCountEl = document.getElementById('teamCount');
      if (!userList || !teamList) return;

      let userHtml = "";
      let userCount = 0;
      for (const pid in gameState.spectators) {
        userCount++;
        const spec = gameState.spectators[pid];
        userHtml += `<div class="player">
          <div class="player-info" onclick="copyPlayerInfo(event, this)">
              <img src="https://via.placeholder.com/40" alt="User">
              <span>${pid}</span>
          </div>
          <span class="player-tag">${spec.tag || pid}</span>
        </div>`;
      }

      let teamHtml = "";
      let teamCount = 0;
      for (const pid in gameState.players) {
        teamCount++;
        const player = gameState.players[pid];
        teamHtml += `<div class="player">
          <div class="tick-button" onclick="toggleTick(event, this)">☐</div>
          <div class="player-info" onclick="copyPlayerInfo(event, this)">
              <img src="https://via.placeholder.com/40" alt="User">
              <span>${pid}</span>
          </div>
          <span class="score">${player.score || 0}</span>
        </div>`;
      }

      userList.innerHTML = userHtml;
      teamList.innerHTML = teamHtml;
      userCountEl.textContent = userCount;
      teamCountEl.textContent = teamCount;
    }

    // ========================
    // UI Helper Functions (exposed globally)
    // ========================
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

    document.addEventListener('keydown', function(e) {
      try {
        if (e.key === 'Escape') {
          const spectateTab = document.getElementById('spectateTab');
          if (spectateTab) {
            spectateTab.style.right = '-15vw';
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

    // ========================
    // Insert UI CSS Styles
    // ========================
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

    // Initialize the Spectate functionality (attaches to the Spectate button)
    initSpectate();
  }
  setTimeout(main, 8000);
})();
