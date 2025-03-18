const originalEncrypt = CryptoJS.AES.encrypt;
CryptoJS.AES.encrypt = function(data, key) {
    console.log("Raw Data Before Encryption:", data.toString());
    return originalEncrypt(data, key);
};
