setTimeout(() => {
    (function () {
        let liveInputText = '';
        let systemEnabled = false;
        let inputListener = null;
        let currentInputElement = null;

        // Control flow flags
        let isRunning = false;
        let pendingUpdate = false;
        let latestMessage = '';

        // 🟢 Smart runner: safely runs one at a time
        function smartRun(inputText) {
            latestMessage = inputText;

            if (isRunning) {
                pendingUpdate = true;
                return;
            }

            isRunning = true;
            run([latestMessage || "🔥 Feed me!"], () => {
                isRunning = false;
                if (pendingUpdate) {
                    pendingUpdate = false;
                    smartRun(latestMessage); // run again with latest input
                }
            });
        }

        // Create and style the toggle button for live mode
        const toggleButton = document.createElement('button');
        toggleButton.textContent = '⚙️ Activate Live Mode';
        Object.assign(toggleButton.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: '9999',
            padding: '10px 15px',
            borderRadius: '8px',
            border: 'none',
            background: '#333',
            color: '#fff',
            cursor: 'pointer',
            boxShadow: '0 0 10px rgba(0,0,0,0.2)'
        });
        document.body.appendChild(toggleButton);

        function enableSystem() {
            console.log("✅ Live system enabled");
            observeAndTrackTyping();
        }

        function disableSystem() {
            console.log("🛑 Live system disabled");
            if (inputListener && currentInputElement) {
                currentInputElement.removeEventListener('keydown', inputListener);
            }
        }

        toggleButton.addEventListener('click', () => {
            systemEnabled = !systemEnabled;
            toggleButton.textContent = systemEnabled ? '🛑 Stop Live Mode' : '⚙️ Activate Live Mode';
            if (systemEnabled) enableSystem();
            else disableSystem();
        });

        // This function attaches a combined Enter key handler to the chat input.
        // It performs your smartRun logic *and* then clears the input and simulates canvas clicks.
        function handleInputBox(inputBox) {
            const input = inputBox.querySelector('input#message');
            if (!input) return;

            currentInputElement = input;

            inputListener = (event) => {
                if (event.key === 'Enter') {
                    // Capture the current input before clearing
                    liveInputText = input.value;
                    console.log("✍️ Enter pressed, live input:", liveInputText);

                    // Run your smart-run logic
                    smartRun(liveInputText);

                    // Perform additional actions (clear input, blur, simulate canvas clicks)
                    if (input.value.trim().length > 0) {
                        event.stopImmediatePropagation();
                        event.preventDefault();

                        // Clear and update input field
                        input.value = '';
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                        input.blur();
                        console.log('⌨️ Enter intercepted, chat cleared, and blurred');

                        const canvas = document.querySelector('canvas.canvas');
                        if (!canvas) {
                            console.warn('❌ Canvas not found!');
                            return;
                        }

                        // Simulate a few rapid clicks on the canvas to force game focus
                        let i = 0;
                        const maxClicks = 3;
                        const clickInterval = setInterval(() => {
                            const clickEvent = new MouseEvent('mousedown', {
                                bubbles: true,
                                cancelable: true,
                                view: window,
                                clientX: 100,
                                clientY: 100
                            });
                            canvas.dispatchEvent(clickEvent);
                            console.log(`🖱️ Simulated canvas click (${i + 1}/${maxClicks})`);
                            i++;
                            if (i >= maxClicks) {
                                clearInterval(clickInterval);
                                console.log('%c🎮 Now PRESS "1" MANUALLY — the game is ready.', 'color: limegreen; font-weight: bold;');
                            }
                        }, 100);
                    }
                }
            };

            input.addEventListener('keydown', inputListener);
            console.log('🎯 Input listener attached for Enter key');
        }

        // Wait for the chat input box to appear and then attach the handler
        function observeAndTrackTyping() {
            const existing = document.querySelector('.message-input-cell.input-box.mr0');
            if (existing) {
                handleInputBox(existing);
                return;
            }

            const observer = new MutationObserver(() => {
                const inputBox = document.querySelector('.message-input-cell.input-box.mr0');
                if (inputBox) {
                    handleInputBox(inputBox);
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
            });

            console.log('👀 Waiting for chat input box to appear...');
        }

        // 🔁 Your original logic (now callback-ready)
        function clickTab(label) {
            const tab = [...document.querySelectorAll('.tab-button')].find(el =>
                el.querySelector('span')?.textContent.trim() === label
            );
            if (tab) {
                tab.click();
                console.log(`✅ Clicked tab: "${label}"`);
            } else {
                console.warn(`❌ Tab not found: "${label}"`);
            }
            return tab;
        }

        function waitForInputs(callback) {
            const check = () => {
                const inputs = document.querySelectorAll('input[name="command"]');
                if (inputs.length > 0) {
                    console.log(`✅ Found ${inputs.length} command inputs`);
                    callback(inputs);
                } else {
                    setTimeout(check, 50);
                }
            };
            check();
        }

        function cloneAndPreserveCommandSection(messages, onDone) {
            waitForInputs((inputs) => {
                messages?.forEach((msg, i) => {
                    if (inputs[i]) {
                        inputs[i].value = msg;
                        inputs[i].dispatchEvent(new Event('input', { bubbles: true }));
                        console.log(`🔁 Set hotkey ${i + 1} → "${msg}"`);
                    }
                });

                const commandSection = document.querySelector('.flex-col.flex-nowrap.self-start');
                if (!commandSection) {
                    console.warn("❌ Command section container not found.");
                    onDone?.();
                    return;
                }

                const clone = commandSection.cloneNode(true);
                Object.assign(clone.style, {
                    position: 'absolute',
                    opacity: '0',
                    pointerEvents: 'none',
                    zIndex: '-999',
                    height: '0',
                    overflow: 'hidden'
                });

                document.body.appendChild(clone);
                console.log("📌 Command section cloned and preserved");

                setTimeout(() => {
                    clickTab("Start");
                    console.log("↩️ Returned to Start tab.");
                    onDone?.();
                }, 100);
            });
        }

        function run(messages, onDone) {
            clickTab("Hotkeys");
            setTimeout(() => {
                clickTab("Commands");
                setTimeout(() => {
                    cloneAndPreserveCommandSection(messages, onDone);
                }, 200);
            }, 200);
        }
    })();
}, 5000);
