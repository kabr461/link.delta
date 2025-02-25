(function() {
  'use strict';

  // Function to inject script into iframe
  function injectIntoIframe() {
    const iframes = document.getElementsByTagName('iframe');
    let gameIframe = null;

    // Find the game iframe (often the main canvas iframe)
    for (let iframe of iframes) {
      if (iframe.src.includes('agar.io') || iframe.contentWindow.document.querySelector('canvas')) {
        gameIframe = iframe;
        break;
      }
    }

    if (!gameIframe) {
      console.log('Game iframe not found yet, retrying...');
      return false;
    }

    // Inject script into iframe
    const script = document.createElement('script');
    script.textContent = `
      (function() {
        // Run in iframe context
        function exposeData() {
          const delta = window.delta || window.game || window.agar || null;
          if (!delta || !delta.stores || !delta.client) return;

          setInterval(() => {
            // Player data
            const players = [];
            const playerStore = delta.stores;
            if (playerStore && typeof playerStore.getPlayer === 'function') {
              const clientId = delta.client.id || 0; // Adjust if ID known
              const player = playerStore.getPlayer(clientId);
              if (player) {
                players.push({
                  nick: player.nick || 'Unknown',
                  skin: player.skin || '',
                  tag: player.tag || '', // Disciplined field
                  color: player.color || '#FFFFFF',
                  mass: player.mass || 0,
                  x: player.x || 0,
                  y: player.y || 0
                });
              }
            }

            // Unit manager data
            const unitManager = delta.client.unitManager;
            const cells = [];
            if (unitManager && unitManager.unitMap) {
              unitManager.unitMap.forEach((unit) => {
                cells.push({
                  size: unit.size || 0,
                  x: unit.x || 0,
                  y: unit.y || 0
                });
              });
            }
            const activeUnit = unitManager.activeUnit || {};
            const activeUnitData = {
              nick: activeUnit.profile ? activeUnit.profile.nick : 'Unknown',
              size: activeUnit.size || 0,
              x: activeUnit.x || 0,
              y: activeUnit.y || 0
            };

            // Send to top-level window
            window.top.postMessage({
              deltaExposed: {
                players: players.length ? players : [{ nick: 'N/A', skin: '', tag: '' }],
                cells: cells,
                activeUnit: activeUnitData
              }
            }, 'https://agar.io');
          }, 100);
        }

        // Poll until delta is available
        const poll = setInterval(() => {
          if (window.delta || window.game || window.agar) {
            clearInterval(poll);
            exposeData();
          }
        }, 500);
      })();
    `;
    gameIframe.contentWindow.document.head.appendChild(script);
    return true;
  }

  // Wait for iframe to load
  const iframePoll = setInterval(() => {
    if (injectIntoIframe()) {
      clearInterval(iframePoll);
    }
  }, 500);

  // Receive data in top-level window
  window.addEventListener('message', (event) => {
    if (event.origin === 'https://agar.io' && event.data.deltaExposed) {
      window.deltaExposed = event.data.deltaExposed;
    }
  });
})();
