// ==UserScript==
// @name         Delta Team Help & Cool Animation Broadcast Mod for Agar.io (Firebase)
// @namespace    http://your-namespace-here.com
// @version      1.1
// @description  Relaxes local restrictions and adds a team-shared cool particle explosion animation plus help request feature via Firebase so all teammates see when someone clicks or needs help. (Experimental & insecure!)
// @match        *://agar.io/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    
    /***************************************************************
     * 1. Remove & Override Content Security Policies (CSP)
     ***************************************************************/
    const removeCSPMetaTags = () => {
        document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]').forEach(tag => {
            tag.parentNode.removeChild(tag);
        });
    };
    // Immediately remove existing CSP tags.
    removeCSPMetaTags();
    // Observe any new CSP tags and remove them.
    const cspObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.tagName === 'META' && node.getAttribute('http-equiv') === 'Content-Security-Policy') {
                    node.parentNode.removeChild(node);
                }
            });
        });
    });
    cspObserver.observe(document.documentElement, { childList: true, subtree: true });
    // Insert an extremely permissive CSP meta tag when <head> is available.
    const insertPermissiveCSP = () => {
        if (document.head) {
            removeCSPMetaTags();
            const meta = document.createElement('meta');
            meta.httpEquiv = 'Content-Security-Policy';
            meta.content = "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; " +
                           "script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; " +
                           "style-src * 'unsafe-inline' data: blob:; " +
                           "img-src * data: blob:; " +
                           "connect-src *; " +
                           "manifest-src *; " +
                           "worker-src * blob:; " +
                           "frame-src *;";
            document.head.prepend(meta);
            console.log("CSP set to extremely permissive mode.");
        } else {
            setTimeout(insertPermissiveCSP, 10);
        }
    };
    insertPermissiveCSP();
    
    /***************************************************************
     * 2. Patch Worker Creation and System.import Polyfill
     ***************************************************************/
    (function() {
        const OriginalWorker = window.Worker;
        window.Worker = function(script, options) {
            if (typeof script === 'string' && script.startsWith('data:')) {
                try {
                    const commaIndex = script.indexOf(',');
                    const blobContent = decodeURIComponent(script.substring(commaIndex + 1));
                    const blob = new Blob([blobContent], { type: 'application/javascript' });
                    const blobUrl = URL.createObjectURL(blob);
                    return new OriginalWorker(blobUrl, options);
                } catch (e) {
                    console.error("Worker patch error:", e);
                }
            }
            return new OriginalWorker(script, options);
        };
    })();
    if (!window.System) {
        window.System = { import: src => import(src) };
    }
    
    /***************************************************************
     * 3. Load Firebase SDK (v8) Dynamically and Initialize
     ***************************************************************/
    function loadScript(src, onload) {
        const script = document.createElement('script');
        script.src = src;
        script.onload = onload;
        document.head.appendChild(script);
    }
    loadScript("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js", () => {
        loadScript("https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js", initializeFirebase);
    });
    
    // Replace the placeholders below with your Firebase project configuration.
    const firebaseConfig = {
    apiKey: "AIzaSyDtlJnDcRiqO8uhofXqePLOhUTf2dWpEDI",
    authDomain: "agario-bb5ea.firebaseapp.com",
    databaseURL: "https://agario-bb5ea-default-rtdb.firebaseio.com",
    projectId: "agario-bb5ea",
    storageBucket: "agario-bb5ea.firebasestorage.app",
    messagingSenderId: "306389211380",
    appId: "1:306389211380:web:3c1eb559078b05734be6a1",
    measurementId: "G-5NTSETJHM9"
  };
    
    function initializeFirebase() {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        console.log("Firebase initialized.");
        listenForTeamMessages();
    }
    
    /***************************************************************
     * 4. Firebase Realtime Database Integration for Team Broadcast
     ***************************************************************/
    let teamMessagesRef = null;
    function listenForTeamMessages() {
        teamMessagesRef = firebase.database().ref('team_messages');
        teamMessagesRef.on('child_added', snapshot => {
            const data = snapshot.val();
            // Handle cool animation messages.
            if (data.type === 'cool') {
                console.log("Received cool animation broadcast from teammate:", data);
                if (window.coolWaveRenderer && typeof data.x === 'number' && typeof data.y === 'number') {
                    window.coolWaveRenderer.createParticles(data.x, data.y);
                }
            }
            // Handle help messages.
            else if (data.type === 'help') {
                console.log("Received help request:", data.message);
                showHelpMessage(data.message || "A team member is asking for help!");
            }
        });
    }
    function broadcastTeamMessage(messageObj) {
        if (teamMessagesRef) {
            teamMessagesRef.push(messageObj);
        }
    }
    
    /***************************************************************
     * 5. Set Up the Cool Particle Animation Effect with Broadcast & Logging
     ***************************************************************/
    // Configuration for the particle explosion effect.
    const CONFIG = {
        PARTICLE: {
            PARTICLE_COUNT: 30,    // Number of particles per explosion.
            SPEED_MIN: 1,          // Minimum speed.
            SPEED_MAX: 4,          // Maximum speed.
            SIZE_MIN: 2,           // Minimum particle size.
            SIZE_MAX: 5,           // Maximum particle size.
            FADE: 0.02             // Fade rate per frame.
        }
    };
    
    class CoolWaveRenderer {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.particles = [];
            this.init();
        }
    
        init() {
            // On canvas click: trigger a cool animation and broadcast its coordinates.
            this.canvas.addEventListener('click', e => {
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                console.log("Local cool animation triggered at:", {x, y});
                this.createParticles(x, y);
                broadcastTeamMessage({ type: 'cool', x, y });
            });
            this.startAnimation();
        }
    
        createParticles(x, y) {
            for (let i = 0; i < CONFIG.PARTICLE.PARTICLE_COUNT; i++) {
                const angle = Math.random() * 2 * Math.PI;
                const speed = Math.random() * (CONFIG.PARTICLE.SPEED_MAX - CONFIG.PARTICLE.SPEED_MIN) + CONFIG.PARTICLE.SPEED_MIN;
                const dx = Math.cos(angle) * speed;
                const dy = Math.sin(angle) * speed;
                const size = Math.random() * (CONFIG.PARTICLE.SIZE_MAX - CONFIG.PARTICLE.SIZE_MIN) + CONFIG.PARTICLE.SIZE_MIN;
                this.particles.push({
                    x: x,
                    y: y,
                    dx: dx,
                    dy: dy,
                    size: size,
                    alpha: 1
                });
            }
        }
    
        renderParticles() {
            this.particles = this.particles.filter(particle => {
                // Update particle position.
                particle.x += particle.dx;
                particle.y += particle.dy;
                // Fade out.
                particle.alpha -= CONFIG.PARTICLE.FADE;
                if (particle.alpha <= 0) return false;
                // Draw particle with a radial gradient for a cool effect.
                const gradient = this.ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size);
                gradient.addColorStop(0, `rgba(255, 255, 255, ${particle.alpha})`);
                gradient.addColorStop(1, `rgba(100, 200, 255, 0)`);
                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI);
                this.ctx.fill();
                return true;
            });
        }
    
        startAnimation() {
            const animate = () => {
                // Note: We do not clear the canvas entirely as the game may be drawing beneath.
                // Our effect is drawn on top.
                this.renderParticles();
                requestAnimationFrame(animate);
            };
            animate();
        }
    }
    
    /***************************************************************
     * 6. Team Help Broadcast Functionality
     ***************************************************************/
    const createHelpOverlay = () => {
        const overlay = document.createElement('div');
        overlay.id = 'help-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '10px';
        overlay.style.right = '10px';
        overlay.style.padding = '10px';
        overlay.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
        overlay.style.color = 'white';
        overlay.style.fontSize = '20px';
        overlay.style.zIndex = '9999';
        overlay.style.display = 'none';
        document.body.appendChild(overlay);
        return overlay;
    };
    const helpOverlay = createHelpOverlay();
    const showHelpMessage = (msg) => {
        helpOverlay.innerText = msg;
        helpOverlay.style.display = 'block';
        setTimeout(() => {
            helpOverlay.style.display = 'none';
        }, 5000);
    };
    const broadcastHelp = (message) => {
        broadcastTeamMessage({ type: 'help', message: message });
    };
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'h') {
            broadcastHelp("Help needed from a team member!");
            showHelpMessage("You requested help!");
            console.log("Help broadcast sent.");
        }
    });
    
    /***************************************************************
     * 7. Attach the Cool Animation Effect to the Game Canvas
     ***************************************************************/
    const attachCoolAnimationEffect = () => {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            window.coolWaveRenderer = new CoolWaveRenderer(canvas);
            console.log("Cool animation effect activated on canvas.");
        } else {
            setTimeout(attachCoolAnimationEffect, 100);
        }
    };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attachCoolAnimationEffect);
    } else {
        attachCoolAnimationEffect();
    }
    
    console.log("Delta script modifications, team cool animation effect, help broadcast, and Firebase integration setup attempted.");
})();
