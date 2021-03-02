const bcrypt = require("bcryptjs");
const BCRYPT_CONFIG = {
    saltRounds: 5
};

exports.encrypt = (variable) => {
    let salt = bcrypt.genSaltSync(BCRYPT_CONFIG.saltRounds);
    let hash = bcrypt.hashSync(variable, salt);
    return hash;
}