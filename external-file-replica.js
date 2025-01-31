
// ===============================
// WebSocket Override and Handler
// ===============================
// WebSocket Connection Setup
let socket;
const WS_URL = 'wss://yourserver.com/socket'; // Replace with actual server

function connectWebSocket() {
    socket = new WebSocket(WS_URL);

    socket.onopen = () => {
        console.log('[WebSocket] Connected to server');

        // Send handshake message (follows your file's format)
        socket.send(JSON.stringify({
            type: 'handshake',
            client: 'spectator-lister'
        }));
    };

    socket.onmessage = function (event) {
        if (event.data instanceof ArrayBuffer) {
            console.warn('[WebSocket] Received binary data, converting...');
            const text = new TextDecoder().decode(event.data);

            try {
                const json = JSON.parse(text); // Convert to JSON
                handleWebSocketMessage(json);
            } catch (error) {
                console.error('[WebSocket] Failed to parse JSON:', text);
            }
        } else {
            try {
                const json = JSON.parse(event.data);
                handleWebSocketMessage(json);
            } catch (error) {
                console.error('[WebSocket] Invalid JSON:', event.data);
            }
        }
    };

    socket.onerror = (error) => {
        console.error('[WebSocket] Error:', error);
    };

    socket.onclose = (event) => {
        console.warn('[WebSocket] Connection closed:', event.reason);
        setTimeout(() => {
            console.log('[WebSocket] Reconnecting...');
            connectWebSocket();
        }, 3000);
    };
}

// Function to Handle Incoming Messages (Follows Your Format)
function handleWebSocketMessage(message) {
    if (message.type === 'spectator_count') {
        updateSpectatorList(message.data);
    } else if (message.type === 'chat') {
        displayChatMessage(message.data);
    } else if (message.type === 'wave') {
        showWaveEffect(message.data);
    } else {
        console.warn('[WebSocket] Unknown message type:', message);
    }
}

// Function to Send Data (Ensures WebSocket is Open)
function sendWebSocketMessage(type, data) {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type, data }));
    } else {
        console.warn('[WebSocket] Not connected, message not sent:', type, data);
    }
}

// Ensuring UI Elements Exist Before Adding Event Listeners
function setupUIListeners() {
    document.addEventListener('DOMContentLoaded', () => {
        const waveButton = document.getElementById('wave-button');

        if (!waveButton) {
            console.error('[WavingFeature] Button not found!');
            return;
        }

        waveButton.addEventListener('click', (event) => {
            const position = { x: event.clientX, y: event.clientY };
            sendWebSocketMessage('wave', position);
        });
    });
}

// Initialize Everything
connectWebSocket();
setupUIListeners();

// ===============================
// Spectator List Management
// ===============================
class SpectatorList {
    constructor(containerId, countId) {
        this.container = document.getElementById(containerId);
        this.countContainer = document.getElementById(countId);
        this.spectators = [];
    }

    addSpectator(id, nick, skinUrl) {
        if (!this.spectators.some(s => s.id === id)) {
            this.spectators.push({ id, nick, skinUrl, waveCount: 0 });
            this.render();
            WebSocketHandler.sendSpectatorUpdate(this.spectators.length);
        }
    }

    removeSpectator(id) {
        this.spectators = this.spectators.filter(s => s.id !== id);
        this.render();
        WebSocketHandler.sendSpectatorUpdate(this.spectators.length);
    }

    render() {
        this.container.innerHTML = "";
        this.spectators.forEach(s => {
            const div = document.createElement("div");
            div.innerHTML = `<strong>${s.nick}</strong> - Waves: ${s.waveCount}`;
            div.onclick = () => this.wave(s.id);
            this.container.appendChild(div);
        });
        this.updateSpectatorCount(this.spectators.length);
    }

    wave(id) {
        const spectator = this.spectators.find(s => s.id === id);
        if (spectator) {
            spectator.waveCount++;
            this.render();
        }
    }

    static updateSpectatorCount(count) {
        document.getElementById("spectator-count").innerText = `Spectators: ${count}`;
    }
}

const spectatorList = new SpectatorList("spectator-container", "spectator-count");

// ===============================
// Waving Feature (Visual Waves)
// ===============================
class WavingFeature {
    static init(mapElement) {
        mapElement.addEventListener("click", (event) => {
            WavingFeature.showWave(event.clientX, event.clientY);
            WebSocketHandler.sendWave(event.clientX, event.clientY);
        });
    }

    static showWave(x, y) {
        const wave = document.createElement("div");
        wave.className = "wave-effect";
        wave.style.left = `${x}px`;
        wave.style.top = `${y}px`;
        document.body.appendChild(wave);

        setTimeout(() => wave.remove(), 1000);
    }
}

const gameMap = document.getElementById("game-map");
WavingFeature.init(gameMap);

// ===============================
// CMD Chat Interception & Custom Responses
// ===============================
class ChatHandler {
    static commandResponses = {
        "hi": "Hello, how are you?",
        "help": "Available commands: !wave, !tag, !list",
        "spectators": () => `Spectator count: ${spectatorList.spectators.length}`
    };

    static processIncomingMessage(message) {
        const response = ChatHandler.commandResponses[message.toLowerCase()];
        if (response) {
            WebSocketHandler.sendChat(typeof response === "function" ? response() : response);
        }
    }
}

document.getElementById("chat-send").addEventListener("click", () => {
    const msg = document.getElementById("chat-input").value;
    ChatHandler.processIncomingMessage(msg);
});

// ===============================
// Spectator Mode Enhancements
// ===============================
class SpectatorMode {
    static enableSpectator(player) {
        player.nick = "Spectator";
        console.log(`[Spectator Mode] ${player.nick} is now spectating.`);
    }

    static renamePlayer(player, newNick) {
        player.nick = newNick;
        console.log(`[Rename] Player renamed to ${newNick}`);
    }
}

const player = { nick: "Player1" };
SpectatorMode.enableSpectator(player);
SpectatorMode.renamePlayer(player, "Observer");

// ===============================
// Tags Feature
// ===============================
class TagFeature {
    static assignTag(player, tag) {
        player.tag = `#${tag}`;
        console.log(`[Tag] Assigned tag ${player.tag} to ${player.nick}`);
    }
}

TagFeature.assignTag(player, "EliteSpectator");
