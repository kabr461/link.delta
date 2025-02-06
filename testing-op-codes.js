// ==UserScript==
// @name         Agar.io Complete Fix Package – Revised
// @namespace    http://secure-scripts.com
// @version      7.7
// @description  CSP, WebSocket, and dependency fixes – adjust endpoints/URLs as needed
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
    // NOTE: If the server sends its own CSP header, this meta tag may be ignored.
    const applySecurityPolicy = () => {
        const csp = document.createElement('meta');
        csp.httpEquiv = "Content-Security-Policy";
        csp.content = [
            "default-src 'self' agar.io *.agar.io",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' https://deltav4.gitlab.io https://www.gstatic.com https://cdnjs.cloudflare.com/ajax/libs/ https://unpkg.com/ https://www.googletagmanager.com https://connect.facebook.net https://accounts.google.com",
            "style-src 'self' 'unsafe-inline' https://deltav4.gitlab.io",
            "connect-src 'self' ws: wss: *.agar.io *.miniclippt.com https://deltav4.gitlab.io wss://chat.delt.io",
            "img-src 'self' data: blob: https://*.gitlab.io i.imgur.com",
            "media-src 'self' https://deltav4.gitlab.io https://freesound.org",
            "manifest-src 'self' https://deltav4.gitlab.io",
            "worker-src 'self' blob:",
            "frame-src https://accounts.google.com",
            "font-src 'self' data: https://db.onlinewebfonts.com"
        ].join('; ');
        document.head.prepend(csp);
    };

    // 2. WebSocket Manager – update endpoints as needed.
    class WebSocketManager {
        constructor() {
            // Update these endpoints based on current data.
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
            const endpoint = this.endpoints[this.retryCount % this.endpoints.length];
            try {
                this.socket = new WebSocket(endpoint);
            } catch (e) {
                console.error('[WebSocketManager] Constructor error:', e);
                this.handleReconnection();
                return;
            }

            this.socket.onopen = () => {
                console.log('[WebSocketManager] Connected to:', endpoint);
                this.retryCount = 0;
            };

            this.socket.onerror = (error) => {
                console.error('[WebSocketManager] Error on', endpoint, ':', error);
            };

            this.socket.onclose = (event) => {
                if (event.code !== 1000) {
                    console.warn('[WebSocketManager] Abnormal close:', event);
                    this.handleReconnection();
                } else {
                    console.log('[WebSocketManager] Connection closed cleanly.');
                }
            };
        }

        handleReconnection() {
            if (this.retryCount < this.maxRetries) {
                const delay = Math.pow(2, this.retryCount) * 1000;
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

    // 3. Dependency management.
    const loadDependencies = () => {
        if (!window.preact) {
            window.preact = { h: window.h, Component: window.Component };
        }
        window.toastr = window.toastr || {
            success: (msg) => console.log('[toastr success]:', msg),
            error: (msg) => console.error('[toastr error]:', msg)
        };
        window.System = window.System || {
            import: (module) => import(module).catch(err => console.error('System.import error:', err))
        };
    };

    // 4. Update deprecated features.
    const updateDeprecatedFeatures = () => {
        document.querySelector('meta[name="apple-mobile-web-app-capable"]')?.remove();
        const mobileMeta = document.createElement('meta');
        mobileMeta.name = 'mobile-web-app-capable';
        mobileMeta.content = 'yes';
        document.head.appendChild(mobileMeta);

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
                console.error('[Media Loader] Error preloading:', url, err);
            }
        });
    };

    // 6. Main initialization.
    (function init() {
        try { applySecurityPolicy(); } catch (e) { console.warn('[Init] CSP injection failed:', e); }
        updateDeprecatedFeatures();
        loadDependencies();
        loadMediaAssets();
        new WebSocketManager();

        window.addEventListener('DOMContentLoaded', () => {
            if (window.$) {
                console.log('[jQuery] Ready.');
                // Add any jQuery-dependent code here.
            }
        });
    })();
})();
