// Enhanced WebSocket Override and Error Handling for Delta Script

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

// Apply WebSocket Override Dynamically
window.WebSocket = function (url, protocols) {
    if (deltaWebSocketPattern.test(url)) {
        console.log(`Using original WebSocket for Delta connection: ${url}`);
        return new window._OriginalWebSocket(url, protocols);
    }
    console.log('Applying ProxyWebSocket for:', url);
    return new ProxyWebSocket(url, protocols);
};

// Retry Logic to Wait for Delta Initialization
const waitForDeltaInitialization = (maxRetries = 50, interval = 200) => {
    let retries = 0;
    const retry = () => {
        if (typeof _0x51919e !== 'undefined' && _0x51919e._server?.ws) {
            console.log('Delta initialized. Proceeding with WebSocket integration.');
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
waitForDeltaInitialization();

// Fetch Data with Improved Error Handling
const fetchData = async (url) => {
    try {
        const response = await fetch(url, { mode: 'no-cors' }); // Bypass CORS restrictions
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json(); // Validate JSON response
    } catch (error) {
        console.warn(`Error fetching data from ${url}:`, error);
    }
};

// Validate API Links
const validateAPILinks = async () => {
    const apiLinks = [
        'https://deltav4.gitlab.io',
        'https://legendmod.ml',
        'https://pastebin.com',
        'http://127.0.0.1',
    ];

    for (const link of apiLinks) {
        console.log(`Checking API link: ${link}`);
        await fetchData(link);
    }
};
validateAPILinks();
