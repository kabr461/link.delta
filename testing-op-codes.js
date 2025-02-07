// ==UserScript==
// @name         Agar.io Custom Fixes
// @namespace    http://your-namespace
// @version      1.0
// @description  Attempt to fix or suppress known console issues on Agar.io
// @match        *://agar.io/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    /** -----------------------------------------------
     * 1. Remove or replace outdated meta tags
     * ------------------------------------------------*/
    document.querySelector('meta[name="apple-mobile-web-app-capable"]')?.remove();
    const mobileMeta = document.createElement('meta');
    mobileMeta.name = 'mobile-web-app-capable';
    mobileMeta.content = 'yes';
    document.head.appendChild(mobileMeta);

    /** -----------------------------------------------
     * 2. Apply a custom Content Security Policy
     *    - If you need to allow more domains (like
     *      https://www.gstatic.com) for Google's scripts,
     *      uncomment them in script-src or connect-src
     * ------------------------------------------------*/
    function applyCustomCSP() {
        // Remove existing CSP tags
        const oldCSP = document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]');
        oldCSP.forEach(el => el.remove());

        const newCSP = document.createElement('meta');
        newCSP.httpEquiv = "Content-Security-Policy";

        // Here we only allow scripts from 'self' and agar.io
        // Add other domains if needed: e.g. 'https://www.gstatic.com'
        newCSP.content = [
            "default-src 'self' agar.io *.agar.io",
            // If you want to allow gstatic:
            // "script-src 'self' 'unsafe-inline' agar.io *.agar.io https://www.gstatic.com",
            // Otherwise just:
            "script-src 'self' 'unsafe-inline' agar.io *.agar.io",
            "connect-src agar.io *.agar.io",
            "img-src 'self' data: blob: https://*.gitlab.io https://i.imgur.com",
            "style-src 'self' 'unsafe-inline'",
            "manifest-src 'self'",
            "frame-src 'self' https://accounts.google.com"
        ].join("; ");
        document.head.prepend(newCSP);
    }
    applyCustomCSP();

    /** -----------------------------------------------
     * 3. Example: Avoid document.write for external scripts
     *    Instead, load a script safely:
     * ------------------------------------------------*/
    function loadScriptSafe(url) {
        const script = document.createElement('script');
        script.src = url;
        script.async = true;
        document.head.appendChild(script);
    }
    // loadScriptSafe("https://kabr461.github.io/link.delta/fixed-testing-op-codes.js");
    // ^ Example: If you have a fixed script with correct syntax

    /** -----------------------------------------------
     * 4. Optional: Wave overlay code (example)
     *    Shows wave effect on click for demonstration
     * ------------------------------------------------*/
    const WAVE_CONFIG = {
        SPEED: 3,
        LINE_WIDTH: 2,
        FADE_RATE: 0.02,
        COLOR: '0, 200, 255'
    };
    let overlayCanvas, waves = [];

    function initOverlayCanvas() {
        if (document.getElementById('wave-overlay')) return;

        overlayCanvas = document.createElement('canvas');
        overlayCanvas.id = 'wave-overlay';
        overlayCanvas.style.position = 'absolute';
        overlayCanvas.style.left = '0';
        overlayCanvas.style.top = '0';
        overlayCanvas.style.pointerEvents = 'none';
        overlayCanvas.style.zIndex = '9999';
        document.body.appendChild(overlayCanvas);

        function resizeCanvas() {
            overlayCanvas.width = window.innerWidth;
            overlayCanvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const ctx = overlayCanvas.getContext('2d');
        requestAnimationFrame(function animate() {
            ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
            waves = waves.filter(w => {
                w.radius += WAVE_CONFIG.SPEED;
                w.opacity -= WAVE_CONFIG.FADE_RATE;
                ctx.beginPath();
                ctx.arc(w.x, w.y, w.radius, 0, Math.PI * 2);
                ctx.lineWidth = WAVE_CONFIG.LINE_WIDTH;
                ctx.strokeStyle = `rgba(${WAVE_CONFIG.COLOR},${w.opacity})`;
                ctx.stroke();
                return w.opacity > 0;
            });
            requestAnimationFrame(animate);
        });

        // Listen for clicks at the document level
        document.addEventListener('click', (e) => {
            const rect = overlayCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            waves.push({ x, y, radius: 0, opacity: 1 });
        });
    }

    // Start the overlay once the page body is ready
    const bodyObserver = new MutationObserver(() => {
        if (document.body) {
            bodyObserver.disconnect();
            initOverlayCanvas();
        }
    });
    bodyObserver.observe(document.documentElement, { childList: true, subtree: true });

    /** -----------------------------------------------
     * 5. Known Non-Fixable Errors (Explained)
     * ------------------------------------------------
     *  - 404 Not Found / 403 Forbidden
     *    Caused by server or domain restrictions
     *  - "Refused to get unsafe header 'access-control-expose-headers'"
     *    Caused by server not exposing certain headers
     *  - "Server Unit destroyed", "api destroyed", etc.
     *    Agar.io internal logs
     *  - "Chrome is moving towards a new experience..."
     *    Just an informational warning
     *  - "start_url ignored"
     *    The site’s manifest is cross-origin
     * 
     * None of these can be resolved purely from a userscript
     * as they require changes on the server or the main site’s code.
     */
})();
