// ==UserScript==
// @name         Agar.io Ultimate Fix
// @namespace    http://secure-scripts.com
// @version      7.0
// @description  Combined fixes for all reported errors
// @author       Your Name
// @match        *://agar.io/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // 1. Fix CSP Policy
    const applySecurityPolicy = () => {
        const csp = document.createElement('meta');
        csp.httpEquiv = "Content-Security-Policy";
        csp.content = [
            "default-src 'self' agar.io *.agar.io",
            "connect-src 'self' ws: wss: *.agar.io *.miniclippt.com",
            "script-src 'self' 'unsafe-inline' https://www.gstatic.com",
            "img-src 'self' data: blob: https://*.gitlab.io i.imgur.com",
            "manifest-src 'self'",
            "frame-src https://accounts.google.com"
        ].join('; ');
        document.head.prepend(csp);
    };

    // 2. WebSocket Connection Fix
    const fixWebSockets = () => {
        const originalWebSocket = window.WebSocket;
        
        window.WebSocket = function(url, protocols) {
            const validEndpoints = [
                'wss://live.agar.io',
                'wss://mca.agar.io',
                'wss://web-arenas-live-'
            ];

            if (!validEndpoints.some(e => url.includes(e))) {
                return new originalWebSocket(url, protocols);
            }

            console.log(`Connecting to secure WebSocket: ${url}`);
            const socket = new originalWebSocket(url, protocols);

            // Add retry logic
            let retries = 0;
            socket.addEventListener('close', (event) => {
                if (retries < 3 && event.code !== 1000) {
                    setTimeout(() => {
                        console.log(`Reconnecting attempt ${retries + 1}`);
                        window.WebSocket(url, protocols);
                        retries++;
                    }, 2000 * (retries + 1));
                }
            });

            return socket;
        };
    };

    // 3. Fix Deprecated APIs
    const updateMetaTags = () => {
        // Remove old meta tag
        const oldMeta = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
        if (oldMeta) oldMeta.remove();

        // Add new meta tag
        const newMeta = document.createElement('meta');
        newMeta.name = 'mobile-web-app-capable';
        newMeta.content = 'yes';
        document.head.appendChild(newMeta);
    };

    // 4. Safe Script Loading
    const loadScripts = () => {
        const scriptsToLoad = [
            'https://www.gstatic.com/_/mss/boq-identity/_/js/k=boq-identity.IdpIFrameHttp.en_US.VL4JSFaL1zk.es5.O/am=DAY/d=1/rs=AOaEmlG4sNaE1qrZLhoZw7_RR3UL0-ecBw/m=base'
        ];

        scriptsToLoad.forEach(src => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            document.head.appendChild(script);
        });
    };

    // 5. Main Initialization
    (function init() {
        applySecurityPolicy();
        updateMetaTags();
        fixWebSockets();
        loadScripts();

        // Add error handling for XMLHttpRequest
        const originalSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function(body) {
            this.addEventListener('error', handleXHRError);
            return originalSend.call(this, body);
        };

        function handleXHRError(event) {
            console.error('XHR Error:', {
                status: this.status,
                responseURL: this.responseURL,
                responseText: this.responseText
            });
        }
    })();
})();
