// Chat observer logic using previous approach
(function() {
  const chatContainer = document.querySelector('.chatmessages');
  if (!chatContainer) {
    console.error("Chat container not found!");
    return;
  }
  
  // Global variable to hold our observer instance
  let cmdObserver = null;
  
  // Function to start the command observer
  function startCmdObserver() {
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
    
    // Observe changes within the chat container (including subtree for nested nodes)
    cmdObserver.observe(chatContainer, { childList: true, subtree: true });
    console.log("Command style observer started.");
  }
  
  // Function to stop the command observer
  function stopCmdObserver() {
    if (cmdObserver) {
      cmdObserver.disconnect();
      cmdObserver = null;
      console.log("Command style observer stopped.");
    }
  }
  
  // Expose these functions so that they can be called from the toggle code
  window.startCmdObserver = startCmdObserver;
  window.stopCmdObserver = stopCmdObserver;
})();
  
// Spectate panel code
(function() {
  function initSpectate() {
    // Find the <div> with class "btn-layer" that exactly matches the text "Spectate"
    const spectateBtn = Array.from(document.querySelectorAll('div.btn-layer'))
      .find(el => el.textContent.trim() === 'Spectate');

    if (!spectateBtn) {
      console.log('Spectate button not found yet. Retrying...');
      return setTimeout(initSpectate, 500); // Retry after 500ms
    }

    console.log('Spectate button found:', spectateBtn);

    // Attach a click event listener to the Spectate button.
    spectateBtn.addEventListener('click', function() {
      console.log('Spectate button clicked!');
      openSpectateTab();
    });
  }

  // Function to create and show the Spectate UI panel
  function openSpectateTab() {
    // Prevent duplicate panels
    if (document.getElementById('spectateTab')) {
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
              <div class="tick-button" onclick="toggleTick(this)">☐</div>
              <div class="player-info" onclick="copyPlayerInfo(event, this)">
                  <img src="https://via.placeholder.com/40" alt="User">
                  <span>naze</span>
              </div>
              <span class="score">1</span>
          </div>
          <div class="player">
              <div class="tick-button" onclick="toggleTick(this)">☐</div>
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
              <!-- Added an id to easily reference the Cmd Chat toggle -->
              <div id="cmdChatToggle" class="toggle" onclick="toggleSwitch(this)">OFF</div>
          </div>
      </div>
    `;

    document.body.appendChild(spectateTab);

    // Animate the panel sliding in using requestAnimationFrame
    requestAnimationFrame(() => {
      spectateTab.style.right = '0';
    });
  }

  // Function to toggle collapsible sections
  window.toggleCollapse = function(element) {
    element.classList.toggle('active');
    const content = element.nextElementSibling;
    content.style.display = content.style.display === "block" ? "none" : "block";
    element.querySelector(".arrow").style.transform =
      content.style.display === "block" ? "rotate(90deg)" : "rotate(0deg)";
  };

  // Function to toggle switches on click
  window.toggleSwitch = function(element) {
    element.classList.toggle('active');
    element.textContent = element.classList.contains('active') ? 'ON' : 'OFF';
    
    // If this is the Cmd Chat toggle, use the previously defined observer logic
    if (element.id === 'cmdChatToggle') {
      if (element.classList.contains('active')) {
        startCmdObserver();
      } else {
        stopCmdObserver();
      }
    }
  };

  // Toggle tick state on click
  window.toggleTick = function(element) {
    // Toggle between ticked (✓) and unticked (☐)
    element.textContent = element.textContent.trim() === '✓' ? '☐' : '✓';
    // Prevent event propagation so the parent click doesn't trigger copy
    event.stopPropagation();
  };

  // Function to copy player info (depending on what was clicked)
  // If the image is clicked, copy the URL; if the span is clicked, copy the text
  window.copyPlayerInfo = function(event, container) {
    event.stopPropagation();
    let textToCopy = '';
    const target = event.target;
    if (target.tagName.toLowerCase() === 'img') {
      textToCopy = target.src;
    } else if (target.tagName.toLowerCase() === 'span') {
      textToCopy = target.textContent.trim();
    } else {
      // If container was clicked, default to copying the name from the first span
      const span = container.querySelector('span');
      if (span) {
        textToCopy = span.textContent.trim();
      }
    }
    if (!textToCopy) return;
    
    // Use the Clipboard API if available
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        showCopyAlert(container, "Copied!");
      }).catch(err => {
        console.error("Copy failed", err);
      });
    } else {
      // Fallback using a temporary textarea
      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        showCopyAlert(container, "Copied!");
      } catch (err) {
        console.error("Fallback: Copy failed", err);
      }
      document.body.removeChild(textarea);
    }
  };

  // Function to show a temporary copy alert
  function showCopyAlert(parent, message) {
    const alertEl = document.createElement('div');
    alertEl.textContent = message;
    alertEl.className = 'copy-alert';
    parent.appendChild(alertEl);
    setTimeout(() => {
      alertEl.remove();
    }, 1500);
  }

  // Listen for the Escape key to slide the panel out and remove it
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

  // Inject CSS styles for the Spectate panel into the page
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
    .name {
        margin: 0 0.2vw;
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
})();
