// Reconstructed JavaScript and CSS for Agario Integration with Overridden WebSocket

// Override Native WebSocket
class CustomWebSocket {
    constructor(url, protocols) {
        this.originalSocket = new window._OriginalWebSocket(url, protocols);
        this.url = url;

        // Listeners map
        this.listeners = {};

        // Proxy events
        this.originalSocket.addEventListener('open', (event) => {
            console.log('WebSocket opened:', this.url);
            this.dispatchEvent('open', event);
        });

        this.originalSocket.addEventListener('message', (event) => {
            console.log('WebSocket message received:', event.data);
            this.dispatchEvent('message', event);
        });

        this.originalSocket.addEventListener('close', (event) => {
            console.log('WebSocket closed:', event);
            this.dispatchEvent('close', event);
        });

        this.originalSocket.addEventListener('error', (event) => {
            console.error('WebSocket error:', event);
            this.dispatchEvent('error', event);
        });
    }

    send(data) {
        console.log('Sending data via WebSocket:', data);
        this.originalSocket.send(data);
    }

    close() {
        console.log('Closing WebSocket connection.');
        this.originalSocket.close();
    }

    addEventListener(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    removeEventListener(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
        }
    }

    dispatchEvent(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach((callback) => callback(data));
        }
    }
}

// Save Original WebSocket
window._OriginalWebSocket = window.WebSocket;
window.WebSocket = CustomWebSocket;

// JavaScript: Core functionality
const initHUD = () => {
    console.log('Initializing HUD...');
    
    const hudElement = document.createElement('div');
    hudElement.id = 'six-tomoe-hud';
    hudElement.classList.add('six-tomoe-huds-left');
    
    hudElement.innerHTML = `
        <div class="progress-popup">Loading...</div>
        <div class="six-tomoe-menu">
            <div class="header">
                <div class="title">Menu Title</div>
                <div class="icon-info">Info</div>
            </div>
            <div class="entries">Menu Entries</div>
        </div>
    `;
    
    document.body.appendChild(hudElement);
};

// Event listeners (Placeholder functionality)
const setupEventListeners = () => {
    console.log('Setting up event listeners...');

    // Example: Button click handler
    document.querySelectorAll('.wave-btn').forEach(button => {
        button.addEventListener('click', () => {
            console.log('Wave button clicked!');
        });
    });
};

// Initialization function
const initialize = () => {
    console.log('Initializing script...');
    initHUD();
    setupEventListeners();
};

// Run the script
initialize();

// CSS Styles
const cssStyles = `
.six-tomoe-huds-left {
    position: absolute;
    left: 0;
    top: 50%;
    opacity: var(--hudTransparency, 0.8);
    user-select: none;
    transform: translateY(-50%);
    font-size: 100%;
}

.progress-popup {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 10%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;
    padding: 1em;
    color: var(--hudTextColor, #fff);
    border-radius: 1em;
    background-color: rgba(0, 0, 0, 0.85);
}

.six-tomoe-menu {
    width: 12.5em;
    margin: 0.3em;
    font-size: 100%;
    white-space: nowrap;
    padding: 0.1em 0.4em;
    background-color: var(--hudColor, #333);
    color: var(--hudTextColor, #fff);
    border-radius: 0.3em;
    backdrop-filter: blur(var(--hudBlur, 5px));
    overflow: hidden;
    position: relative;
}

.six-tomoe-menu .entries {
    height: 30vh;
    overflow-y: auto;
    padding: 5px 0;
    margin-bottom: 5px;
    border: 1px solid #fff;
}

.six-tomoe-menu .entries .skin {
    background-size: 100%;
    border-radius: 50%;
    border: 1px solid #fff;
    display: block;
    margin: 2px;
    width: 30px;
    height: 30px;
}

.six-tomoe-menu .entries .wave-btn {
    color: var(--top5MassColor, #ca56bd);
    text-align: center;
    display: inline-block;
}
`;

// Inject CSS into the document
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = cssStyles;
document.head.appendChild(styleSheet);
