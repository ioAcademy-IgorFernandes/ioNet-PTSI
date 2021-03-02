const CONFIG = require("./FactorialConfig");
const { Shift } = require("./FactorialModel");
const { Leave } = require("./FactorialModel");
const { Token } = require("./FactorialModel");
const requestNPM = require('request');
const readline = require('readline');
const ASYNCJS = require("async");

//*********************AUTH*****************
exports.authorizeApi = (callback) => {
    exports.findToken(null, "api_token", (document) => {
        if (document) {
            let token = document.token;

            let created_at = token.created_at * 1000;
            let expires_in = token.expires_in * 1000;
            let expiryDate = new Date(created_at + expires_in);
            let nowDate = new Date();
            if (nowDate < expiryDate) return callback(document);

            exports.refreshToken(document.token, (newToken) => {
                if(newToken) {
                    exports.updateToken(null, "api_token", newToken, (result) => {
                        return callback({token: newToken});
                    });
                }else{
                    let authUrl = exports.getAuthURL();
    
                    console.log('Authorize this app by visiting this url: ', authUrl);
                    const rl = readline.createInterface({
                        input: process.stdin,
                        output: process.stdout,
                    });
                    rl.question('Enter the code from that page here: ', async (code) => {
                        rl.close();
                        exports.getNewToken(code, (token) => {
                            if(!token) return callback()
    
                            exports.updateToken(null, "api_token", token, (result) => {
                                return callback({token: token});
                            });
                        });
                    });
                }
            });
        } else {
            let authUrl = exports.getAuthURL();
    
            console.log('Authorize this app by visiting this url: ', authUrl);
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            rl.question('Enter the code from that page here: ', async (code) => {
                rl.close();
                exports.getNewToken(code, (token) => {
                    if(!token) return callback()

                    exports.saveToken(null, null, "api_token", token, (result) => {
                        return callback({token: token});
                    });
                });
            });
        }
    });
}

exports.authorizeUser = (netinId, callback) => {
    // Check if we have previously stored a token.
    exports.findToken(netinId, "user_token", (document) => {
        if (!document || !document.token) return callback({url: exports.getAuthURL()});

        let token = document.token;

        let created_at = token.created_at * 1000;
        let expires_in = token.expires_in * 1000;
        let expiryDate = new Date(created_at + expires_in);
        let nowDate = new Date();
        if (nowDate < expiryDate) return callback(document);

        exports.refreshToken(document.token, (newToken) => {
            if(!newToken) return callback({url: exports.getAuthURL()});

            exports.updateToken(netinId, "user_token", newToken, (result) => {
                return callback({token: newToken});
            });
        });
    });
}

exports.updateAccessToken = (netinId, code, callback) => {
    exports.getNewToken(code, (token) => {
        if(!token) return callback(exports.getAuthURL())

        exports.findToken(netinId, "user_token", (_token) => {
            if(_token) {
                exports.updateToken(netinId, "user_token", token, (result) => {
                    return callback({token: token});
                });
            } else {
                exports.saveToken(netinId, null, "user_token", token, (result) => {
                    return callback(result);
                });
            }
        });
    });
};

exports.findToken = (netin_id, type, callback) => {
    Token.findOne({
        netin_id: netin_id,
        type: type
    }, (error, docs) => {
        if (error) throw error;
        return callback(docs);
    });
}

exports.findTokens = (type, callback) => {
    Token.find({
        type: type
    }, (error, docs) => {
        if (error) throw error;
        return callback(docs);
    });
}

exports.refreshToken = (token, callback) => {
    const options = {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
        },
        uri: CONFIG.auth_base_url + '/token',
        body: {
            client_id: CONFIG.credentials.web.application_id,
            client_secret: CONFIG.credentials.web.client_secret,
            refresh_token: token.refresh_token,
            grant_type: 'refresh_token'
        },
        json: true
    };

    requestNPM.post(options, (error, response, body) => {
        if (error || response.body.error) return callback();
        
        return callback(response.body);
    });
}

exports.getNewToken = (code, callback) => {
    const options = {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
        },
        uri: CONFIG.auth_base_url + '/token',
        body: {
            client_id: CONFIG.credentials.web.application_id,
            client_secret: CONFIG.credentials.web.client_secret,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: CONFIG.credentials.web.redirect_uris[0]
        },
        json: true
    };

    requestNPM.post(options, (error, response, body) => {
        if (error) throw error;
        if (response.body.error) return callback();
        
        return callback(response.body);
    });
}

exports.getAuthURL = () => {
    let url = CONFIG.auth_base_url + '/authorize?client_id=' + CONFIG.credentials.web.application_id +
        '&redirect_uri=' + encodeURIComponent(CONFIG.credentials.web.redirect_uris[0]) + '&response_type=code&scope=' + CONFIG.scopes;

    return url;
}

exports.saveToken = (netin_id, factorial_id, type, token, callback) => {
    const model = new Token({
        netin_id: netin_id,
        factorial_id: factorial_id,
        type: type,
        token: token
    });
    model.save((error, result) => {
        if (error) throw error;
        return callback(result);
    });
}

exports.updateToken = (netin_id, type, token, callback) => {
    Token.updateOne({
        netin_id: netin_id,
        type: type
    },{
        token: token
    },
    { upsert: true },
    (error, result) => {
        if (error) throw error;
        callback(result);
    });
}

exports.updateFactorialID = (netin_id, type, factorial_id, callback) => {
    Token.updateOne({
        netin_id: netin_id,
        type: type
    },{
        factorial_id: factorial_id
    },
    { upsert: true },
    (error, result) => {
        if (error) throw error;
        callback(result);
    });
}
//*********************AUTH*****************

//*********************GENERAL FUNCTIONS*****************
exports.createClockIn = (_date, credentials, callback) => {
    let date = new Date(_date);

    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: 'Bearer ' + credentials.token.access_token
        },
        uri: CONFIG.base_url + '/shifts/clock_in',
        body: {
            employee_id: credentials.factorial_id,
            now: date
        },
        json: true
    };
    requestNPM.post(options, (error, result, body) => {
        if (error) throw error;
        return callback(result);
    });
}

exports.createClockOut = (_date, credentials, callback) => {
    let date = new Date(_date);

    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: 'Bearer ' + credentials.token.access_token
        },
        uri: CONFIG.base_url + '/shifts/clock_out',
        body: {
            employee_id: credentials.factorial_id,
            now: date
        },
        json: true
    };

    requestNPM.post(options, (error, result, body) => {
        if (error) throw error;
        return callback(result);
    });
}

exports.getShifts = (credentials, callback) => {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            authorization: 'Bearer ' + credentials.token.access_token
        },
        uri: CONFIG.base_url + '/shifts'
    };

    requestNPM.get(options, (error, result) => {
        if (error) throw error;
        return callback(result.body);
    });
}

exports.createLeave = (_start, _end, leave_type_id, credentials, callback) => {
    let start = new Date(_start);
    let end = new Date(_end);

    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: 'Bearer ' + credentials.token.access_token
        },
        uri: CONFIG.base_url + '/leaves',
        body: {
            employee_id: credentials.factorial_id,
            finish_on: end,
            leave_type_id: leave_type_id,
            start_on: start
        },
        json: true
    };
    requestNPM.post(options, (error, result, body) => {
        if (error) throw error;

        return callback(result);
    });
}

exports.getEmployees = (credentials, callback) => {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: 'Bearer ' + credentials.token.access_token
        },
        url: CONFIG.base_url + '/employees',
        json: true
    };

    requestNPM.get(options, (error, result) => {
        if (result.statusCode != 200 || error) console.log(result, error);
            
        return callback(result.body);
    });
}

exports.getLeaveTypes = (credentials, callback) => {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: 'Bearer ' + credentials.token.access_token
        },
        uri: CONFIG.base_url + '/leave_types',
        json: true
    };

    requestNPM.get(options, (error, result) => {
        if (result.statusCode != 200 || error) throw error;

        return callback(result.body);
    });
}

exports.getLeaves = (credentials, callback) => {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: 'Bearer ' + credentials.token.access_token
        },
        uri: CONFIG.base_url + '/leaves',
        json: true
    };

    requestNPM.get(options, (error, result) => {
        if (error) throw error;
            
        return callback(result.body);
    });
}
//*********************GENERAL FUNCTIONS*****************

//******************CRON SHIFTS******************
exports.saveShifts = (shifts, netinUsers, callback) => {
    if (shifts.length == 0) return callback();

    let stack = [];
    let update_result = null;

    shifts.forEach(shift => {
        stack.push(callback => {
            let user = netinUsers.findIndex(element => element.factorial_id == shift.employee_id);

            if (user < 0) return callback();
            if (shift.clock_in == null || shift.clock_out == null) return callback();

            let netin_id = netinUsers[user].netin_id.toString();
            let inDate = new Date(shift.year, (shift.month - 1), shift.day, parseInt(shift.clock_in.substring(0, 3)), parseInt(shift.clock_in.substring(3, 5)));
            let outDate = new Date(shift.year, (shift.month - 1), shift.day, parseInt(shift.clock_out.substring(0, 3)), parseInt(shift.clock_out.substring(3, 5)));
            let day = { day: shift.day, in: inDate.toISOString(), out: outDate.toISOString() };

            exports.findShift(shift.employee_id, netin_id, shift.year, shift.month, day, (document) => {
                if (document != null) return callback();

                exports.updateShifts(shift.employee_id, netin_id, shift.year, shift.month, day, (_shift) => {
                    update_result = _shift;
                    return callback();
                });
            });
        });
    });

    ASYNCJS.parallel(stack, () => {
        return callback(update_result)
    });
}

exports.findShift = (employee_id, netin_id, year, month, day, callback) => {
    Shift.findOne({
        employee_id: employee_id,
        netin_id: netin_id,
        year: year,
        month: month,
        days: {
            $elemMatch: day
        }
    }, (error, docs) => {
        if (error) throw error;
        return callback(docs);
    });
}

exports.findShiftMatch = (netin_id, year, month, day, callback) => {
    Shift.findOne({
        netin_id: netin_id,
        year: year,
        month: month,
        days: {
            $elemMatch: { day: day }
        }
    }, (error, docs) => {
        if (error) throw error;
        return callback(docs);
    });
}

exports.updateShifts = (employee_id, netin_id, year, month, day, callback) => {
    Shift.updateOne({
        employee_id: employee_id,
        netin_id: netin_id,
        year: year,
        month: month
    }, {
        employee_id: employee_id,
        netin_id: netin_id,
        year: year,
        month: month,
        $addToSet: {
            days: day
        },

    }, {
        upsert: true,
    }, (error, result) => {
        if (error) throw error;
        return callback(result);
    });
}
//******************CRON SHIFTS******************

//******************CRON LEAVES******************
exports.saveLeaves = (leaves_array, netinUsers, callback) => {

    let date = new Date().toISOString();
    let leaves = leaves_array.filter(leave => leave.approved == true);
    if (leaves.length == 0) return callback();
    
    let final_result = null;
    let stack = [];
    
    leaves.forEach(leave => {
        stack.push(callback => {
            let user = netinUsers.findIndex(element => element.factorial_id == leave.employee_id);
            if (user < 0) return callback();
            let netin_id = netinUsers[user].netin_id.toString();

            //check if already as saved 
            exports.findLeave(netin_id, leave.id, (document) => {
                if (document != null) return callback();

                exports.saveLeave(netin_id, leave, date, (result) => {
                    final_result = result;
                    return callback();
                });
            });
        });
    });

    ASYNCJS.parallel(stack, () => {
        return callback(final_result)
    });
}

exports.findLeave = (netin_id, leave_id, callback) => {
    Leave.findOne({
        netin_id: netin_id,
        'leave.id': leave_id
    }, (error, docs) => {
        if (error) throw error;
        return callback(docs);
    });
}

exports.findLeaveByNetinID = (netin_id, callback) => {
    Leave.find({
        netin_id: netin_id
    }, (error, docs) => {
        if (error) throw error;
        return callback(docs);
    });
}

exports.saveLeave = (netin_id, leave, date, callback) => {
    const model = new Leave({
        netin_id: netin_id,
        leave: leave,
        savedDate: date
    });
    model.save((error, result) => {
        if (error) throw error;
        return callback(result);
    });

}
//******************CRON LEAVES******************
//***************************

exports.findLeaves = (date, callback) => {
    Leave.find({
        savedDate: { $gt: date }
    }, (error, docs) => {
        if (error) throw error;
        return callback(docs);
    });
}