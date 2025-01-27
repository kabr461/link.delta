// Extend WebSocket Override with Specific Handling for Delta Script

// Save Original WebSocket
window._OriginalWebSocket = window.WebSocket;

// Override WebSocket with Handling for Delta
class CustomWebSocket {
    constructor(url, protocols) {
        this.originalSocket = new window._OriginalWebSocket(url, protocols);
        this.url = url;
        this.listeners = {};

        // Log connection URL
        console.log('WebSocket connected to:', this.url);

        // Proxy events
        this.originalSocket.addEventListener('open', (event) => {
            console.log('WebSocket opened:', this.url);
            this.dispatchEvent('open', event);
        });

        this.originalSocket.addEventListener('message', (event) => {
            console.log('WebSocket message received:', event.data);
            // Leave space for custom logic here
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

// Extracted WebSocket URL from Delta Script
const deltaWebSocketUrl = (() => {
    try {
        return _0x51919e._server.ws || '';
    } catch (error) {
        console.error('Error extracting WebSocket URL from Delta script:', error);
        return '';
    }
})();

// Selective Override Logic
window.WebSocket = function (url, protocols) {
    if (url === deltaWebSocketUrl) {
        console.log('Excluding WebSocket override for:', url);
        return new window._OriginalWebSocket(url, protocols);
    }
    return new CustomWebSocket(url, protocols);
};

// Fetch API Integration (from delta.user.js)
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

// Integration Example (Links from delta.user.js)
const apiLinks = [
    'https://deltav4.gitlab.io',
    'https://legendmod.ml',
    'https://pastebin.com',
    'http://127.0.0.1',
];

// Leave a placeholder for specific API logic
apiLinks.forEach((link) => {
    console.log('Available API link:', link);
    // Implement your logic here
});

// Placeholder for additional Delta-specific functionalities
// Extend as needed for UI commands, new API integrations, etc.
