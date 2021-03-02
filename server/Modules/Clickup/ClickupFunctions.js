const CONFIG = require("./ClickupConfig");
const { Clickup } = require("./ClickupModel");
const { ClickupRecords } = require("./ClickupModel");
const requestNPM = require('request');
const ASYNCJS = require("async");

exports.authUser = (netin_id, type,  callback) => {
    exports.findByNetinID(netin_id, type, (clickup_info) => {
        if(!clickup_info) return callback({url: exports.getAuthURL()});

        return callback(clickup_info);
    });
}

exports.storeToken = (netin_id, code, callback) => {
    let token = null;
    let clickup_info = null;

    let getTokenFromCode = (callback) => {
        exports.getTokenFromCode(code, (_token) => {
            token = _token
            return callback();
        });
    }

    let findByNetinID = (callback) => {
        exports.findByNetinID(netin_id, 'user', (_clickup_info) => {
            clickup_info = clickup_info;
            return callback();
        });
    }
    
    ASYNCJS.parallel([getTokenFromCode, findByNetinID], () => {
        if(!clickup_info) {
            exports.saveToken(netin_id, token, 'user', (result) => {
                return callback(result)
            });
        } else {
            exports.updateToken(netin_id, token, (result) => {
                return callback(result)
            });
        }
    });
}

exports.getAuthURL = () => {
    let url = 'https://app.clickup.com/api?client_id=' + CONFIG.credentials.web.client_id + '&redirect_uri=' + CONFIG.credentials.web.redirect_uris[1];
    return url;
}

exports.getTokenFromCode = (code, callback) => {
    const options = {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
        },
        uri: CONFIG.api_base_url + '/oauth/token',
        body: {
            client_id: CONFIG.credentials.web.client_id,
            client_secret: CONFIG.credentials.web.client_secret,
            code: code
        },
        json: true
    };

    requestNPM.post(options, (error, response, body) => {
        if (error) throw error;
        if (response.body.error) return callback();
        
        return callback(response.body);
    });
}

exports.findByNetinID = (netin_id, type, callback) => {
    Clickup.findOne({
        netin_id: netin_id,
        type: type
    }, (error, docs) => {
        if (error) throw error;
        return callback(docs);
    });
}

exports.findByType = (type, callback) => {
    Clickup.findOne({
        type: type
    }, (error, docs) => {
        if (error) throw error;
        return callback(docs);
    });
}

exports.saveToken = (netin_id, token, type, callback) => {
    const clickup = new Clickup({
        netin_id: netin_id,
        token: token,
        type: type
    });

    clickup.save((error, result) => {
        if (error) throw error;
        return callback(result);
    });
}

exports.updateToken = (netin_id, token, callback) => {
    Token.updateOne({
        netin_id: netin_id
    },{
        token: token
    },
    { upsert: true },
    (error, result) => {
        if (error) throw error;
        callback(result);
    });
}

exports.getAuthorizedUser = (access_token, callback) => {
    const options = {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'Authorization': access_token
        },
        uri: CONFIG.api_base_url + '/user',
        json: true
    };

    requestNPM.get(options, (error, response, body) => {
        if (error) throw error;
        if (response.body.error) return callback();
        
        return callback(response.body);
    });
}

exports.getTeams = (access_token, callback) => {
    const options = {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'Authorization': access_token
        },
        uri: CONFIG.api_base_url + '/team',
        json: true
    };

    requestNPM.get(options, (error, response, body) => {
        if (error) throw error;
        if (response.body.error) return callback();
        
        return callback(response.body);
    });
}

exports.getSpaces = (access_token, team_id, archived, callback) => {
    const options = {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'Authorization': access_token
        },
        uri: CONFIG.api_base_url + '/team/'+ team_id +'/space?archived=' + archived,
        json: true
    };

    requestNPM.get(options, (error, response, body) => {
        if (error) throw error;
        if (response.body.error) return callback();
        
        return callback(response.body);
    });
}

exports.getFolders = (access_token, space_id, archived, callback) => {
    const options = {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'Authorization': access_token
        },
        uri: CONFIG.api_base_url + '/space/'+ space_id +'/folder?archived=' + archived,
        json: true
    };

    requestNPM.get(options, (error, response, body) => {
        if (error) throw error;
        if (response.body.error) return callback();
        
        return callback(response.body);
    });
}

exports.getLists = (access_token, folder_id, archived, callback) => {
    const options = {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'Authorization': access_token
        },
        uri: CONFIG.api_base_url + '/folder/'+ folder_id +'/list?archived=' + archived,
        json: true
    };

    requestNPM.get(options, (error, response, body) => {
        if (error) throw error;
        if (response.body.error) return callback();
        
        return callback(response.body);
    });
}

exports.getTasks = (access_token, list_id, archived, callback) => {
    const options = {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'Authorization': access_token
        },
        uri: CONFIG.api_base_url + '/list/'+ list_id +'/task?archived=' + archived + '&order_by=due_date',
        json: true
    };

    requestNPM.get(options, (error, response, body) => {
        if (error) throw error;
        if (response.body.error) return callback();
        
        return callback(response.body);
    });
}

/* RECORDS */
exports.getRecords = (callback) => {
    ClickupRecords.find({}, (error, docs) => {
        if (error) throw error;
        return callback(docs);
    });
}

exports.getRecordsByCustomQuery = (query, callback) => {
    ClickupRecords.find(query, (error, docs) => {
        if (error) throw error;
        return callback(docs);
    });
}

exports.saveTaskRecord = (assignees, info, callback) => {
    const clickup_records = new ClickupRecords({
        assignees,
        info
    });

    clickup_records.save((error, result) => {
        if (error) throw error;
        return callback(result);
    });
}

exports.deleteTaskRecords = (callback) => {
    ClickupRecords.deleteMany({

    }, (error, docs) => {
        if (error) throw error;
        return callback(docs);
    });
}