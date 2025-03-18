const originalXor = Function.prototype.call;
Function.prototype.call = function(...args) {
    if (typeof args[1] === "number") {
        console.log("XOR Detected:", args);
    }
    return originalXor.apply(this, args);
};
