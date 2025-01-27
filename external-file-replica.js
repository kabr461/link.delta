// Enhanced WebSocket Override with Compatibility for Delta Script

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

// Selective WebSocket Override Based on URL
window.WebSocket = function (url, protocols) {
    // Use heuristic to detect Delta WebSocket URLs
    const deltaPattern = /(delta7\?protocol=v1|54-199-166-198)/;
    if (deltaPattern.test(url)) {
        console.log('Using original WebSocket for:', url);
        return new window._OriginalWebSocket(url, protocols);
    }
    console.log('Applying ProxyWebSocket for:', url);
    return new ProxyWebSocket(url, protocols);
};

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
