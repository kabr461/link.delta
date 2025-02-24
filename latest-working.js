(function() {
  function main() {
    // --- Global Error Handling ---
    window.onerror = function(message, source, lineno, colno, error) {
      console.error("Global error caught:", message, "at", source, "line:", lineno, "col:", colno, "error:", error);
    };
    window.addEventListener('error', e => console.error("Error event caught:", e));
    window.addEventListener('unhandledrejection', e => console.error("Unhandled rejection:", e.reason));

    // --- Chat Observer (Cmd Chat) ---
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
                  if (textDiv) textDiv.style.fontWeight = "bold";
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
      if (!cmdObserver) initChatObserver();
    };
    window.stopCmdObserver = function() {
      if (cmdObserver) {
        cmdObserver.disconnect();
        cmdObserver = null;
      }
    };

    // --- Spectate Panel Logic ---
    function initSpectate() {
      try {
        const spectateBtn = Array.from(document.querySelectorAll('div.btn-layer'))
          .find(el => el.textContent.trim() === 'Spectate');
        if (!spectateBtn) return setTimeout(initSpectate, 500);
        spectateBtn.addEventListener('click', () => {
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
        let panel = document.getElementById('spectateTab');
        if (panel) {
          panel.style.right = '0';
          return;
        }
        // Get the playing players from window.gameState.players.
        const players = (window.gameState && window.gameState.players) || {};
        // Filter out spectators.
        const playingPlayers = Object.values(players).filter(p => !p.isSpectator);
        
      // Build the Users section.
let usersHTML = "";
if (playingPlayers.length === 0) {
  usersHTML = `<div class="player">No players found</div>`;
} else {
  playingPlayers.forEach(player => {
    **const imageUrl = player.skinUrl || 'https://via.placeholder.com/40'; // CHANGED**
    **const name = player.username || 'Unknown'; // CHANGED**
    **const tag = player.clanTag || ''; // Optional, if you want clan tags**
    usersHTML += `
      <div class="player">
        <div class="player-info" onclick="copyPlayerInfo(event, this)">
          <img src="${imageUrl}" alt="User">
          <span>${name}</span>
        </div>
        <span class="player-tag">${tag}</span>
      </div>
    `;
  });
}

        // Build the Teams section.
       teams[team].forEach(player => {
  **const imageUrl = player.skinUrl || 'https://via.placeholder.com/40'; // CHANGED**
  **const name = player.username || 'Unknown'; // CHANGED**
  const score = player.score || 0;
  teamPlayersHTML += `
    <div class="player">
      <div class="tick-button" onclick="toggleTick(event, this)">☐</div>
      <div class="player-info" onclick="copyPlayerInfo(event, this)">
        <img src="${imageUrl}" alt="User">
        <span>${name}</span>
      </div>
      <span class="score">${score}</span>
    </div>
  `;
});

            });
            if (!teamPlayersHTML.trim()) {
              teamPlayersHTML = `<div class="player">No players found</div>`;
            }
            teamsHTML += `
              <div class="collapsible" onclick="toggleCollapse(this)">
                Team: ${team} (${teams[team].length}) <span class="arrow">▶</span>
              </div>
              <div class="content team">
                ${teamPlayersHTML}
              </div>
            `;
          }
        } else {
          teamsHTML = `
            <div class="collapsible" onclick="toggleCollapse(this)">
              Teams (0) <span class="arrow">▶</span>
            </div>
            <div class="content team">
              <div class="player">No teams found</div>
            </div>
          `;
        }

        // Create the spectate panel container with two sections.
        panel = document.createElement('div');
        panel.id = 'spectateTab';
        panel.className = 'spectate-tab';
        panel.innerHTML = `
          <div class="player-team-section">
            <div class="collapsible" onclick="toggleCollapse(this)">
              Users (${playingPlayers.length}) <span class="arrow">▶</span>
            </div>
            <div class="content player-list">
              ${usersHTML}
            </div>
            ${teamsHTML}
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
        document.body.appendChild(panel);
        requestAnimationFrame(() => panel.style.right = '0');
      } catch (err) {
        console.error("[openSpectateTab] Exception:", err);
      }
    }

    // --- UI Helper Functions ---
    window.toggleCollapse = function(element) {
      try {
        element.classList.toggle('active');
        const content = element.nextElementSibling;
        content.style.display = (content.style.display === "block") ? "none" : "block";
        const arrow = element.querySelector(".arrow");
        if (arrow) {
          arrow.style.transform = (content.style.display === "block") ? "rotate(90deg)" : "rotate(0deg)";
        }
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
          if (span) textToCopy = span.textContent.trim();
        }
        if (!textToCopy) return;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(textToCopy)
            .then(() => showCopyAlert(container, "Copied!"))
            .catch(err => console.error("[copyPlayerInfo] Clipboard write failed:", err));
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

    // --- Close Spectate Panel on Escape ---
    document.addEventListener('keydown', function(e) {
      try {
        if (e.key === 'Escape') {
          const panel = document.getElementById('spectateTab');
          if (panel) {
            panel.style.right = '-15vw';
            setTimeout(() => {
              try {
                panel.remove();
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

    // --- CSS Styles for the Spectate Panel ---
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

    initSpectate();
  }
  // Delay UI initialization by 6000ms.
  setTimeout(main, 6000);
})();
