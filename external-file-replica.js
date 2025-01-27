// Enhanced WebSocket and Fetch Handling for Delta Script

// Save Original WebSocket
window._OriginalWebSocket = window.WebSocket;

// Proxy for WebSocket with Enhanced Debugging
class DebugWebSocket extends WebSocket {
    constructor(url, protocols) {
        super(url, protocols);
        console.log(`WebSocket created for: ${url}`);

        this.addEventListener('open', () => {
            console.log('WebSocket opened:', url);
        });

        this.addEventListener('message', (event) => {
            console.log('WebSocket message received:', event.data);
        });

        this.addEventListener('close', (event) => {
            console.warn('WebSocket closed:', event);
        });

        this.addEventListener('error', (error) => {
            console.error('WebSocket error:', error);
        });
    }

    send(data) {
        console.log('WebSocket sending data:', data);
        super.send(data);
    }
}

// Apply WebSocket Override
window.WebSocket = function (url, protocols) {
    if (/delta7|chat\.delt\.io/.test(url)) {
        console.log(`Using original WebSocket for Delta connection: ${url}`);
        return new window._OriginalWebSocket(url, protocols);
    }
    return new DebugWebSocket(url, protocols);
};

// Wait for Delta Readiness Dynamically
const waitForDeltaReadiness = (maxRetries = 50, interval = 200) => {
    let retries = 0;
    const checkReadiness = () => {
        if (document.querySelector('[data-delta-ready]') || typeof window.SomeDeltaVariable !== 'undefined') {
            console.log('Delta ready. Proceeding.');
        } else if (retries < maxRetries) {
            console.log(`Waiting for Delta readiness... Attempt ${retries + 1}/${maxRetries}`);
            retries++;
            setTimeout(checkReadiness, interval);
        } else {
            console.error('Delta readiness check failed after maximum retries.');
        }
    };
    checkReadiness();
};
waitForDeltaReadiness();

// Fetch Override for Enhanced Handling
const originalFetch = window.fetch;
window.fetch = async (input, init = {}) => {
    console.log('Fetching URL:', input);

    // Force no-cors mode for certain URLs
    if (typeof input === 'string' && /pastebin|legendmod|127\.0\.0\.1/.test(input)) {
        init.mode = 'no-cors';
        console.log('Forcing no-cors mode for:', input);
    }

    try {
        const response = await originalFetch(input, init);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log('Fetch successful:', input);
        return response;
    } catch (error) {
        console.error(`Error during fetch for ${input}:`, error);
        throw error;
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
        try {
            const response = await fetch(link);
            console.log(`API link working: ${link}`, response);
        } catch (error) {
            console.warn(`Failed to fetch API link: ${link}`, error);
        }
    }
};
validateAPILinks();
