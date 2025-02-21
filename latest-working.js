(function() {
  'use strict';

  // --------------------------------------------------------
  // 1) Chat Observer Logic (Cmd Chat)
  // --------------------------------------------------------
  (function() {
    function findChatContainer() {
      const chatContainer = document.querySelector('.chatmessages');
      if (!chatContainer) {
        console.log("Chat container not found yet. Retrying...");
        setTimeout(findChatContainer, 500);
        return;
      }
      console.log("Chat container found:", chatContainer);

      let cmdObserver = null;

      window.startCmdObserver = function() {
        if (cmdObserver) {
          console.log("Cmd Chat observer is already running.");
          return;
        }
        cmdObserver = new MutationObserver(mutations => {
          mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === Node.ELEMENT_NODE && node.matches("li.message")) {
                node.classList.add("command");
                const textDiv = node.querySelector("div.text");
                if (textDiv) {
                  textDiv.style.fontWeight = "bold";
                }
              }
            });
          });
        });
        cmdObserver.observe(chatContainer, { childList: true, subtree: true });
        console.log("Command style observer started.");
      };

      window.stopCmdObserver = function() {
        if (cmdObserver) {
          cmdObserver.disconnect();
          cmdObserver = null;
          console.log("Command style observer stopped.");
        }
      };
    }
    findChatContainer();
  })();

  // --------------------------------------------------------
  // 2) Spectate Panel Code (Dynamic Event Attachment)
  // --------------------------------------------------------
  (function() {
    // Wait for the "Spectate" button to appear.
    function initSpectate() {
      const spectateBtn = Array.from(document.querySelectorAll('div.btn-layer'))
        .find(el => el.textContent.trim() === 'Spectate');

      if (!spectateBtn) {
        console.log('Spectate button not found yet. Retrying...');
        setTimeout(initSpectate, 500);
        return;
      }

      console.log('Spectate button found:', spectateBtn);
      spectateBtn.addEventListener('click', function() {
        console.log('Spectate button clicked!');
        openSpectateTab();
      });
    }

    // Create and display the Spectate panel.
    function openSpectateTab() {
      if (document.getElementById('spectateTab')) {
        document.getElementById('spectateTab').style.right = '0';
        return;
      }

      const spectateTab = document.createElement('div');
      spectateTab.id = 'spectateTab';
      spectateTab.className = 'spectate-tab';

      // Use a template literal for multi-line HTML.
      spectateTab.innerHTML = `
        <div class="collapsible" data-action="toggleCollapse">
            Users (2) <span class="arrow">▶</span>
        </div>
        <div class="content player-list">
            <div class="player">
                <div class="player-info" data-action="copyPlayerInfo">
                    <img src="https://via.placeholder.com/40" alt="User">
                    <span>naze</span>
                </div>
                <span class="player-tag">naze</span>
            </div>
            <div class="player">
                <div class="player-info" data-action="copyPlayerInfo">
                    <img src="https://via.placeholder.com/40" alt="User">
                    <span>Hook</span>
                </div>
                <span class="player-tag">Hook</span>
            </div>
        </div>
        <div class="collapsible" data-action="toggleCollapse">
            Teams (1) <span class="arrow">▶</span>
        </div>
        <div class="content team">
            <div class="player">
                <div class="tick-button" data-action="toggleTick">☐</div>
                <div class="player-info" data-action="copyPlayerInfo">
                    <img src="https://via.placeholder.com/40" alt="User">
                    <span>naze</span>
                </div>
                <span class="score">1</span>
            </div>
            <div class="player">
                <div class="tick-button" data-action="toggleTick">☐</div>
                <div class="player-info" data-action="copyPlayerInfo">
                    <img src="https://via.placeholder.com/40" alt="User">
                    <span>Hook</span>
                </div>
                <span class="score">0</span>
            </div>
        </div>
        <div class="button-container">
            <div class="toggle-container">
                <span>Spy Tag</span>
                <div class="toggle" data-action="toggleSwitch">OFF</div>
            </div>
            <div class="toggle-container">
                <span>Cmd Chat</span>
                <div id="cmdChatToggle" class="toggle" data-action="toggleSwitch">OFF</div>
            </div>
        </div>
      `;

      document.body.appendChild(spectateTab);

      // Attach event listeners to the new elements.
      spectateTab.querySelectorAll('[data-action="toggleCollapse"]').forEach(el => {
        el.addEventListener('click', () => {
          toggleCollapse(el);
        });
      });
      spectateTab.querySelectorAll('[data-action="toggleSwitch"]').forEach(el => {
        el.addEventListener('click', () => {
          toggleSwitch(el);
        });
      });
      spectateTab.querySelectorAll('[data-action="toggleTick"]').forEach(el => {
        el.addEventListener('click', (e) => {
          toggleTick(e, el);
        });
      });
      spectateTab.querySelectorAll('[data-action="copyPlayerInfo"]').forEach(el => {
        el.addEventListener('click', (e) => {
          copyPlayerInfo(e, el);
        });
      });

      // Slide the panel into view.
      requestAnimationFrame(() => {
        spectateTab.style.right = '0';
      });
    }

    // Toggle collapse of sections.
    function toggleCollapse(element) {
      element.classList.toggle('active');
      const content = element.nextElementSibling;
      content.style.display = (content.style.display === "block") ? "none" : "block";
      const arrow = element.querySelector(".arrow");
      if (arrow) {
        arrow.style.transform = (content.style.display === "block") ? "rotate(90deg)" : "rotate(0deg)";
      }
    }

    // Toggle a switch on/off.
    function toggleSwitch(element) {
      element.classList.toggle('active');
      element.textContent = element.classList.contains('active') ? 'ON' : 'OFF';

      // If this is the Cmd Chat toggle, start or stop the observer.
      if (element.id === 'cmdChatToggle') {
        if (element.classList.contains('active')) {
          window.startCmdObserver && window.startCmdObserver();
        } else {
          window.stopCmdObserver && window.stopCmdObserver();
        }
      }
    }

    // Toggle tick state.
    function toggleTick(e, element) {
      e.stopPropagation();
      element.textContent = element.textContent.trim() === '✓' ? '☐' : '✓';
    }

    // Copy player info.
    function copyPlayerInfo(e, element) {
      e.stopPropagation();
      let textToCopy = '';
      if (e.target.tagName.toLowerCase() === 'img') {
        textToCopy = e.target.src;
      } else if (e.target.tagName.toLowerCase() === 'span') {
        textToCopy = e.target.textContent.trim();
      } else {
        const span = element.querySelector('span');
        if (span) {
          textToCopy = span.textContent.trim();
        }
      }
      if (!textToCopy) return;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy)
          .then(() => showCopyAlert(element, "Copied!"))
          .catch(err => console.error("Copy failed", err));
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          showCopyAlert(element, "Copied!");
        } catch (err) {
          console.error("Fallback: Copy failed", err);
        }
        document.body.removeChild(textarea);
      }
    }

    // Show a temporary "Copied!" alert.
    function showCopyAlert(parent, message) {
      const alertEl = document.createElement('div');
      alertEl.textContent = message;
      alertEl.className = 'copy-alert';
      parent.appendChild(alertEl);
      setTimeout(() => alertEl.remove(), 1500);
    }

    // Press Escape to hide and remove the panel.
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        const spectateTab = document.getElementById('spectateTab');
        if (spectateTab) {
          spectateTab.style.right = '-15vw';
          setTimeout(() => {
            spectateTab.remove();
            console.log('Spectate panel hidden.');
          }, 500);
        }
      }
    });

    // Inject CSS for the panel.
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

    // Start the process.
    initSpectate();
  })();
})();
