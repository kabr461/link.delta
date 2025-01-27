// Enhanced WebSocket Override with Full Compatibility for Delta Script

// Save Original WebSocket
window._OriginalWebSocket = window.WebSocket;

// Proxy for WebSocket with Delta Compatibility
class ProxyWebSocket {
    constructor(url, protocols) {
        this.originalSocket = new window._OriginalWebSocket(url, protocols);
        this.url = url;

        // Preserve native event listeners
        this.eventHandlers = {
            open: [],
            message: [],
            close: [],
            error: []
        };

        // Bind original socket events
        this.originalSocket.addEventListener('open', (event) => {
            console.log('WebSocket opened:', this.url);
            this.dispatchEvent('open', event);
        });

        this.originalSocket.addEventListener('message', (event) => {
            console.log('WebSocket message received (unmodified):', event.data);
            this.dispatchEvent('message', event);
        });

        this.originalSocket.addEventListener('close', (event) => {
            console.log('WebSocket closed:', this.url);
            this.dispatchEvent('close', event);
        });

        this.originalSocket.addEventListener('error', (event) => {
            console.error('WebSocket error:', event);
            this.dispatchEvent('error', event);
        });
    }

    send(data) {
        console.log('Sending data (unmodified) through WebSocket:', data);
        this.originalSocket.send(data);
    }

    close() {
        console.log('Closing WebSocket connection for:', this.url);
        this.originalSocket.close();
    }

    addEventListener(type, callback) {
        if (this.eventHandlers[type]) {
            this.eventHandlers[type].push(callback);
        }
    }

    removeEventListener(type, callback) {
        if (this.eventHandlers[type]) {
            this.eventHandlers[type] = this.eventHandlers[type].filter((cb) => cb !== callback);
        }
    }

    dispatchEvent(type, event) {
        if (this.eventHandlers[type]) {
            this.eventHandlers[type].forEach((callback) => callback(event));
        }
    }
}

// Delta WebSocket URL Patterns
const deltaWebSocketPattern = /wss:\/\/(chat\.delt\.io|web-arenas-live).*?/;

// Function to Apply WebSocket Override Once Delta Variables are Available
const applyWebSocketOverride = () => {
    window.WebSocket = function (url, protocols) {
        if (deltaWebSocketPattern.test(url)) {
            console.log('Bypassing ProxyWebSocket for Delta connection:', url);
            return new window._OriginalWebSocket(url, protocols);
        }
        console.log('Applying ProxyWebSocket for:', url);
        return new ProxyWebSocket(url, protocols);
    };
};

// Retry Logic to Wait for Delta Initialization
const waitForDeltaInitialization = () => {
    if (typeof _0x51919e !== 'undefined' && _0x51919e._server && _0x51919e._server.ws) {
        console.log('Delta initialized. Proceeding with WebSocket integration.');
        applyWebSocketOverride();
    } else {
        console.log('Waiting for Delta initialization...');
        setTimeout(waitForDeltaInitialization, 100);
    }
};

// Start Checking for Delta Variables
waitForDeltaInitialization();

// Placeholder for API Integration (Delta Script Context)
const fetchData = async (url, options = {}) => {
    console.log('Fetching data from:', url);
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched data:', data);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

// Integration Example (Links from Delta Script)
const apiLinks = [
    'https://deltav4.gitlab.io',
    'https://legendmod.ml',
    'https://pastebin.com',
    'http://127.0.0.1',
];

apiLinks.forEach((link) => {
    console.log('Available API link:', link);
    // Implement specific logic here
});
