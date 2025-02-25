(function(){
  // Assume the Delta module class is available as $, for example.
  if (typeof $ !== "undefined") {
    const OriginalDelta = $;
    // Create a patched constructor that saves the instance
    function PatchedDelta(...args) {
      const instance = new OriginalDelta(...args);
      window.deltaInstance = instance;  // Expose it globally
      console.log("Delta instance exposed:", instance);
      return instance;
    }
    PatchedDelta.prototype = OriginalDelta.prototype;
    // Overwrite the original export (if possible)
    window.Delta = PatchedDelta;
  } else {
    console.error("Delta module not found!");
  }
})();
