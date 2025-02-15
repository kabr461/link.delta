(function() {
    'use strict';

    // Utility function: checks if an object appears to be a player list
    // by verifying if the first element has common keys like "name", "tag", "skin", etc.
    function isPlayerList(obj) {
        if (Array.isArray(obj) && obj.length > 0 && typeof obj[0] === 'object') {
            const candidateKeys = ['name', 'tag', 'skin', 'mass', 'id'];
            let score = candidateKeys.reduce((acc, key) => acc + (obj[0][key] ? 1 : 0), 0);
            return score >= 2; // At least two keys must exist to consider it a player list
        }
        return false;
    }

    // Function to hook a candidate function by name from the global window object.
    // When the function is called, we check if its first argument appears to be a player list.
    function hookFunction(fnName) {
        const originalFn = window[fnName];
        if (originalFn && typeof originalFn === 'function') {
            window[fnName] = function(...args) {
                // If the first argument looks like a player list, log it.
                if (args.length > 0 && isPlayerList(args[0])) {
                    console.log(`[Hook] ${fnName} called with player list:`, args[0]);
                }
                return originalFn.apply(this, args);
            };
            console.log(`[Hook] Function "${fnName}" has been hooked.`);
        } else {
            console.warn(`[Hook] Function "${fnName}" not found on window.`);
        }
    }

    // Array of candidate function names that may update or manage player data.
    const candidateFunctions = [
        'updateLeaderboard',
        'refreshLeaderboard',
        'setPlayers',
        'updatePlayers',
        'processPlayerData'
    ];

    // Function to hook candidate functions once the game has loaded.
    function hookWhenReady() {
        candidateFunctions.forEach(fnName => hookFunction(fnName));
    }

    // Delay hooking by 3000ms to allow the game (and Delta extension) to load.
    setTimeout(hookWhenReady, 3000);

    // Optional: Function to search for global functions that contain a specific keyword.
    // This helps in finding potential functions related to player data if you don't know their names.
    function searchGlobalFunctions(keyword) {
        for (let key in window) {
            if (typeof window[key] === 'function' && key.toLowerCase().includes(keyword)) {
                console.log(`Candidate global function: ${key}`);
            }
        }
    }

    // Log candidate functions containing "leader" and "player" for further investigation.
    console.log("Searching for candidate functions containing 'leader':");
    searchGlobalFunctions('leader');
    console.log("Searching for candidate functions containing 'player':");
    searchGlobalFunctions('player');

})();
