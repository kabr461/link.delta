// ==UserScript==
// @name         Agar.io Ultimate Fix Package
// @namespace    http://secure-scripts.com
// @version      10.0
// @description  Complete error resolution with WebSocket & CSP fixes
// @author       Your Name
// @match        *://agar.io/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // 1. Enhanced Security Policy
    const applySecurityPolicy = () => {
        const csp = document.createElement('meta');
        csp.httpEquiv = "Content-Security-Policy";
        csp.content = [
            "default-src 'self' agar.io *.agar.io",
            "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://deltav4.gitlab.io https://www.gstatic.com",
            "style-src 'self' 'unsafe-inline' https://deltav4.gitlab.io",
            "connect-src 'self' ws: wss: *.agar.io *.miniclippt.com",
            "img-src 'self' data: blob: https://*.gitlab.io i.imgur.com",
            "manifest-src 'self' https://deltav4.gitlab.io",
            "worker-src 'self' blob:",
            "frame-src https://accounts.google.com",
            "font-src 'self' data:"
        ].join('; ');
        document.head.prepend(csp);
    };

    // 2. Robust WebSocket Manager
    class WebSocketManager {
        constructor() {
            this.endpoints = [
                'wss://live.agar.io',
                'wss://mca.agar.io',
                'wss://delta.agar.io'
            ];
            this.socket = null;
            this.retries = 0;
            this.maxRetries = 3;
            this.connect();
        }

        connect() {
            const endpoint = this.endpoints.find(url => {
                try { return new WebSocket(url); }
                catch { return false; }
            });

            if (!endpoint) return;

            this.socket = new WebSocket(endpoint);
            this.setupEventHandlers();
        }

        setupEventHandlers() {
            this.socket.onopen = () => {
                this.retries = 0;
                console.log('WS Connected:', this.socket.url);
            };

            this.socket.onerror = (e) => {
                console.error('WS Error:', e);
                this.reconnect();
            };

            this.socket.onclose = (e) => {
                if (e.code !== 1000) this.reconnect();
            };
        }

        reconnect() {
            if (this.retries < this.maxRetries) {
                setTimeout(() => {
                    this.retries++;
                    this.connect();
                }, Math.pow(2, this.retries) * 1000);
            }
        }
    }

    // 3. Dependency Loader
    const loadDependencies = () => {
        const loadScript = (src, integrity) => {
            const script = document.createElement('script');
            script.src = src;
            if (integrity) script.integrity = integrity;
            script.crossOrigin = 'anonymous';
            document.head.appendChild(script);
        };

        const loadStyle = (href) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            document.head.appendChild(link);
        };

        // Load required resources
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/prop-types/15.8.1/prop-types.min.js');
        loadScript('https://unpkg.com/preact@10.11.3/dist/preact.umd.js');
        loadStyle('https://deltav4.gitlab.io/v7/main.css');
    };

    // 4. Deprecated API Fixes
    const updateDeprecatedFeatures = () => {
        // Replace deprecated meta tag
        const oldMeta = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
        if (oldMeta) oldMeta.remove();
        
        const newMeta = document.createElement('meta');
        newMeta.name = 'mobile-web-app-capable';
        newMeta.content = 'yes';
        document.head.appendChild(newMeta);

        // Fix worker creation
        const originalWorker = window.Worker;
        window.Worker = function(url, options) {
            if (url.startsWith('data:')) {
                const blob = new Blob([url.split(',')[1]], {type: 'application/javascript'});
                url = URL.createObjectURL(blob);
            }
            return new originalWorker(url, options);
        };
    };

    // 5. Main Initialization
    (function init() {
        applySecurityPolicy();
        updateDeprecatedFeatures();
        loadDependencies();
        new WebSocketManager();

        // Safe DOM initialization
        window.addEventListener('DOMContentLoaded', () => {
            // Initialize game components here
            if (typeof System !== 'undefined') {
                System.import('game-module').catch(console.error);
            }
        });
    })();
})();
