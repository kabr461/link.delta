// Chat substitution functionality
(function() {
  const containerEls = document.querySelectorAll(".flex-row.p-1.gap-2");
  const validContainers = [];

  containerEls.forEach(container => {
    const commandInput = container.querySelector("input[name='command']");
    const keyboardInput = container.querySelector("input[name='keyboard']");
    if (commandInput && keyboardInput) validContainers.push({ commandInput, keyboardInput });
  });

  const chatInput = document.getElementById("message");
  if (chatInput && validContainers.length) {
    const escapeRegExp = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    chatInput.addEventListener("keydown", event => {
      if (!event.isTrusted) return;
      if (event.key === "Enter") {
        event.preventDefault();
        let modifiedMessage = chatInput.value;
        validContainers.forEach(({ commandInput, keyboardInput }) => {
          const pattern = keyboardInput.value.trim();
          if (!pattern) return;
          const regex = new RegExp(escapeRegExp(pattern), "gi");
          modifiedMessage = modifiedMessage.replace(regex, commandInput.value);
        });
        chatInput.value = modifiedMessage;
        setTimeout(() => {
          chatInput.dispatchEvent(new KeyboardEvent("keydown", {
            key: "Enter",
            code: "Enter",
            keyCode: 13,
            which: 13,
            bubbles: true
          }));
        }, 50);
      }
    });
  }
})();

// Spectate button functionality (delayed initialization)
(function() {
  // Try to initialize the Spectate functionality until the button is found
  function initSpectate() {
    // Find the <div> with class "btn-layer" that exactly matches the text "Spectate"
    const spectateBtn = Array.from(document.querySelectorAll('div.btn-layer'))
      .find(el => el.textContent.trim() === 'Spectate');

    if (!spectateBtn) {
      console.log('Spectate button not found yet. Retrying...');
      return setTimeout(initSpectate, 10000); // Retry after 500ms
    }

    console.log('Spectate button found:', spectateBtn);

    // Attach a click event listener to the Spectate button.
    spectateBtn.addEventListener('click', function() {
      console.log('Spectate button clicked!');
      openSpectateTab();
    });

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
        <div class="title">Users (2)</div>
        <div class="team-bar">Teams (1)</div>
        <div class="team">
            <div class="player">
                <div class="player-info">
                    <img src="https://via.placeholder.com/40" alt="User">
                    <span>naze</span>
                </div>
                <span>1</span>
            </div>
            <div class="player">
                <div class="player-info">
                    <img src="https://via.placeholder.com/40" alt="User">
                    <span>Hook</span>
                </div>
                <span>0</span>
            </div>
        </div>
        <div class="button-container">
            <div class="toggle-container">
                <span>Spy Tag</span>
                <div class="toggle" onclick="toggleSwitch(this)">OFF</div>
            </div>
            <div class="toggle-container">
                <span>Cmd Chat</span>
                <div class="toggle" onclick="toggleSwitch(this)">OFF</div>
            </div>
            <div class="toggle-container">
                <span>Ext. Map</span>
                <div class="toggle" onclick="toggleSwitch(this)">OFF</div>
            </div>
            <div class="toggle-container">
                <span>Full Map</span>
                <div class="toggle" onclick="toggleSwitch(this)">OFF</div>
            </div>
        </div>
      `;

      document.body.appendChild(spectateTab);

      // Animate the panel sliding in using requestAnimationFrame
      requestAnimationFrame(() => {
        spectateTab.style.right = '0';
      });
    }

    // Function to toggle switches on click
    window.toggleSwitch = function(element) {
      element.classList.toggle('active');
      element.textContent = element.classList.contains('active') ? 'ON' : 'OFF';
    };

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
      .title {
          font-size: 0.9vw;
          text-align: left;
          font-weight: bold;
          margin-bottom: 6px;
          padding-left: 5px;
          color: #bbb;
      }
      .team-bar {
          text-align: left;
          font-size: 0.9vw;
          font-weight: bold;
          padding: 4px 5px;
          background: #222;
          border-top: 1px solid #444;
          border-bottom: 1px solid #444;
          margin-bottom: 5px;
      }
      .team {
          padding-bottom: 0.5vh;
          margin-bottom: 1vh;
          flex: 50%;
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
      }
      .player img {
          width: 2vw;
          height: 2vw;
          border-radius: 50%;
          margin-right: 0.5vw;
      }
      .button-container {
          display: flex;
          flex-direction: column;
          gap: 1px;
          flex: 30%;
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
    `;
    document.head.appendChild(style);
  }

  // Begin the initialization
  initSpectate();
})();
