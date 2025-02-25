(function(){
  // Run this as early as possible—ideally injected in the page's head.
  if (typeof window.webpackChunkdeltav7 !== "undefined") {
    // Save the original Delta module constructor (assumed exported as $)
    const OriginalDelta = window.Delta; // Or whatever the module export is
    if (OriginalDelta) {
      function PatchedDelta(...args) {
        const instance = new OriginalDelta(...args);
        // Expose the instance globally
        window.deltaInstance = instance;
        console.log("Delta instance captured:", instance);
        return instance;
      }
      PatchedDelta.prototype = OriginalDelta.prototype;
      window.Delta = PatchedDelta;
    }
  } else {
    console.warn("Webpack Chunk for Delta not available!");
  }
  
  // Periodically check and log the internal data
  setTimeout(() => {
    if (window.deltaInstance && window.deltaInstance.client) {
      const { stores, unitManager } = window.deltaInstance.client;
      console.log("Stores:", stores);
      console.log("UnitManager:", unitManager);
      if (stores && stores.players) {
        console.log("Player Data:", stores.players);
      }
    } else {
      console.warn("Delta instance not captured. Make sure your script loads before Delta.");
    }
  }, 5000);
})();
