(function() {
  'use strict';
  console.log("[DeltaDecompressor] Script loaded.");

  // Function to search through the webpack bundle for a candidate decompress function.
  function findDecompressFunction() {
    if (!window.webpackChunkdeltav7) {
      console.error("[DeltaDecompressor] webpackChunkdeltav7 not available.");
      return null;
    }
    for (const chunk of window.webpackChunkdeltav7) {
      if (chunk && chunk[1]) {
        const modules = chunk[1];
        for (const key in modules) {
          const mod = modules[key];
          if (typeof mod === "function") {
            const code = mod.toString();
            // Look for a clue in the code that this is the decompress function.
            if (code.indexOf("_decompress") > -1 || code.indexOf("l._decompress") > -1) {
              console.log("[DeltaDecompressor] Found potential decompress function:", mod);
              return mod;
            }
          }
        }
      }
    }
    console.warn("[DeltaDecompressor] Decompress function not found.");
    return null;
  }

  // Attempt to locate the internal decompress function.
  const internalDecompress = findDecompressFunction();
  if (internalDecompress) {
    // Attach it to a global variable for easier access.
    window.deltaDecompress = internalDecompress;
    console.log("[DeltaDecompressor] Exposed as window.deltaDecompress.");

    // Create a wrapper that mimics decompressFromBase64.
    // Delta's own implementation likely calls the internal decompress function like:
    //    _decompress(encoded.length, 32, lookupFunction)
    // where 32 is the bit parameter for base64 and lookupFunction returns the character
    // from the base64 alphabet at a given index.
    window.deltaDecompressFromBase64 = function(encoded) {
      if (encoded == null) return "";
      if (encoded === "") return null;
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      // Call the internal decompress function with:
      // - encoded.length as the length,
      // - 32 as the bit parameter (for base64),
      // - a lookup function that maps index to the corresponding character from alphabet.
      return window.deltaDecompress(encoded.length, 32, function(idx) {
        return alphabet.charAt(idx);
      });
    };

    console.log("[DeltaDecompressor] Wrapper function deltaDecompressFromBase64 is available.");
    // You can test it with a known encoded string:
    // let testEncoded = "yourBase64EncodedStringHere";
    // console.log("Decompressed result:", window.deltaDecompressFromBase64(testEncoded));
  } else {
    console.error("[DeltaDecompressor] Unable to find the internal decompress function.");
  }
})();
