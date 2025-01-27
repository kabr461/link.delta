// Enhanced WebSocket Override with Timeout and Error Handling for Delta Script

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
const waitForDeltaInitialization = (maxRetries = 50, interval = 200) => {
    let retries = 0;
    const retry = () => {
        if (typeof _0x51919e !== 'undefined' && _0x51919e._server && _0x51919e._server.ws) {
            console.log('Delta initialized. Proceeding with WebSocket integration.');
            applyWebSocketOverride();
        } else if (retries < maxRetries) {
            console.log(`Waiting for Delta initialization... Attempt ${retries + 1}/${maxRetries}`);
            retries++;
            setTimeout(retry, interval);
        } else {
            console.error('Delta initialization failed after maximum retries.');
        }
    };
    retry();
};

// Start Checking for Delta Variables
waitForDeltaInitialization();

// Handle Missing API Endpoint
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
        console.error(`Error fetching data from ${url}:`, error);
    }
};

// Adjust API Endpoint Replacement
const apiLinks = [
    'https://deltav4.gitlab.io',
    'https://legendmod.ml',
    'https://pastebin.com',
    'http://127.0.0.1',
];

// Check API Availability
apiLinks.forEach((link) => {
    console.log('Checking API link:', link);
    fetchData(link).catch(() => {
        console.warn('Failed to fetch data from:', link);
    });
});
