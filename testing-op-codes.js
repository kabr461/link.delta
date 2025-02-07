// ==UserScript==
// @name         Ultimate Open Access Mod for Agar.io (Attempted)
// @namespace    http://your-namespace-here.com
// @version      1.0
// @description  Attempts to remove all restrictions so every external resource can load without hindrance. (Extremely insecure!)
// @match        *://agar.io/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. Continuously Remove Existing CSP Meta Tags ---
    // (In case the page tries to add them later, we remove them as soon as possible.)
    const removeCSP = () => {
        document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]').forEach(tag => {
            tag.parentNode.removeChild(tag);
        });
    };
    removeCSP(); // Remove immediately on script load.

    // Use a MutationObserver to catch later additions
    const observer = new MutationObserver(() => {
        removeCSP();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // --- 2. Insert an Extremely Permissive CSP Meta Tag ---
    // (This meta tag tells the browser to allow everything from anywhere.)
    const meta = document.createElement('meta');
    meta.httpEquiv = "Content-Security-Policy";
    meta.content = "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; " +
                   "script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; " +
                   "style-src * 'unsafe-inline' data: blob:; " +
                   "img-src * data: blob:; " +
                   "connect-src *; " +
                   "manifest-src *; " +
                   "worker-src * blob:; " +
                   "frame-src *;";
    // Prepend the meta tag so it is as early as possible in the document.
    document.documentElement.prepend(meta);
    console.log("CSP set to extremely permissive mode.");

    // --- 3. Patch Worker Creation to Allow Inline (data URL) Code ---
    // Some scripts create workers using inline code (data URLs). This patch converts them to Blob URLs.
    (function() {
        const OriginalWorker = window.Worker;
        window.Worker = function(script, options) {
            if (typeof script === 'string' && script.startsWith('data:')) {
                try {
                    const commaIndex = script.indexOf(',');
                    const blobContent = decodeURIComponent(script.substring(commaIndex + 1));
                    const blob = new Blob([blobContent], { type: 'application/javascript' });
                    const blobUrl = URL.createObjectURL(blob);
                    return new OriginalWorker(blobUrl, options);
                } catch (e) {
                    console.error("Worker patch error:", e);
                }
            }
            return new OriginalWorker(script, options);
        };
    })();

    // --- 4. Define System.import Polyfill for Dynamic Module Loading ---
    if (!window.System) {
        window.System = {
            import: function(src) {
                return import(src);
            }
        };
    }

    console.log("Attempted to remove restrictions for all external resources.");
})();
