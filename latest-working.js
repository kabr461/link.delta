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
          panel.style.left = '0';
          return;
        }
        panel = document.createElement('div');
        panel.id = 'spectateTab';
        panel.className = 'spectate-tab';
        panel.innerHTML = `
          <div class="player-team-section">
            <div class="collapsible" onclick="toggleCollapse(this)" id="usersHeader">
              Users (<span id="playerCount">${(function(){
                // Count unique (non‑bot) players from leaderboard
                const unique = new Set();
                if (leaderboard && leaderboard.leaderboard) {
                  leaderboard.leaderboard.forEach(p => {
                    const nick = (p.nick || "").trim();
                    if (nick) unique.add(nick);
                  });
                }
                return unique.size;
              })()}</span>) <span class="arrow">▶</span>
            </div>
            <div class="content player-list">
              ${buildUsersHTML()}
            </div>
            <div class="collapsible" onclick="toggleCollapse(this)">
              Teams <span class="arrow">▶</span>
            </div>
            <div class="content team-list">
              ${buildTeamsHTML()}
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
        document.body.appendChild(panel);
        requestAnimationFrame(() => panel.style.left = '0');
      } catch (err) {
        console.error("[openSpectateTab] Exception:", err);
      }
    }

    // --- Helper function for image extraction (exactly as in message.txt) with debugging ---
    function getSkinURLForNick(nick) {
      let skinURL = 'https://via.placeholder.com/40';
      let found = false;
      if (window.parent && window.parent.Texture && window.parent.Texture.customSkinMap) {
        // First, try a direct lookup using the raw key
        if (window.parent.Texture.customSkinMap.get(nick)) {
          skinURL = window.parent.Texture.customSkinMap.get(nick);
          found = true;
          console.log("[DEBUG] Direct custom skin detected for nick:", nick, "=>", skinURL);
        } else {
          // If direct lookup fails, iterate over the keys to find one that includes the player's nick
          for (const [mapKey, url] of window.parent.Texture.customSkinMap.entries()) {
            if (nick && mapKey.includes(nick)) {
              skinURL = url;
              found = true;
              console.log("[DEBUG] Fallback custom skin detected for nick:", nick, "with key:", mapKey, "=>", skinURL);
              break;
            }
          }
        }
      }
      if (!found) {
        console.log("[DEBUG] No custom skin detected for nick:", nick, "using placeholder", skinURL);
      }
      return skinURL;
    }

    // --- Build Users HTML with Leaderboard Data (Non Bot Players Only) ---
    function buildUsersHTML() {
      const leaderboardPlayers = leaderboard.leaderboard || [];
      let usersHTML = "";
      // Filter out duplicate (bot) players by nick
      const uniquePlayers = [];
      const seen = new Set();
      leaderboardPlayers.forEach(player => {
        const nick = (player.nick || "").trim();
        if (nick && !seen.has(nick)) {
          seen.add(nick);
          uniquePlayers.push(player);
        }
      });
      if (uniquePlayers.length === 0) {
        usersHTML = `<div class="player">No leaderboard players found</div>`;
      } else {
        uniquePlayers.forEach(player => {
          const key = (player.nick || "").trim();
          const displayName = key ? key : 'No name';
          // Use the image extraction logic from message.txt file with debugging
          let skinURL = getSkinURLForNick(key);
          usersHTML += `
            <div class="player">
              <div class="player-info" onclick="copyPlayerInfo(event, this)">
                <img src="${skinURL}" alt="User">
                <span>${displayName}</span>
                <div class="player-tag"></div>
              </div>
            </div>
          `;
          console.log("[DEBUG] Processed user:", displayName, "with skin URL:", skinURL);
        });
      }
      return usersHTML;
    }

    // --- Build Teams HTML ---
    function buildTeamsHTML() {
      const teams = {};
      const players = (window.gameState && window.gameState.players) || {};
      Object.values(players).forEach(player => {
        if (player.team) {
          teams[player.team] = teams[player.team] || [];
          teams[player.team].push(player);
        }
      });
      let teamsHTML = "";
      if (Object.keys(teams).length === 0) {
        teamsHTML = `<div class="player">No teams found</div>`;
      } else {
        for (let team in teams) {
          let teamPlayersHTML = "";
          teams[team].forEach(player => {
            const displayName = (player.username && player.username.trim()) ? player.username : 'No name';
            const imageUrl = player.skinUrl || 'https://via.placeholder.com/40';
            const score = player.score || 0;
            teamPlayersHTML += `
              <div class="player">
                <div class="tick-button" onclick="toggleTick(event, this)">☐</div>
                <div class="player-info" onclick="copyPlayerInfo(event, this)">
                  <img src="${imageUrl}" alt="User">
                  <span>${displayName}</span>
                </div>
                <span class="score">${score}</span>
              </div>
            `;
          });
          teamsHTML += `
            <div class="collapsible" onclick="toggleCollapse(this)">
              Team: ${team} (${teams[team].length}) <span class="arrow">▶</span>
            </div>
            <div class="content team">
              ${teamPlayersHTML}
            </div>
          `;
        }
      }
      return teamsHTML;
    }

    // --- Update Player Count in Header ---
    function updatePlayerCount() {
      const countSpan = document.getElementById('playerCount');
      if (countSpan && leaderboard && leaderboard.leaderboard) {
        const unique = new Set();
        leaderboard.leaderboard.forEach(p => {
          const nick = (p.nick || "").trim();
          if (nick) unique.add(nick);
        });
        countSpan.textContent = unique.size;
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
            panel.style.left = '-15vw';
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
          top: 0;
          left: -15vw;
          width: 12vw;
          max-width: 180px;
          height: 50vh;
          max-height: 420px;
          background: #0d0d0d;
          padding: 0.5vw;
          border-radius: 5px;
          border: 1px solid #444;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
          transition: left 0.5s ease-out;
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
      .content.player-list {
          display: none;
          padding: 5px;
          background: #181818;
          border-top: 1px solid #444;
          overflow-y: auto;
          max-height: 150px;
      }
      .content.team-list {
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

    // --- Refresh Spectate Panel ---
    function refreshSpectatePanel() {
      const panel = document.getElementById('spectateTab');
      if (!panel) return;
      const userListElem = panel.querySelector('.content.player-list');
      if (userListElem) {
        userListElem.innerHTML = buildUsersHTML();
      }
      updatePlayerCount();
    }

    setInterval(refreshSpectatePanel, 4000); // Refresh every 4 seconds

    // --- IIFE to check for embedded tags in player nicknames ---
    (function(){
      'use strict';
      if (typeof leaderboard !== "undefined" && leaderboard.leaderboard) {
        const players = leaderboard.leaderboard;
        console.log("Checking for embedded tags in player nicknames...");
        players.forEach((player, index) => {
          let tagMatch = player.nick.match(/\[([^\]]+)\]/);
          if (!tagMatch) {
            tagMatch = player.nick.match(/#(\S+)/);
          }
          if (tagMatch && tagMatch[1]) {
            console.log(`Player ${index + 1}: Nick: ${player.nick}, Extracted Tag: ${tagMatch[1]}`);
          } else {
            console.log(`Player ${index + 1}: Nick: ${player.nick}, Tag: No tag found`);
          }
        });
      } else {
        console.log("Leaderboard data is not available.");
      }
    })();
  }

  setTimeout(main, 6000); // Delay initialization
})();
