// ==UserScript==
// @name         Agar.io Ultimate Fix Package v12
// @namespace    http://secure-scripts.com
// @version      12.0
// @description  Complete CSP, WebSocket, and dependency fixes
// @author       Your Name
// @match        *://agar.io/*
// @grant        none
// @run-at       document-start
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/prop-types/15.8.1/prop-types.min.js
// @require      https://unpkg.com/preact@10.11.3/dist/preact.umd.js
// @require      https://cdn.jsdelivr.net/npm/toastr@2.1.4/build/toastr.min.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Enhanced Content Security Policy
    const applySecurityPolicy = () => {
        const csp = document.createElement('meta');
        csp.httpEquiv = "Content-Security-Policy";
        csp.content = [
            "default-src 'self' agar.io *.agar.io",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'",
            "   https://deltav4.gitlab.io https://www.gstatic.com https://cdnjs.cloudflare.com/ajax/libs/",
            "   https://unpkg.com/ https://cdn.jsdelivr.net/",
            "style-src 'self' 'unsafe-inline' https://deltav4.gitlab.io",
            "connect-src 'self' ws: wss: *://*.agar.io *://*.miniclippt.com https://deltav4.gitlab.io",
            "img-src 'self' data: blob: https://*.gitlab.io i.imgur.com https://db.onlinewebfonts.com",
            "font-src 'self' data: https://db.onlinewebfonts.com",
            "media-src 'self' https://deltav4.gitlab.io https://freesound.org",
            "manifest-src 'self' https://deltav4.gitlab.io",
            "worker-src 'self' blob:",
            "frame-src https://accounts.google.com"
        ].join('; ');
        document.head.prepend(csp);
    };

    // 2. Robust WebSocket Manager
    class WebSocketManager {
        constructor() {
            this.endpoints = [
                'wss://live.agar.io',
                'wss://mca.agar.io',
                'wss://delta.agar.io',
                'wss://chat.delt.io'
            ];
            this.retryCount = 0;
            this.maxRetries = 5;
            this.connection = null;
            this.connect();
        }

        connect() {
            const endpoint = this.endpoints[this.retryCount % this.endpoints.length];
            try {
                this.connection = new WebSocket(endpoint);
                this.setupEventHandlers();
            } catch (error) {
                this.handleError(error);
            }
        }

        setupEventHandlers() {
            this.connection.onopen = () => {
                console.log('WebSocket connected to:', this.connection.url);
                this.retryCount = 0;
            };

            this.connection.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.handleReconnection();
            };

            this.connection.onclose = (event) => {
                if (event.code !== 1000) this.handleReconnection();
            };
        }

        handleReconnection() {
            if (this.retryCount < this.maxRetries) {
                const delay = Math.pow(2, this.retryCount) * 1000;
                setTimeout(() => {
                    this.retryCount++;
                    console.log(`Reconnection attempt ${this.retryCount}`);
                    this.connect();
                }, delay);
            }
        }

        handleError(error) {
            console.error('Connection error:', error);
            this.handleReconnection();
        }
    }

    // 3. Dependency Initialization
    const initializeDependencies = () => {
        // Preact components fix
        window.preact = window.preact || { 
            h: window.h, 
            Component: window.Component,
            createElement: window.h
        };

        // Toastr configuration
        window.toastr = window.toastr || {
            success: (msg) => console.log('Success:', msg),
            error: (msg) => console.error('Error:', msg),
            options: {
                positionClass: 'toast-bottom-right',
                preventDuplicates: true
            }
        };

        // SystemJS polyfill
        window.System = {
            import: (module) => import(module).catch(console.error)
        };
    };

    // 4. Resource Handling
    const handleResources = () => {
        // Font preloading
        const fontLoader = new FontFace('CustomFont', 
            'url(https://db.onlinewebfonts.com/t/2545d122b16126676225a5b52283ae23.woff2)');
        fontLoader.load().then(() => document.fonts.add(fontLoader));

        // Media preloading
        ['button-hover-1.wav', 'button-click-1.wav'].forEach(file => {
            new Audio(`https://deltav4.gitlab.io/v7/assets/${file}`).load();
        });
    };

    // 5. Main Initialization
    (function main() {
        applySecurityPolicy();
        initializeDependencies();
        handleResources();
        new WebSocketManager();

        // Update deprecated meta tags
        document.querySelector('meta[name="apple-mobile-web-app-capable"]')?.remove();
        const mobileMeta = document.createElement('meta');
        mobileMeta.name = 'mobile-web-app-capable';
        mobileMeta.content = 'yes';
        document.head.appendChild(mobileMeta);

        // Safe DOM initialization
        window.addEventListener('DOMContentLoaded', () => {
            // Initialize jQuery-dependent components
            if (window.$) {
                $(document).ready(function() {
                    // Your jQuery initialization code here
                });
            }
        });
    })();
})();
