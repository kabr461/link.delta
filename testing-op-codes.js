// ==UserScript==
// @name         Agar.io Complete Fix Package
// @namespace    http://secure-scripts.com
// @version      11.0
// @description  Complete CSP, WebSocket, and dependency fixes
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

    // 1. Enhanced Content Security Policy
    const applySecurityPolicy = () => {
        const csp = document.createElement('meta');
        csp.httpEquiv = "Content-Security-Policy";
        csp.content = [
            "default-src 'self' agar.io *.agar.io",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' https://deltav4.gitlab.io https://www.gstatic.com https://cdnjs.cloudflare.com/ajax/libs/ https://unpkg.com/",
            "style-src 'self' 'unsafe-inline' https://deltav4.gitlab.io",
            "connect-src 'self' ws: wss: *.agar.io *.miniclippt.com https://deltav4.gitlab.io",
            "img-src 'self' data: blob: https://*.gitlab.io i.imgur.com",
            "media-src 'self' https://deltav4.gitlab.io",
            "manifest-src 'self' https://deltav4.gitlab.io",
            "worker-src 'self' blob:",
            "frame-src https://accounts.google.com",
            "font-src 'self' data:"
        ].join('; ');
        document.head.prepend(csp);
    };

    // 2. WebSocket Manager with Fallback
    class WebSocketManager {
        constructor() {
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
            this.socket = new WebSocket(endpoint);

            this.socket.onopen = () => {
                console.log('Connected to:', endpoint);
                this.retryCount = 0;
            };

            this.socket.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.handleReconnection();
            };

            this.socket.onclose = (event) => {
                if (event.code !== 1000) this.handleReconnection();
            };
        }

        handleReconnection() {
            if (this.retryCount < this.maxRetries) {
                const delay = Math.pow(2, this.retryCount) * 1000;
                setTimeout(() => {
                    this.retryCount++;
                    this.connect();
                }, delay);
            }
        }
    }

    // 3. Dependency Management
    const loadDependencies = () => {
        // Preact components fix
        window.preact = window.preact || { h: window.h, Component: window.Component };
        
        // Toastr initialization
        window.toastr = {
            success: (msg) => console.log('Success:', msg),
            error: (msg) => console.error('Error:', msg)
        };

        // SystemJS polyfill
        window.System = {
            import: (module) => import(module).catch(console.error)
        };
    };

    // 4. Deprecated API Handling
    const updateDeprecatedFeatures = () => {
        // Replace deprecated meta tag
        document.querySelector('meta[name="apple-mobile-web-app-capable"]')?.remove();
        const mobileMeta = document.createElement('meta');
        mobileMeta.name = 'mobile-web-app-capable';
        mobileMeta.content = 'yes';
        document.head.appendChild(mobileMeta);

        // Worker creation fix
        const originalWorker = window.Worker;
        window.Worker = function(url, options) {
            if (url.startsWith('data:')) {
                const blob = new Blob([url.split(',')[1]], {type: 'application/javascript'});
                url = URL.createObjectURL(blob);
            }
            return new originalWorker(url, options);
        };
    };

    // 5. Media Loader
    const loadMediaAssets = () => {
        const assets = [
            'button-hover-1.wav',
            'button-click-1.wav',
            'button-change-1.wav'
        ].map(file => `https://deltav4.gitlab.io/v7/assets/${file}`);

        assets.forEach(url => {
            new Audio(url).load(); // Preload media
        });
    };

    // Main Initialization
    (function init() {
        applySecurityPolicy();
        updateDeprecatedFeatures();
        loadDependencies();
        loadMediaAssets();
        new WebSocketManager();

        // Initialize jQuery after DOM ready
        window.addEventListener('DOMContentLoaded', () => {
            // Initialize components that depend on jQuery
            if (window.$) {
                // Your jQuery-dependent code here
            }
        });
    })();
})();
