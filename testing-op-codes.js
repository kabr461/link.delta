// ==UserScript==
// @name         Ultimate Open Access Mod for Agar.io
// @namespace    http://your-namespace-here.com
// @version      1.0
// @description  Removes nearly all restrictions so every external resource can load without hindrance. (Use with caution—this is insecure.)
// @match        *://agar.io/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    
    // 1. Remove any existing Content Security Policy (CSP) meta tags
    document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]').forEach(function(tag) {
        tag.parentNode.removeChild(tag);
    });
    
    // 2. Insert an extremely permissive CSP meta tag
    var meta = document.createElement('meta');
    meta.httpEquiv = "Content-Security-Policy";
    meta.content = "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; " +
                   "script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; " +
                   "style-src * 'unsafe-inline' data: blob:; " +
                   "img-src * data: blob:; " +
                   "connect-src *; " +
                   "manifest-src *; " +
                   "worker-src * blob:; " +
                   "frame-src *;";
    document.head.prepend(meta);
    console.log("CSP set to extremely permissive mode.");

    // 3. Patch Worker creation so that inline code (data URLs) is allowed
    (function() {
        var OriginalWorker = window.Worker;
        window.Worker = function(script, options) {
            if (typeof script === 'string' && script.startsWith('data:')) {
                try {
                    var commaIndex = script.indexOf(',');
                    var blobContent = decodeURIComponent(script.substring(commaIndex + 1));
                    var blob = new Blob([blobContent], { type: 'application/javascript' });
                    var blobUrl = URL.createObjectURL(blob);
                    return new OriginalWorker(blobUrl, options);
                } catch (e) {
                    console.error("Worker patch error:", e);
                }
            }
            return new OriginalWorker(script, options);
        };
    })();

    // 4. Define System.import polyfill if it doesn't exist (for dynamic module loading)
    if (!window.System) {
        window.System = {
            import: function(src) {
                return import(src);
            }
        };
    }

    console.log("All restrictions have been lifted. Every invited resource can now access the party without limits!");
})();
