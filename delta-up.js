(function() {
  function main() {
    // --- Global Error Handling ---
    window.onerror = function(message, source, lineno, colno, error) {
      console.error("Global error caught:", message, "at", source, "line:", lineno, "col:", colno, "error:", error);
    };
    window.addEventListener('error', e => console.error("Error event caught:", e));
    window.addEventListener('unhandledrejection', e => console.error("Unhandled rejection:", e.reason));

    // --- Chat Observer (Cmd Chat) ---
   

    (function () {
      let liveInputText = '';
      let inputListener = null;
      let currentInputElement = null;
      let isRunning = false;
      let pendingUpdate = false;
      let latestMessage = '';
    
      function smartRun(inputText) {
        latestMessage = inputText;
    
        if (isRunning) {
          pendingUpdate = true;
          return;
        }
    
        isRunning = true;
        run([latestMessage || "🔥 Feed me!"], () => {
          isRunning = false;
          if (pendingUpdate) {
            pendingUpdate = false;
            smartRun(latestMessage);
          }
        });
      }
    
      function handleInputBox(inputBox) {
        const input = inputBox.querySelector('input#message');
        if (!input) return;
        currentInputElement = input;
    
        inputListener = (event) => {
          if (event.key === 'Enter') {
            liveInputText = input.value;
            smartRun(liveInputText);
    
            if (input.value.trim().length > 0) {
              event.stopImmediatePropagation();
              event.preventDefault();
              input.value = '';
              input.dispatchEvent(new Event('input', { bubbles: true }));
              input.blur();
    
              const canvas = document.querySelector('canvas.canvas');
              if (!canvas) return;
              let i = 0;
              const maxClicks = 3;
              const clickInterval = setInterval(() => {
                const clickEvent = new MouseEvent('mousedown', {
                  bubbles: true,
                  cancelable: true,
                  view: window,
                  clientX: 100,
                  clientY: 100
                });
                canvas.dispatchEvent(clickEvent);
                i++;
                if (i >= maxClicks) clearInterval(clickInterval);
              }, 100);
            }
          }
        };
    
        input.addEventListener('keydown', inputListener);
      }
    
      function observeAndTrackTyping() {
        const existing = document.querySelector('.message-input-cell.input-box.mr0');
        if (existing) {
          handleInputBox(existing);
          return;
        }
    
        const observer = new MutationObserver(() => {
          const inputBox = document.querySelector('.message-input-cell.input-box.mr0');
          if (inputBox) {
            handleInputBox(inputBox);
            observer.disconnect();
          }
        });
    
        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });
      }
    
      function clickTab(label) {
        const tab = [...document.querySelectorAll('.tab-button')].find(el =>
          el.querySelector('span')?.textContent.trim() === label
        );
        if (tab) tab.click();
        return tab;
      }
    
      function waitForInputs(callback) {
        const check = () => {
          const inputs = document.querySelectorAll('input[name="command"]');
          if (inputs.length > 0) callback(inputs);
          else setTimeout(check, 50);
        };
        check();
      }
    
      function cloneAndPreserveCommandSection(messages, onDone) {
        waitForInputs((inputs) => {
          messages?.forEach((msg, i) => {
            if (inputs[i]) {
              inputs[i].value = msg;
              inputs[i].dispatchEvent(new Event('input', { bubbles: true }));
            }
          });
    
          const commandSection = document.querySelector('.flex-col.flex-nowrap.self-start');
          if (!commandSection) {
            onDone?.();
            return;
          }
    
          const clone = commandSection.cloneNode(true);
          Object.assign(clone.style, {
            position: 'absolute',
            opacity: '0',
            pointerEvents: 'none',
            zIndex: '-999',
            height: '0',
            overflow: 'hidden'
          });
    
          document.body.appendChild(clone);
    
          setTimeout(() => {
            clickTab("Start");
            onDone?.();
          }, 100);
        });
      }
    
      function run(messages, onDone) {
        clickTab("Hotkeys");
        setTimeout(() => {
          clickTab("Commands");
          setTimeout(() => {
            cloneAndPreserveCommandSection(messages, onDone);
          }, 200);
        }, 200);
      }
    
      // EXPOSE TO CMD TOGGLE:
      window.activateLiveModeSystem = function () {
        observeAndTrackTyping();
      };
    
      window.deactivateLiveModeSystem = function () {
        if (inputListener && currentInputElement) {
          currentInputElement.removeEventListener('keydown', inputListener);
        }
      };
    })();
    


    window.startCmdObserver = function () {
      if (window.activateLiveModeSystem) window.activateLiveModeSystem();
    };
    
    window.stopCmdObserver = function () {
      if (window.deactivateLiveModeSystem) window.deactivateLiveModeSystem();
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
              Team <span class="arrow">▶</span>
            </div>
            <div class="content team-list">
              ${buildTeamsHTML()}
            </div>
          </div>
          <div class="button-container">
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
        } else {
          // If direct lookup fails, iterate over the keys to find one that includes the player's nick
          for (const [mapKey, url] of window.parent.Texture.customSkinMap.entries()) {
            if (nick && mapKey.includes(nick)) {
              skinURL = url;
              found = true;
              break;
            }
          }
        }
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
                <span>${displayName}</span>
                <div class="player-tag"></div>
              </div>
            </div>
          `;
          
        });
      }
      return usersHTML;
    }

    // --- Build Teams HTML ---
   // Inside main()
function buildTeamsHTML() {
  let teamsHTML = "";
  const newArray = [];

  if (parent && parent.Texture && parent.Texture.customSkinMap) {
    const skinMap = parent.Texture.customSkinMap;
    if (typeof skinMap.forEach === "function") {
      skinMap.forEach((value, key) => {
        let nick = key;
        const skinURL = value;
        if (!nick || nick.trim() === "") return;
        nick = nick.replace(/[0-9]+$/, '');
        nick = nick.replace(/[\s\u200B-\u200D\uFEFF]/g, '');
        newArray.push({ _nick: nick, _skinURL: skinURL });
      });
    } else {
      Object.keys(skinMap).forEach(key => {
        let nick = key;
        const skinURL = skinMap[key];
        if (!nick || nick.trim() === "") return;
        nick = nick.replace(/[0-9]+$/, '');
        nick = nick.replace(/[\s\u200B-\u200D\uFEFF]/g, '');
        newArray.push({ _nick: nick, _skinURL: skinURL });
      });
    }
  } else {
    teamsHTML = `<div class="player">No spectator data available</div>`;
    return teamsHTML;
  }

  if (newArray.length === 0) {
    teamsHTML = `<div class="player">No players found</div>`;
  } else {
    newArray.forEach(item => {
      teamsHTML += `
        <div class="player">
          <div class="player-info" onclick="copyPlayerInfo(event, this)">
            <img src="${item._skinURL}" alt="User">
            <span>${item._nick}</span>
            <div class="player-tag"></div>
          </div>
        </div>
      `;
    });
  }

  return teamsHTML;
}

function updateSpec() {
  const panel = document.getElementById('spectateTab');
  if (!panel) return;

  const userListElem = panel.querySelector('.content.player-list');
  if (userListElem) {
    userListElem.innerHTML = buildUsersHTML();
  }

  const teamListElem = panel.querySelector('.content.team-list');
  if (teamListElem) {
    teamListElem.innerHTML = buildTeamsHTML();
  }

  updatePlayerCount();
}

// At the bottom of main()
setInterval(updateSpec, 3000);

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
      
          // Check if both sections are open and adjust heights
          const panel = document.getElementById('spectateTab');
          const bothOpen = panel.querySelectorAll('.collapsible.active').length === 2;
          const playerList = panel.querySelector('.content.player-list');
          const teamList = panel.querySelector('.content.team-list');
      
          if (bothOpen) {
            playerList.style.maxHeight = '110px'; // Shrink when both open
            teamList.style.maxHeight = '110px';
          } else {
            playerList.style.maxHeight = '180px'; // Default when one or none open
            teamList.style.maxHeight = '180px';
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
  overflow-y: auto; /* Fixed here to ensure scrolling */
  max-height: 150px;
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


    // Function to update your spectator board using parent.Texture.customSkinMap
function updateSpectatorBoard() {
  // Get your spectator tab's container element (update the ID if necessary)
  const container = document.getElementById("spectator-container");
  if (!container) {
    console.error("Spectator container element with id 'spectator-container' not found.");
    return;
  }

  // Build a new array using the same logic as the original script
  const newArray = [];
  if (parent && parent.Texture && parent.Texture.customSkinMap) {
    const skinMap = parent.Texture.customSkinMap;
    if (typeof skinMap.forEach === "function") {
      skinMap.forEach((value, key) => {
        let nick = key;
        const skinURL = value;
        if (!nick || nick.trim() === "") return;
        // Clean up the nickname (remove trailing numbers and extra whitespace)
        nick = nick.replace(/[0-9]+$/, '');
        nick = nick.replace(/[\s\u200B-\u200D\uFEFF]/g, '');
        newArray.push({ _nick: nick, _skinURL: skinURL });
      });
    } else {
      // Fallback: iterate over object keys if forEach isn't available
      Object.keys(skinMap).forEach(key => {
        let nick = key;
        const skinURL = skinMap[key];
        if (!nick || nick.trim() === "") return;
        nick = nick.replace(/[0-9]+$/, '');
        nick = nick.replace(/[\s\u200B-\u200D\uFEFF]/g, '');
        newArray.push({ _nick: nick, _skinURL: skinURL });
      });
    }
  } else {
    console.error("parent.Texture.customSkinMap is undefined.");
    return;
  }

  // Clear previous content from the container
  container.innerHTML = "";

  // Create a container div for the spectator board
  const boardDiv = document.createElement("div");
  boardDiv.id = "spectator-board";
  boardDiv.style.display = "flex";
  boardDiv.style.flexWrap = "wrap";
  boardDiv.style.justifyContent = "space-around";

  // For each spectator, create a UI block that includes their skin image and cleaned nickname
  newArray.forEach(function(item) {
    const playerContainer = document.createElement("div");
    playerContainer.style.width = "150px";
    playerContainer.style.margin = "10px";
    playerContainer.style.textAlign = "center";

    const img = document.createElement("img");
    img.src = item._skinURL || '';
    img.style.width = "100px";
    img.style.height = "100px";
    img.style.display = "block";
    img.style.margin = "0 auto";
    img.style.borderRadius = "10px";
    img.style.cursor = "pointer";
    // On click, display a larger popup of the skin image
    img.onclick = function() {
      const popup = document.createElement("div");
      popup.style.position = "fixed";
      popup.style.top = "50%";
      popup.style.left = "50%";
      popup.style.transform = "translate(-50%, -50%)";
      popup.style.zIndex = "9999";
      popup.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
      popup.style.padding = "20px";
      popup.style.borderRadius = "10px";

      const popupImg = document.createElement("img");
      popupImg.src = item._skinURL;
      popupImg.style.width = "512px";
      popupImg.style.height = "512px";

      popup.appendChild(popupImg);
      document.body.appendChild(popup);

      popup.onclick = function() {
        document.body.removeChild(popup);
      };
    };

    const nickDiv = document.createElement("div");
    nickDiv.textContent = item._nick;
    nickDiv.style.marginTop = "10px";
    nickDiv.style.fontSize = "14px";
    nickDiv.style.color = "#fff";

    playerContainer.appendChild(img);
    playerContainer.appendChild(nickDiv);
    boardDiv.appendChild(playerContainer);
  });

  // Append the newly built spectator board to your container
  container.appendChild(boardDiv);
}

// Call this function whenever you need to update the spectator board.
// For example, to refresh every 3 seconds, you could use:
// setInterval(updateSpectatorBoard, 3000);
updateSpectatorBoard();

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
     
        players.forEach((player, index) => {
          let tagMatch = player.nick.match(/\[([^\]]+)\]/);
          if (!tagMatch) {
            tagMatch = player.nick.match(/#(\S+)/);
          }
          if (tagMatch && tagMatch[1]) {
         
          } else {
            
          }
        });
      }
    })();
  }

  setTimeout(main, 5000); // Delay initialization
})();
