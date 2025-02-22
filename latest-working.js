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
        console.log("[initChatObserver] Looking for chat container (.chatmessages)...");
        const chatContainer = document.querySelector('.chatmessages');
        if (!chatContainer) {
          console.log("[initChatObserver] Chat container not found. Retrying...");
          return setTimeout(initChatObserver, 500);
        }
        console.log("[initChatObserver] Chat container found:", chatContainer);

        cmdObserver = new MutationObserver(mutations => {
          mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
              try {
                if (node.nodeType === Node.ELEMENT_NODE && node.matches("li.message")) {
                  console.log("[MutationObserver] New message node found:", node);
                  node.classList.add("command");
                  const textDiv = node.querySelector("div.text");
                  if (textDiv) {
                    textDiv.style.fontWeight = "bold";
                    console.log("[MutationObserver] Bold style applied to:", textDiv);
                  }
                }
              } catch (err) {
                console.error("[MutationObserver] Error processing added node:", err);
              }
            });
          });
        });

        cmdObserver.observe(chatContainer, { childList: true, subtree: true });
        console.log("[initChatObserver] Command style observer started.");
      } catch (err) {
        console.error("[initChatObserver] Exception:", err);
      }
    }

    window.startCmdObserver = function() {
      console.log("[startCmdObserver] Called.");
      if (cmdObserver) {
        console.log("[startCmdObserver] Cmd Chat observer is already running.");
        return;
      }
      initChatObserver();
    };

    window.stopCmdObserver = function() {
      console.log("[stopCmdObserver] Called.");
      if (cmdObserver) {
        cmdObserver.disconnect();
        cmdObserver = null;
        console.log("[stopCmdObserver] Command style observer stopped.");
      } else {
        console.log("[stopCmdObserver] No observer to stop.");
      }
    };

    // ========================
    // Spectate Panel Code
    // ========================
    function initSpectate() {
      try {
        console.log("[initSpectate] Looking for Spectate button (div.btn-layer with text 'Spectate')...");
        const spectateBtn = Array.from(document.querySelectorAll('div.btn-layer'))
          .find(el => el.textContent.trim() === 'Spectate');
        if (!spectateBtn) {
          console.log("[initSpectate] Spectate button not found. Retrying...");
          return setTimeout(initSpectate, 500);
        }
        console.log("[initSpectate] Spectate button found:", spectateBtn);
        spectateBtn.addEventListener('click', function() {
          try {
            console.log("[SpectateButton] Click event triggered.");
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
        console.log("[openSpectateTab] Called.");
        if (document.getElementById('spectateTab')) {
          console.log("[openSpectateTab] Spectate tab already exists. Showing it.");
          document.getElementById('spectateTab').style.right = '0';
          return;
        }

        const spectateTab = document.createElement('div');
        spectateTab.id = 'spectateTab';
        spectateTab.className = 'spectate-tab';
        spectateTab.innerHTML = `
          <div class="collapsible" onclick="toggleCollapse(this)">
              Users (2) <span class="arrow">▶</span>
          </div>
          <div class="content player-list">
              <div class="player">
                  <div class="player-info" onclick="copyPlayerInfo(event, this)">
                      <img src="https://via.placeholder.com/40" alt="User">
                      <span>naze</span>
                  </div>
                  <span class="player-tag">naze</span>
              </div>
              <div class="player">
                  <div class="player-info" onclick="copyPlayerInfo(event, this)">
                      <img src="https://via.placeholder.com/40" alt="User">
                      <span>Hook</span>
                  </div>
                  <span class="player-tag">Hook</span>
              </div>
          </div>
          <div class="collapsible" onclick="toggleCollapse(this)">
              Teams (1) <span class="arrow">▶</span>
          </div>
          <div class="content team">
              <div class="player">
                  <div class="tick-button" onclick="toggleTick(event, this)">☐</div>
                  <div class="player-info" onclick="copyPlayerInfo(event, this)">
                      <img src="https://via.placeholder.com/40" alt="User">
                      <span>naze</span>
                  </div>
                  <span class="score">1</span>
              </div>
              <div class="player">
                  <div class="tick-button" onclick="toggleTick(event, this)">☐</div>
                  <div class="player-info" onclick="copyPlayerInfo(event, this)">
                      <img src="https://via.placeholder.com/40" alt="User">
                      <span>Hook</span>
                  </div>
                  <span class="score">0</span>
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
        document.body.appendChild(spectateTab);
        console.log("[openSpectateTab] Spectate tab created.");
        requestAnimationFrame(() => {
          try {
            spectateTab.style.right = '0';
            console.log("[openSpectateTab] Spectate tab animation triggered.");
          } catch (err) {
            console.error("[openSpectateTab] Error during animation:", err);
          }
        });
      } catch (err) {
        console.error("[openSpectateTab] Exception:", err);
      }
    }

    window.toggleCollapse = function(element) {
      try {
        console.log("[toggleCollapse] Toggling collapse for element:", element);
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
        console.log("[toggleSwitch] Toggling switch for element:", element);
        element.classList.toggle('active');
        element.textContent = element.classList.contains('active') ? 'ON' : 'OFF';

        if (element.id === 'cmdChatToggle') {
          console.log("[toggleSwitch] Cmd Chat toggle detected. Current state:", element.textContent);
          if (element.classList.contains('active')) {
            startCmdObserver();
          } else {
            stopCmdObserver();
          }
        }
      } catch (err) {
        console.error("[toggleSwitch] Exception:", err);
      }
    };

    window.toggleTick = function(event, element) {
      try {
        console.log("[toggleTick] Toggling tick for element:", element);
        element.textContent = element.textContent.trim() === '✓' ? '☐' : '✓';
        event.stopPropagation();
      } catch (err) {
        console.error("[toggleTick] Exception:", err);
      }
    };

    window.copyPlayerInfo = function(event, container) {
      try {
        console.log("[copyPlayerInfo] Called for container:", container);
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
        if (!textToCopy) {
          console.log("[copyPlayerInfo] Nothing to copy.");
          return;
        }
        console.log("[copyPlayerInfo] Text to copy:", textToCopy);

        if (navigator.clipboard) {
          navigator.clipboard.writeText(textToCopy).then(() => {
            showCopyAlert(container, "Copied!");
            console.log("[copyPlayerInfo] Clipboard write successful.");
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
            console.log("[copyPlayerInfo] Fallback copy successful.");
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
        console.log("[showCopyAlert] Showing alert with message:", message);
        const alertEl = document.createElement('div');
        alertEl.textContent = message;
        alertEl.className = 'copy-alert';
        parent.appendChild(alertEl);
        setTimeout(() => {
          try {
            alertEl.remove();
            console.log("[showCopyAlert] Alert removed.");
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
          console.log("[keydown] Escape pressed.");
          const spectateTab = document.getElementById('spectateTab');
          if (spectateTab) {
            spectateTab.style.right = '-15vw';
            setTimeout(() => {
              try {
                spectateTab.remove();
                console.log("[keydown] Spectate panel hidden.");
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

    // Start the search for the Spectate button
    initSpectate();
  }

  // Wait 15 seconds before running the main code
  setTimeout(main, 15000);
})();
