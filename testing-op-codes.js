console.log("[Delta UI Mod] Injecting Full Dynamic OpCode Detection...");

(function () {
    'use strict';

    let waveEffects = [];
    let websocket = null;
    let opcodeRegistry = {};  // Stores all dynamically detected OpCodes
    let detectedSpectatorClickOpCode = null;
    let lastClickTime = 0;  // Timestamp for detecting click-based messages
    let clickOpCodes = new Set();  // Stores potential OpCodes for clicks

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

            wave.radius += 2;
            wave.alpha -= 0.05;

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
            console.warn("⚠ WebSocket not connected! Cannot send wave effect.");
            return;
        }

        if (!detectedSpectatorClickOpCode) {
            console.warn("⚠ No confirmed OpCode for spectator clicks! Cannot send wave.");
            return;
        }

        let buffer = new ArrayBuffer(5);
        let view = new DataView(buffer);
        view.setUint8(0, detectedSpectatorClickOpCode);  // Use dynamically detected OpCode
        view.setUint16(1, x, true);
        view.setUint16(3, y, true);

        websocket.send(buffer);
        console.log(`🌊 Sent Wave Effect using OpCode ${detectedSpectatorClickOpCode}`);
    }

    function interceptUserClicks() {
        document.addEventListener("click", (event) => {
            console.log(`🖱 Click Detected at (${event.clientX}, ${event.clientY})`);
            lastClickTime = Date.now(); // Store timestamp of click
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
                        processBinaryData(event.data, false);
                    } else if (event.data instanceof Blob) {
                        event.data.arrayBuffer().then(buffer => processBinaryData(buffer, false));
                    }
                });
            }

            send(data) {
                const opCode = new Uint8Array(data)[0];  // First byte is OpCode
                const messageSize = data.byteLength;
                const currentTime = Date.now();

                if (!opcodeRegistry[opCode]) {
                    opcodeRegistry[opCode] = { count: 0, messages: [], functionType: "Unknown" };
                }

                opcodeRegistry[opCode].count += 1;
                opcodeRegistry[opCode].messages.push(Array.from(new Uint8Array(data)));

                if (currentTime - lastClickTime < 300) {
                    // If the message is sent within 300ms of clicking, it's a click-related OpCode
                    clickOpCodes.add(opCode);
                    console.log(`🔍 Detected Click OpCode: ${opCode}`);
                    detectedSpectatorClickOpCode = opCode;
                }

                if (messageSize >= 6 && !clickOpCodes.has(opCode)) {
                    // Attempt to classify the OpCode
                    if (messageSize > 10) {
                        opcodeRegistry[opCode].functionType = "Movement / Interaction";
                    } else if (messageSize === 2) {
                        opcodeRegistry[opCode].functionType = "Ping / Network Sync";
                    }
                }

                super.send(data);
            }
        }

        function processBinaryData(buffer, incoming = true) {
            let dataArray = new Uint8Array(buffer);
            let opCode = dataArray[0];

            if (!opcodeRegistry[opCode]) {
                opcodeRegistry[opCode] = { count: 0, messages: [], functionType: "Unknown" };
            }

            opcodeRegistry[opCode].count += 1;
            opcodeRegistry[opCode].messages.push(Array.from(dataArray));

            if (clickOpCodes.has(opCode)) {
                let x = (dataArray[1] << 8) | dataArray[2];
                let y = (dataArray[3] << 8) | dataArray[4];
                console.log(`🌊 Received Wave Effect at (${x}, ${y})`);
                createWaveEffect(x, y);
            }

            if (incoming) {
                console.log(`📩 Received OpCode: ${opCode} | Size: ${dataArray.length}`);
            } else {
                console.log(`📤 Sent OpCode: ${opCode} | Size: ${dataArray.length}`);
            }
        }

        setTimeout(() => {
            window.WebSocket = InterceptedWebSocket;
            console.log('[InterceptedWebSocket] ✅ WebSocket Override Applied');
        }, 1000);
    }

    setTimeout(() => {
        modifyDeltaCanvas();
        interceptUserClicks();
        interceptWebSocket();
        console.log("[Delta UI Mod] ✅ Full Dynamic OpCode Detection & Wave Effect Injected!");
    }, 1000);

    window.analyzeOpcodes = function () {
        console.log("[InterceptedWebSocket] Opcode Registry Analysis:");
        console.table(opcodeRegistry);
    };

})();
