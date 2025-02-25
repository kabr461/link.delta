// ==UserScript==
// @name         Delta Real-Time Data Grabber
// @match        *://agar.io/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
  'use strict';

  function findDeltaInstance() {
    // Common delta namespaces
    const candidates = ['delta', 'game', 'agar'];
    for (let key of candidates) {
      if (window[key] && window[key].stores && window[key].client) {
        return window[key];
      }
    }
    // Fallback scan
    for (let prop in window) {
      if (window[prop] && window[prop].stores && window[prop].client && window[prop].client.unitManager) {
        return window[prop];
      }
    }
    return null;
  }

  // Poll for delta instance
  const pollInterval = setInterval(() => {
    const delta = findDeltaInstance();
    if (delta) {
      clearInterval(pollInterval);
      exposeStructuredData(delta);
    }
  }, 500);

  function exposeStructuredData(delta) {
    setInterval(() => {
      // Player data
      const players = [];
      const playerStore = delta.stores;
      if (playerStore && typeof playerStore.getPlayer === 'function') {
        // Try current player (ID might be client-related)
        const clientId = delta.client.id || 0; // Fallback to 0 if ID unknown
        const player = playerStore.getPlayer(clientId);
        if (player) {
          players.push({
            nick: player.nick || 'Unknown',
            skin: player.skin || '',
            tag: player.tag || '', // Assuming tag exists
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

      // Expose structured data
      window.deltaExposed = {
        players: players.length ? players : [{ nick: 'N/A', skin: '', tag: '' }],
        cells: cells,
        activeUnit: activeUnitData
      };
    }, 100); // Update every 100ms
  }
})();
