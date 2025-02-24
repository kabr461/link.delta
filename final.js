(function () {
  "use strict";

  /* =====================================================
     PART 1: GAME STATE HOOK
     This section runs immediately and sets up a global
     window.gameState and intercepts WebSocket messages.
  ===================================================== */
  (function installGameStateHook() {
    console.log("[Hook] Starting game state hook installation...");

    // Create a global game state object that both parts share.
    window.gameState = {
      players: {},    // e.g. {1234: {playerID: 1234, tag:"Player1234", clanTag:"XYZ", ...}, ...}
      spectators: {}  // e.g. {5678: [5678, ...], ...}
    };

    // --- Dummy BinaryReader (replace with your own implementation) ---
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
        if (this.offset + 1 > this.view.byteLength) throw new RangeError("Offset out of bounds");
        return this.view.getUint8(this.offset++);
      }
      // Add other methods as needed…
    }

    // --- Dummy delta packet parsers (replace with real logic) ---
    const deltaPacketParsers = {
      auth(reader) {
        // For demonstration, just read one byte as playerID
        try {
          return { playerID: reader.readUInt8() };
        } catch (err) {
          throw err;
        }
      },
      clientRegisterTab(reader) {
        try {
          const id = reader.readUInt8();
          return { playerID: id, tag: "Player" + id };
        } catch (err) {
          throw err;
        }
      },
      clientRemoveTab(reader) {
        try {
          const id = reader.readUInt8();
          return { playerID: id };
        } catch (err) {
          throw err;
        }
      },
      clientTokenTag(reader) {
        try {
          const id = reader.readUInt8();
          return { playerID: id, clanTag: "Clan" + id };
        } catch (err) {
          throw err;
        }
      },
      commander(reader) {
        try {
          const id = reader.readUInt8();
          return [id, "spectator", "extra info"];
        } catch (err) {
          throw err;
        }
      }
    };

    // Helper functions to update the game state.
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

    // --- Override WebSocket to intercept messages ---
    const OriginalWebSocket = window.WebSocket;
    const originalAddEventListener = OriginalWebSocket.prototype.addEventListener;
    OriginalWebSocket.prototype.addEventListener = function (type, listener, options) {
      if (type === "message") {
        const wrappedListener = function (event) {
          if (event.data instanceof ArrayBuffer) {
            try {
              const rawData = new Uint8Array(event.data);
              console.log("[Hook] Raw binary data received:", rawData);

              // Process auth data.
              try {
                const authReader = new BinaryReader(event.data);
                const authData = deltaPacketParsers.auth(authReader);
                console.log("[Hook] Auth data:", authData);
                if (authData && authData.playerID) {
                  window.gameState.players[authData.playerID] =
                    window.gameState.players[authData.playerID] || {};
                  window.gameState.players[authData.playerID].auth = authData;
                }
              } catch (err) { }

              // Process client registration.
              try {
                const regReader = new BinaryReader(event.data);
                const regData = deltaPacketParsers.clientRegisterTab(regReader);
                console.log("[Hook] Client register data:", regData);
                updatePlayer(regData);
              } catch (err) { }

              // Process client removal.
              try {
                const remReader = new BinaryReader(event.data);
                const remData = deltaPacketParsers.clientRemoveTab(remReader);
                console.log("[Hook] Client remove data:", remData);
                if (remData && remData.playerID) {
                  removePlayer(remData.playerID);
                }
              } catch (err) { }

              // Process token/tag info.
              try {
                const tokenReader = new BinaryReader(event.data);
                const tokenData = deltaPacketParsers.clientTokenTag(tokenReader);
                console.log("[Hook] Token tag data:", tokenData);
                updatePlayer(tokenData);
              } catch (err) { }

              // Process spectator info (using commander parser).
              try {
                const commReader = new BinaryReader(event.data);
                const commData = deltaPacketParsers.commander(commReader);
                console.log("[Hook] Commander (spectator) data:", commData);
                updateSpectator(commData);
              } catch (err) { }

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

    // Override the onmessage property as well.
    Object.defineProperty(OriginalWebSocket.prototype, "onmessage", {
      set: function (fn) {
        this.addEventListener("message", fn);
      },
      get: function () {
        return null;
      }
    });

    console.log("[Hook] Game state hook installed. Current game state:", window.gameState);
  })(); // end Part 1

  /* =====================================================
     PART 2: UI CODE
     This section waits for the DOM to be ready (plus an
     extra 6‑second delay) and then builds a UI panel using
     the dynamic data from window.gameState.
  ===================================================== */
(function() {
  function main() {
    // Global Error Handling & Logging
    window.onerror = function(message, source, lineno, colno, error) {
      console.error("Global error caught:", message, "at", source, "line:", lineno, "col:", colno, "error:", error);
    };
    window.addEventListener('error', function(e) {
      console.error("Error event caught:", e);
    });
    window.addEventListener('unhandledrejection', function(e) {
      console.error("Unhandled rejection:", e.reason);
    });

    // ----------------------------
    // Spectate Panel UI (Dynamic)
    // ----------------------------
    function initSpectate() {
      try {
        // Find the Spectate button (by text). Adjust the selector if needed.
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
        // If already open, simply show it.
        if (document.getElementById('spectateTab')) {
          document.getElementById('spectateTab').style.right = '0';
          return;
        }

        // Get dynamic data from the game state.
        // (Make sure your hook code populates window.gameState before this UI code runs.)
        const players = (window.gameState && window.gameState.players) || {};
        const spectators = (window.gameState && window.gameState.spectators) || {};

        // Combine players and spectators (or you can separate them if you wish).
        // For example, here we create one "Users" list that includes both.
        const allUsers = Object.values(players).concat(Object.values(spectators));

        // Build the Users list dynamically.
        let usersHTML = '';
        if (allUsers.length === 0) {
          usersHTML = `<div class="player">No users found</div>`;
        } else {
          allUsers.forEach(user => {
            // Replace fixed names with dynamic ones.
            const imageUrl = user.image || 'https://via.placeholder.com/40';
            usersHTML += `
              <div class="player">
                <div class="player-info" onclick="copyPlayerInfo(event, this)">
                  <img src="${imageUrl}" alt="User">
                  <span>${user.name || 'Unknown'}</span>
                </div>
                <span class="player-tag">${user.tag || ''}</span>
              </div>
            `;
          });
        }

        // If you want to build teams separately (assuming each player may have a "team" property)
        let teamsHTML = '';
        const teams = {};
        Object.values(players).forEach(user => {
          if (user.team) {
            teams[user.team] = teams[user.team] || [];
            teams[user.team].push(user);
          }
        });
        if (Object.keys(teams).length > 0) {
          for (let team in teams) {
            teamsHTML += `
              <div class="collapsible" onclick="toggleCollapse(this)">
                Team: ${team} (${teams[team].length}) <span class="arrow">▶</span>
              </div>
              <div class="content team">
            `;
            teams[team].forEach(user => {
              const imageUrl = user.image || 'https://via.placeholder.com/40';
              teamsHTML += `
                <div class="player">
                  <div class="tick-button" onclick="toggleTick(event, this)">☐</div>
                  <div class="player-info" onclick="copyPlayerInfo(event, this)">
                    <img src="${imageUrl}" alt="User">
                    <span>${user.name || 'Unknown'}</span>
                  </div>
                  <span class="score">${user.score || 0}</span>
                </div>
              `;
            });
            teamsHTML += `</div>`;
          }
        }

        // Create the spectate tab container with dynamic content.
        const spectateTab = document.createElement('div');
        spectateTab.id = 'spectateTab';
        spectateTab.className = 'spectate-tab';
        spectateTab.innerHTML = `
          <div class="collapsible" onclick="toggleCollapse(this)">
            Users (${allUsers.length}) <span class="arrow">▶</span>
          </div>
          <div class="content player-list">
            ${usersHTML}
          </div>
          ${teamsHTML}
        `;
        document.body.appendChild(spectateTab);
        // Animate it into view.
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

    // ----------------------------
    // UI Helper Functions
    // ----------------------------
    window.toggleCollapse = function(element) {
      try {
        element.classList.toggle('active');
        const content = element.nextElementSibling;
        content.style.display = (content.style.display === "block") ? "none" : "block";
        element.querySelector(".arrow").style.transform =
          (content.style.display === "block") ? "rotate(90deg)" : "rotate(0deg)";
      } catch (err) {
        console.error("[toggleCollapse] Exception:", err);
      }
    };

    window.toggleTick = function(event, element) {
      try {
        element.textContent = (element.textContent.trim() === '✓') ? '☐' : '✓';
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

    // Close the spectate panel on Escape key press.
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

    // ----------------------------
    // Add CSS styles for the spectate panel.
    // ----------------------------
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

    // Initialize the Spectate button logic.
    initSpectate();
  }
  
  // Delay UI initialization only (not the hook code) by 6000 ms.
  setTimeout(main, 6000);
})();
