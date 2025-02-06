// ==UserScript==
// @name         WebSocket Interceptor for Agar.io
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Intercepts WebSocket messages between Agar.io and Delta
// @author       Your Name
// @match        *://agar.io/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log("[🔍] Injecting WebSocket Interceptor...");

    const script = document.createElement("script");
    script.textContent = `

        (function() {
            let originalWebSocket = window.WebSocket;
            let socketInstances = [];

            window.WebSocket = function(url, protocols) {
                console.log("[🌐] WebSocket Connection Attempt:", url);

                const socket = new originalWebSocket(url, protocols);
                socketInstances.push(socket);

                socket.addEventListener("open", function(event) {
                    console.log("[✅] WebSocket Connected:", event.target.url);
                });

                socket.addEventListener("message", function(event) {
                    let data = event.data;

                    if (typeof data === "string") {
                        console.log("[📩] String Message Received:", data);
                    } else {
                        const reader = new FileReader();
                        reader.onload = function() {
                            let arr = new Uint8Array(reader.result);
                            console.log("[📩] Binary Message Received:", arr);
                        };
                        reader.readAsArrayBuffer(data);
                    }
                });

                socket.addEventListener("close", function(event) {
                    console.warn("[❌] WebSocket Closed:", event);
                });

                return socket;
            };

            console.log("[🛠️] WebSocket Interceptor Installed!");
        })();
    `;

    document.documentElement.appendChild(script);
})();
