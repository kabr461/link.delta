(function(){
  // Patch webpack push to capture the Delta instance when loaded
  const originalPush = window.webpackChunkdeltav7.push;
  window.webpackChunkdeltav7.push = function(modules) {
    const result = originalPush.apply(this, arguments);
    // Loop through the module definitions
    for (let id in modules[1]) {
      const mod = modules[1][id];
      if (mod && mod.exports && mod.exports.client) {
        const client = mod.exports.client;
        if (client.stores && typeof client.stores.getPlayer === "function" &&
            client.unitManager) {
          window.deltaInstance = mod.exports;
          console.log("Delta instance captured:", window.deltaInstance);
          break;
        }
      }
    }
    return result;
  };

  // After Delta loads, log the stored data
  setTimeout(() => {
    if (window.deltaInstance && window.deltaInstance.client) {
      const { stores, unitManager } = window.deltaInstance.client;
      console.log("Stores:", stores);
      console.log("UnitManager:", unitManager);
      // Log all player objects from stores
      if (stores.players) {
        console.log("All players data:", stores.players);
      } else {
        console.log("Player data not found in stores.");
      }
    } else {
      console.log("Delta instance not captured.");
    }
  }, 5000);
})();
