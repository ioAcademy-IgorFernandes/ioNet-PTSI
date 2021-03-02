const CONFIG = require("./ioAccountConfig");
const ioAccount = require("./ioAccountModel");
const requestNPM = require('request');


exports.auth = (email, password, callback) => {

    const options = {
        method: 'POST',
        url: CONFIG.api_url + "/ioaccount/auth/user",
        headers: {
            "Content-Type": "application/json",
            "application": "ioaccount",
            "language": "en"
        },
        body: {
            email: email,
            password: password
        },
        json: true
    };

    requestNPM(options, (error, resp, body) => {
        if (error) throw error;

        return callback(resp);
    });
}

exports.getUserInfo = (token, callback) => {
    const options = {
        method: 'GET',
        url: CONFIG.api_url + '/ioaccount/auth/user',
        headers: {
            "Language": "pt",
            "Authorization": token,
            "Application": "ioaccount"
        },
        json: true
    };
    requestNPM(options, (error, resp, body) => {
        if (error) throw error;
            
        return callback(resp);
    });
}

exports.getPermissionGroups = (token, groupId, callback) => {
    const options = {
        method: 'GET',
        url: CONFIG.api_url + '/ioaccount/permissions/groups/' + groupId,
        headers: {
            "Language": "pt",
            "Authorization": token,
            "Application": "ioaccount"
        },
        json: true
    };
    requestNPM(options, (error, resp, body) => {
        if (error) throw error;

        return callback(resp);
    });
}