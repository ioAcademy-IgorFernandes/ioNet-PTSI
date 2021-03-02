const FactorialFunctions = require("./FactorialFunctions");
const MESSAGES = require("./FactorialMessages");
const ioAccountMessages = require("../../Modules/ioAccount/ioAccountMessages");
const CONFIG = require("./FactorialConfig");
const MIDDLEWARE = require("../../Apps/Netin/Middleware");
const SANITIZE = require("../../Utils/Sanitize");
const ASYNCJS = require("async");
const UserFunctions = require("../../Apps/Netin/User/UserFunctions");
const chalk = require("chalk");

exports.synchronize = (callback) => {
    let netinUsers = [];
    let factorial_users = [];
    let credentials;
    let employees = [];
    
    let getNetinUsers = (callback) => {
        UserFunctions.findUsers((users) => {
            netinUsers = users;
            return callback();
        });
    }

    let getFactorialIDs = (callback) => {
        FactorialFunctions.findTokens("user_token", (users) => {
            factorial_users = users;
            return callback();
        });
    }

    let authorize = (callback) => {
        FactorialFunctions.authorizeApi((oauth) => {
            credentials = oauth;
            return callback();
        });
    }

    let getEmployees = (callback) => {
        if(!credentials) return callback();
        
        FactorialFunctions.getEmployees(credentials, (array) => {
            employees = array;
            return callback();
        });
    }

    let updateEmployees = (callback) => {
        if(!employees) return callback();
        let stack = [];
        
        employees.forEach(employee => {
            stack.push(callback => {
                let user_index = netinUsers.findIndex(user => user.email == employee.email);
                if(user_index < 0) return callback();

                let user = netinUsers[user_index];

                FactorialFunctions.findToken(user._id, "user_token", (_factorial_token) => {
                    if(_factorial_token && _factorial_token.factorial_id) return callback();

                    if(!_factorial_token) {
                        FactorialFunctions.saveToken(user._id, employee.id, "user_token", null, (_result) => {
                            return callback()
                        });
                    } else if(!_factorial_token.factorial_id) {
                        FactorialFunctions.updateFactorialID(user._id, "user_token", employee.id, (_result) => {
                            return callback()
                        });
                    }
                });
            });
        });

        ASYNCJS.parallel(stack, () => {
            return callback();
        })
    }

    ASYNCJS.waterfall([getNetinUsers, getFactorialIDs, authorize, getEmployees, updateEmployees], () => {
        if(!credentials) return callback();
        
        let saveShift = (callback) => {
            FactorialFunctions.getShifts(credentials, (_shifts) => {
                let shifts = JSON.parse(_shifts)
                if(!shifts || shifts.length <= 0) return callback();
                
                FactorialFunctions.saveShifts(shifts, factorial_users, (result) => {
                    console.log(chalk.hex('#ff6a00').underline.bold("FactorialHR Shifts Updated @ Netin Database"));
                    return callback();
                });
            });
        }
        
        let saveLeaves = (callback) => {
            FactorialFunctions.getLeaves(credentials, (leaves) => {
                //let leaves = JSON.parse(_leaves)
                //if(!leaves || leaves.length <= 0) return callback();

                FactorialFunctions.saveLeaves(leaves, factorial_users, (result) => {
                    console.log(chalk.hex('#ff6a00').underline.bold("FactorialHR Leaves Updated @ Netin Database"));
                    return callback();
                });
            });
        }
        
        ASYNCJS.parallel([saveShift, saveLeaves], () => {
            return callback();
        });
        
    });
};

exports.updateToken = (request, response) => {
    request.check("code", MESSAGES.invalid.i1).notEmpty().optional(false);

    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());

        let factorialCode = request.body.code;

        MIDDLEWARE.checkPermission("GET_Calendars", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if (!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);

            ASYNCJS.parallel([], () => {
                FactorialFunctions.updateAccessToken(userId._id, factorialCode, (credentials) => {
                    if (!credentials || typeof credentials.status != 'undefined' || (typeof credentials.status != 'undefined' && credentials.status == 400)) return response.status(credentials.status).send(credentials.data);
                    return response.status(MESSAGES.success.s2.http).send(MESSAGES.success.s2);
                });
            });
        });
    });
}

exports.getShift = (request, response) => {
    let date = new Date();
    MIDDLEWARE.checkPermission("GET_Calendars", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
        if (!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);

        FactorialFunctions.authorizeUser(userId._id, (credentials) => {
            if (typeof credentials.url !== 'undefined' && credentials.url) return response.status(200).send(credentials);
            
            FactorialFunctions.getShifts(credentials, (_shifts) => {
                let shifts = JSON.parse(_shifts)
                if (shifts.length == 0) return response.status(MESSAGES.success.s1.http).send(MESSAGES.success.s1);
                
                //let today_shifts = shifts.filter(element => element.year == date.getFullYear() && element.month == (date.getMonth() + 1) && element.day == date.getDate() && element.employee_id.toString() == credentials.factorial_id);
                //if (today_shifts.length != 0)  return response.status(200).send(today_shifts[today_shifts.length - 1]);
                return response.status(MESSAGES.success.s1.http).send(shifts);
            });
        });
    });
}

exports.getLeaveTypes = (request, response) => {
    MIDDLEWARE.checkPermission("GET_Calendars", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
        if (!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);

        FactorialFunctions.authorizeUser(userId._id, (credentials) => {
            if (typeof credentials.url !== 'undefined' && credentials.url) return response.status(200).send(credentials);

            FactorialFunctions.getLeaveTypes(credentials, (result) => {
                return response.status(200).send(result);
            });
        });
    });
}

exports.postLeave = (request, response) => {
    request.check("start", MESSAGES.invalid.i3).notEmpty().optional(false).isISO8601();
    request.check("end", MESSAGES.invalid.i4).notEmpty().optional(false).isISO8601();
    request.check("leave_type_id", MESSAGES.invalid.i5).notEmpty().optional(false).isNumeric();

    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());
    
        let start = request.body.start
        let end = request.body.end
        let leave_type_id = request.body.leave_type_id

        MIDDLEWARE.checkPermission("GET_Calendars", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if (!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);

            FactorialFunctions.authorizeUser(userId, (credentials) => {
                if (typeof credentials.url !== 'undefined' && credentials.url) return response.status(200).send(credentials);

                FactorialFunctions.createLeave(start, end, leave_type_id, credentials, (resp) => {
                    return response.status(200).send(resp.body);
                });
            });
        });
    });
}

exports.postClockIn = (request, response) => {
    request.check("date", MESSAGES.invalid.i5).notEmpty().optional(false).isISO8601();

    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());
        
        let date = request.body.date;

        MIDDLEWARE.checkPermission("GET_Calendars", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if (!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);

            FactorialFunctions.authorizeUser(userId, (credentials) => {
                if (typeof credentials.url !== 'undefined' && credentials.url) return response.status(200).send(credentials);

                FactorialFunctions.createClockIn(date, credentials, (result) => {
                    return response.status(200).send(result.body);
                });
            });
        });
    });
}

exports.postClockOut = (request, response) => {
    request.check("date", MESSAGES.invalid.i5).notEmpty().optional(false).isISO8601();

    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());
        
        let date = request.body.date;

        MIDDLEWARE.checkPermission("GET_Calendars", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if (!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);

            FactorialFunctions.authorizeUser(userId, (credentials) => {
                if (typeof credentials.url !== 'undefined' && credentials.url) return response.status(200).send(credentials);

                FactorialFunctions.createClockOut(date, credentials, (result) => {
                    return response.status(200).send(result.body);
                });
            });
        });
    });
}