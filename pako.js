const pakoScript = document.createElement('script');
pakoScript.src = "https://cdn.jsdelivr.net/npm/pako@2.0.2/dist/pako.min.js";
pakoScript.onload = () => console.log("pako loaded");
document.head.appendChild(pakoScript);
