// Enhanced WebSocket Override with Dynamic Detection of Delta Script Variables

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
            console.log('WebSocket message received:', event.data);
            // Optionally modify message here
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
        console.log('Sending data through WebSocket:', data);
        // Optionally modify data before sending
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

// Function to Apply WebSocket Override Once Delta Variables are Available
const applyWebSocketOverride = () => {
    if (typeof _0x51919e !== 'undefined' && _0x51919e._server && _0x51919e._server.ws) {
        const deltaWebSocketUrl = _0x51919e._server.ws;
        console.log('Extracted WebSocket URL:', deltaWebSocketUrl);

        // Override WebSocket selectively
        window.WebSocket = function (url, protocols) {
            if (url === deltaWebSocketUrl) {
                console.log('Using original WebSocket for Delta:', url);
                return new window._OriginalWebSocket(url, protocols);
            }
            console.log('Using ProxyWebSocket for:', url);
            return new ProxyWebSocket(url, protocols);
        };
    } else {
        console.log('Waiting for _0x51919e to be defined...');
        setTimeout(applyWebSocketOverride, 100); // Retry after 100ms
    }
};

// Start checking for Delta variables
applyWebSocketOverride();

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
