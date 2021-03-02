exports.password = () => {
    let length = 12,
        charset = "ySlrLjpZ6FPV7AXGvWNOdtubsYDBQ2z5w3iUCRTxK9EeMhmk8n4gofIH0Jqca1",
        retVal = "",
        i = 0,
        char_length = charset.length;
    for (i; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * char_length));
    }
    console.log(retVal)
    return retVal;
}

exports.secretKey = () => {
    let charset = "ySlrLjpZ)6FPV7A-XGv.~WNOdtub*sY+DBQ2z%5w[3iU(C^RT}xK,9EeMhmk8#n4g|{ofI]H0Jqca1",
        secret_key = "",
        i = 0,
        char_length = charset.length;
    for (i; i < 64; i++) {
        secret_key += charset.charAt(Math.floor(Math.random() * char_length));
    }
    return secret_key;
}

exports.generateID = (size) => {
    let charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let id = "";
    for (let i = 0; i < size; i++) {
        id += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return id;
}

exports.simple = (size, type) => {
    let charset = "";
    if (type == "low")
        charset = "abcdefghijklmnopqrstuvwxyz0123456789";
    else if (type == "up")
        charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    else
        charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let id = "";
    for (let i = 0; i < size; i++) {
        id += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return id;

}