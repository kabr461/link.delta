(function() {
  'use strict';

  function injectDataGrabber() {
    const canvas = document.querySelector('.canvas'); // Target by class
    const scripts = document.getElementsByTagName('script');
    let gameScript = null;
    for (let script of scripts) {
      if (script.src.includes('516.js')) { // Match your script
        gameScript = script;
        break;
      }
    }

    if (!canvas || !gameScript) {
      console.log('[Delta Grabber] Canvas or 516.js not found yet, retrying...');
      return false;
    }

    console.log('[Delta Grabber] Found canvas and 516.js:', canvas, gameScript.src);

    // Inject script in this context
    const script = document.createElement('script');
    script.textContent = `
      (function() {
        function exposeData() {
          const delta = window.delta || window.game || window.agar || null;
          console.log('[Delta Grabber] Delta context:', delta);
          if (!delta || !delta.stores || !delta.client) return;

          setInterval(() => {
            // Player data
            const players = [];
            const playerStore = delta.stores;
            if (playerStore && typeof playerStore.getPlayer === 'function') {
              const clientId = delta.client.id || 0; // Fallback, adjust if needed
              const player = playerStore.getPlayer(clientId);
              if (player) {
                players.push({
                  nick: player.nick || 'Unknown',
                  skin: player.skin || '',
                  tag: player.tag || '',
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

            // Expose globally
            window.deltaExposed = {
              players: players.length ? players : [{ nick: 'N/A', skin: '', tag: '' }],
              cells: cells,
              activeUnit: activeUnitData
            };
            console.log('[Delta Grabber] Data exposed:', window.deltaExposed);
          }, 100);
        }

        const poll = setInterval(() => {
          if (window.delta || window.game || window.agar) {
            console.log('[Delta Grabber] Delta found');
            clearInterval(poll);
            exposeData();
          }
        }, 500);
      })();
    `;
    document.head.appendChild(script);
    return true;
  }

  // Poll until ready
  const poll = setInterval(() => {
    if (injectDataGrabber()) {
      clearInterval(poll);
    }
  }, 500);
})();
