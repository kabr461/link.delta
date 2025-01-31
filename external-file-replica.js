
// ===============================
// WebSocket Override and Handler
// ===============================
class CustomWebSocket extends WebSocket {
    constructor(url, protocols) {
        super(url, protocols);
        console.log(`[CustomWebSocket] Connected to: ${url}`);

        this.addEventListener('open', () => console.log('[WebSocket] Connection opened'));
        this.addEventListener('message', (event) => WebSocketHandler.handleMessage(event));
        this.addEventListener('error', (error) => console.error('[WebSocket] Error:', error));
        this.addEventListener('close', (event) => console.warn('[WebSocket] Connection closed:', event));
    }

    send(data) {
        console.log('[WebSocket] Sending:', data);
        super.send(data);
    }

    close(code, reason) {
        console.log('[WebSocket] Closing connection:', code, reason);
        super.close(code, reason);
    }
}

class WebSocketHandler {
    static sendWave(x, y) {
        const waveData = JSON.stringify({ type: "wave", x, y });
        window.currentWebSocket.send(waveData);
    }

    static sendSpectatorUpdate(spectatorList) {
        const updateData = JSON.stringify({ type: "spectators", spectators: spectatorList });
        window.currentWebSocket.send(updateData);
    }

    static sendChat(message) {
        const chatData = JSON.stringify({ type: "chat", message });
        window.currentWebSocket.send(chatData);
    }

    static handleMessage(event) {
        const data = JSON.parse(event.data);
        if (data.type === "wave") {
            WavingFeature.showWave(data.x, data.y);
        } else if (data.type === "chat") {
            console.log(`[Chat] Received: ${data.message}`);
        } else if (data.type === "spectators") {
            SpectatorList.updateSpectatorCount(data.spectators);
        }
    }
}

// Attach WebSocket event listener
window.WebSocket = CustomWebSocket;
window.currentWebSocket = new CustomWebSocket("wss://yourserver.com/socket");
window.currentWebSocket.addEventListener("message", WebSocketHandler.handleMessage);

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
