console.log("[Delta UI Mod] Injecting Network-Synced Wave Effect...");

(function () {
    'use strict';

    // Store wave effect positions
    let waveEffects = [];
    let websocket = null; // Global WebSocket reference

    function createWaveEffect(x, y) {
        waveEffects.push({ x, y, alpha: 1.0, radius: 5 });
    }

    function renderWaveEffects(ctx) {
        for (let i = waveEffects.length - 1; i >= 0; i--) {
            let wave = waveEffects[i];

            ctx.beginPath();
            ctx.arc(wave.x, wave.y, wave.radius, 0, 2 * Math.PI);
            ctx.strokeStyle = `rgba(0, 255, 255, ${wave.alpha})`;
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.closePath();

            // Animate wave
            wave.radius += 2;
            wave.alpha -= 0.05;

            // Remove faded waves
            if (wave.alpha <= 0) {
                waveEffects.splice(i, 1);
            }
        }
    }

    function modifyDeltaCanvas() {
        let originalRender = window.requestAnimationFrame;
        
        window.requestAnimationFrame = function(callback) {
            return originalRender.call(window, function(time) {
                let canvas = document.querySelector("canvas");
                if (canvas) {
                    let ctx = canvas.getContext("2d");
                    renderWaveEffects(ctx);
                }
                callback(time);
            });
        };
    }

    function sendWaveEffect(x, y) {
        if (!websocket || websocket.readyState !== WebSocket.OPEN) {
            console.warn("⚠ WebSocket is not connected! Cannot send wave effect.");
            return;
        }

        let buffer = new ArrayBuffer(5);
        let view = new DataView(buffer);
        view.setUint8(0, 250);  // Custom OpCode for Wave Sync (Choose a free OpCode)
        view.setUint16(1, x, true);
        view.setUint16(3, y, true);

        websocket.send(buffer);
        console.log("🌊 Sent Wave Effect to All Players!");
    }

    function interceptSpectatorClicks() {
        document.addEventListener("click", (event) => {
            console.log(`🖱 Spectator Click at (${event.clientX}, ${event.clientY})`);
            createWaveEffect(event.clientX, event.clientY);
            sendWaveEffect(event.clientX, event.clientY);
        });
    }

    function interceptWebSocket() {
        const OriginalWebSocket = window.WebSocket;

        class InterceptedWebSocket extends OriginalWebSocket {
            constructor(url, protocols) {
                super(url, protocols);
                console.log('[InterceptedWebSocket] Connected to:', url);
                websocket = this;

                this.addEventListener('message', (event) => {
                    if (event.data instanceof ArrayBuffer) {
                        processBinaryData(event.data);
                    } else if (event.data instanceof Blob) {
                        event.data.arrayBuffer().then(buffer => processBinaryData(buffer));
                    }
                });
            }
        }

        function processBinaryData(buffer) {
            let dataArray = new Uint8Array(buffer);
            let opCode = dataArray[0];

            // If we receive a wave effect message, trigger it
            if (opCode === 250) { // Make sure to use the same OpCode as sendWaveEffect()
                let x = (dataArray[1] << 8) | dataArray[2];
                let y = (dataArray[3] << 8) | dataArray[4];
                console.log(`🌊 Received Wave Effect at (${x}, ${y})`);
                createWaveEffect(x, y);
            }
        }

        setTimeout(() => {
            window.WebSocket = InterceptedWebSocket;
            console.log('[InterceptedWebSocket] ✅ WebSocket Override Applied');
        }, 1000);
    }

    setTimeout(() => {
        modifyDeltaCanvas();
        interceptSpectatorClicks();
        interceptWebSocket();
        console.log("[Delta UI Mod] ✅ Wave Effect with Network Sync Injected!");
    }, 1000);

})();
