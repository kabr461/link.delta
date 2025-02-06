// ==UserScript==
// @name         Agar.io Complete Fix Package – Revised
// @namespace    http://secure-scripts.com
// @version      11.1
// @description  Enhanced CSP, WebSocket, and dependency fixes with updated allowed domains.
// @author       Your Name
// @match        *://agar.io/*
// @grant        none
// @run-at       document-start
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/prop-types/15.8.1/prop-types.min.js
// @require      https://unpkg.com/preact@10.11.3/dist/preact.umd.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Attempt to inject an expanded Content Security Policy.
    // NOTE: If the server sends its own CSP header, this meta tag might be ignored.
    const applySecurityPolicy = () => {
        const csp = document.createElement('meta');
        csp.httpEquiv = "Content-Security-Policy";
        csp.content = [
            // Allow your own domain and Agar.io subdomains.
            "default-src 'self' agar.io *.agar.io",
            // Allow inline scripts, eval, and our external script domains.
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' https://deltav4.gitlab.io https://www.gstatic.com https://cdnjs.cloudflare.com/ajax/libs/ https://unpkg.com/ https://www.googletagmanager.com",
            // Allow inline styles and external stylesheets.
            "style-src 'self' 'unsafe-inline' https://deltav4.gitlab.io",
            // Allow WebSocket connections to Agar.io domains plus a few extras.
            "connect-src 'self' ws: wss: *.agar.io *.miniclippt.com https://deltav4.gitlab.io wss://chat.delt.io",
            // Allow images from self and trusted domains.
            "img-src 'self' data: blob: https://*.gitlab.io i.imgur.com",
            // Allow media from our CDN and freesound.org (if needed).
            "media-src 'self' https://deltav4.gitlab.io https://freesound.org",
            // Allow manifest from our CDN.
            "manifest-src 'self' https://deltav4.gitlab.io",
            // Allow workers from self and blob: URLs.
            "worker-src 'self' blob:",
            // Allow frames from Google accounts (or other trusted origins).
            "frame-src https://accounts.google.com",
            // Allow fonts from self, data: and onlinewebfonts.
            "font-src 'self' data: https://db.onlinewebfonts.com"
        ].join('; ');
        document.head.prepend(csp);
    };

    // 2. Update the WebSocketManager with additional logging and fallback.
    class WebSocketManager {
        constructor() {
            // Update these endpoints as needed.
            this.endpoints = [
                'wss://live.agar.io',
                'wss://mca.agar.io',
                'wss://delta.agar.io'
            ];
            this.retryCount = 0;
            this.maxRetries = 5;
            this.connect();
        }

        connect() {
            // Cycle through endpoints
            const endpoint = this.endpoints[this.retryCount % this.endpoints.length];
            try {
                this.socket = new WebSocket(endpoint);
            } catch (e) {
                console.error('WebSocket constructor error:', e);
                this.handleReconnection();
                return;
            }

            this.socket.onopen = () => {
                console.log('[WebSocketManager] Connected to:', endpoint);
                this.retryCount = 0;
            };

            this.socket.onerror = (error) => {
                console.error('[WebSocketManager] Error on endpoint', endpoint, ':', error);
                // Sometimes onclose is also triggered; let that handle reconnection.
            };

            this.socket.onclose = (event) => {
                // 1000 means a clean close. Other codes indicate issues.
                if (event.code !== 1000) {
                    console.warn('[WebSocketManager] Connection closed abnormally:', event);
                    this.handleReconnection();
                } else {
                    console.log('[WebSocketManager] Connection closed cleanly.');
                }
            };
        }

        handleReconnection() {
            if (this.retryCount < this.maxRetries) {
                const delay = Math.pow(2, this.retryCount) * 1000; // Exponential backoff.
                console.warn(`[WebSocketManager] Reconnecting in ${delay} ms...`);
                setTimeout(() => {
                    this.retryCount++;
                    this.connect();
                }, delay);
            } else {
                console.error('[WebSocketManager] Max retries reached. Giving up.');
            }
        }
    }

    // 3. Dependency Management – ensuring libraries are available.
    const loadDependencies = () => {
        // Preact fallback (if needed)
        if (!window.preact) {
            window.preact = { h: window.h, Component: window.Component };
        }
        
        // Provide a minimal toastr for logging
        window.toastr = window.toastr || {
            success: (msg) => console.log('[toastr success]:', msg),
            error: (msg) => console.error('[toastr error]:', msg)
        };

        // SystemJS polyfill for dynamic imports
        window.System = window.System || {
            import: (module) => import(module).catch(err => console.error('System.import error:', err))
        };
    };

    // 4. Update deprecated features and handle Worker creation.
    const updateDeprecatedFeatures = () => {
        // Replace deprecated meta tag for mobile web app capability.
        document.querySelector('meta[name="apple-mobile-web-app-capable"]')?.remove();
        const mobileMeta = document.createElement('meta');
        mobileMeta.name = 'mobile-web-app-capable';
        mobileMeta.content = 'yes';
        document.head.appendChild(mobileMeta);

        // Wrap Worker constructor to allow data URLs (convert to blob URL).
        const OriginalWorker = window.Worker;
        window.Worker = function(url, options) {
            if (url.startsWith('data:')) {
                const code = url.split(',')[1];
                const blob = new Blob([decodeURIComponent(code)], {type: 'application/javascript'});
                url = URL.createObjectURL(blob);
            }
            return new OriginalWorker(url, options);
        };
    };

    // 5. Preload media assets.
    const loadMediaAssets = () => {
        const assetBase = 'https://deltav4.gitlab.io/v7/assets/';
        const assets = [
            'button-hover-1.wav',
            'button-click-1.wav',
            'button-change-1.wav'
        ].map(file => assetBase + file);

        assets.forEach(url => {
            try {
                const audio = new Audio(url);
                audio.load();
                console.log('[Media Loader] Preloading:', url);
            } catch (err) {
                console.error('[Media Loader] Failed to preload:', url, err);
            }
        });
    };

    // 6. Main Initialization
    (function init() {
        try {
            applySecurityPolicy();
        } catch (e) {
            console.warn('[Init] Failed to apply CSP:', e);
        }
        updateDeprecatedFeatures();
        loadDependencies();
        loadMediaAssets();

        // Start our WebSocketManager.
        new WebSocketManager();

        // Run any jQuery-dependent initialization once the DOM is ready.
        window.addEventListener('DOMContentLoaded', () => {
            if (window.$) {
                console.log('[jQuery] Ready – you can initialize additional components here.');
                // Example: $('body').css('background-color', '#f0f0f0');
            }
        });
    })();
})();
