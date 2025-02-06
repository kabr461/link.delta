// ==UserScript==
// @name         Agar.io WebSocket Inspector v5.0
// @namespace    http://secure-scripts.com
// @version      5.0
// @description  Advanced WebSocket monitoring with toggleable interception
// @author       Your Name
// @match        *://agar.io/*
// @grant        none
// @run-at       document-start
// @noframes
// ==/UserScript==

(function() {
    'use strict';

    // ======================
    // Configuration
    // ======================
    const ENABLE_INTERCEPTOR = true; // Set to false to disable interception
    const MONITORED_ENDPOINTS = [
        'wss://live.agar.io/',
        'wss://mca.agar.io/',
        'wss://delta.agar.io/'
    ];
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 2000; // 2 seconds

    // ======================
    // Utility Functions
    // ======================
    const bufferToHex = buffer => Array.from(new Uint8Array(buffer), 
        byte => byte.toString(16).padStart(2, '0').toUpperCase()
    ).join(' ');

    const parseProtocol = buffer => {
        const view = new DataView(buffer);
        if (view.byteLength < 2) return null;
        return {
            messageId: view.getUint8(0),
            protocolVersion: view.getUint8(1)
        };
    };

    // ======================
    // WebSocket Monitor
    // ======================
    class WSMonitor {
        constructor(url) {
            this.url = url;
            this.retryCount = 0;
            this.ws = new WebSocket(url);
            this.bindEvents();
        }

        bindEvents() {
            this.ws.addEventListener('open', () => this.onOpen());
            this.ws.addEventListener('message', e => this.onMessage(e));
            this.ws.addEventListener('close', e => this.onClose(e));
            this.ws.addEventListener('error', e => this.onError(e));

            const originalSend = this.ws.send.bind(this.ws);
            this.ws.send = data => {
                this.logData('📤 Outgoing', data);
                originalSend(data);
            };
        }

        logData(direction, data) {
            try {
                if (data instanceof Blob) {
                    data.arrayBuffer().then(buf => {
                        console.log(`${direction} Blob:`, bufferToHex(buf));
                        this.logProtocol(buf);
                    });
                } else if (data instanceof ArrayBuffer) {
                    console.log(`${direction} Buffer:`, bufferToHex(data));
                    this.logProtocol(data);
                } else {
                    console.log(`${direction} Text:`, data);
                }
            } catch (error) {
                console.error('[⚠️] Logging Error:', error);
            }
        }

        logProtocol(buffer) {
            const protocol = parseProtocol(buffer);
            if (protocol) {
                console.log(`[🔍] Message ID: 0x${protocol.messageId.toString(16)}`, 
                            `Version: ${protocol.protocolVersion}`);
            }
        }

        onOpen() {
            console.log(`[✅] Connected to ${this.url}`);
            this.retryCount = 0;
        }

        onMessage(event) {
            this.logData('📩 Incoming', event.data);
        }

        onClose(event) {
            console.warn(`[❌] Connection closed (${event.code}): ${event.reason}`);
            if (event.code !== 1000 && this.retryCount < MAX_RETRIES) {
                setTimeout(() => new WSMonitor(this.url), RETRY_DELAY * (this.retryCount + 1));
                this.retryCount++;
            }
        }

        onError(error) {
            console.error('[⚠️] WebSocket Error:', error);
        }
    }

    // ======================
    // Main Initialization
    // ======================
    if (!ENABLE_INTERCEPTOR) {
        console.log('[🚫] WebSocket Interceptor is disabled.');
        return;
    }

    console.log('[🔐] Initializing Advanced Inspector...');

    // Override WebSocket constructor
    const OriginalWebSocket = window.WebSocket;
    window.WebSocket = function(url) {
        if (MONITORED_ENDPOINTS.some(e => url.startsWith(e))) {
            console.log(`[🔗] Monitoring WebSocket: ${url}`);
            return new WSMonitor(url).ws;
        }
        return new OriginalWebSocket(url);
    };

    console.log('[🛡️] WebSocket Inspector Active!');
})();
