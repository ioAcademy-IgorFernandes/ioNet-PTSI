const cron = require('node-cron');
const CONFIG = require('./GoogleSheetsConfig');
const GoogleSheetsFunctions = require("./GoogleSheetsFunctions");
const MESSAGES = require("./GoogleSheetsMessages");
const MIDDLEWARE = require("../../Apps/Netin/Middleware");
const ASYNCJS = require("async");
const ioAccountMessages = require("../../Modules/ioAccount/ioAccountMessages");
const UserFunctions = require("../../Apps/Netin/User/UserFunctions");
const FactorialFunctions = require("../Factorial/FactorialFunctions");
const chalk = require("chalk");
const months = CONFIG.months;

//save updateDate of GoogleSheets for the first time 
GoogleSheetsFunctions.lastUpdate((document) => {
    if (document != null) return;
    let date = new Date().toISOString();
    GoogleSheetsFunctions.updateApi(date, (result) => {
        return;
    });
});

exports.updateSheetInfo = (callback) => {
    let netinUsers = [];
    let credentials;
    let leaves = [];
    let update;

    let getNetinUsers = (callback) => {
        UserFunctions.findUsers((users) => {
            netinUsers = users;
            return callback();
        });
    }

    let authorize = (callback) => {
        GoogleSheetsFunctions.authorize((oauth) => {
            credentials = oauth;
            return callback();
        });
    }

    let lastUpdate = (callback) => {
        GoogleSheetsFunctions.lastUpdate((document) => {
            update = document.last_update;
            return callback();
        });
    }

    let getLeaves = (callback) => {
        FactorialFunctions.findLeaves(update, (docs) => {
            leaves = docs;
            return callback();
        });
    }

    ASYNCJS.waterfall([getNetinUsers, authorize, lastUpdate, getLeaves], () => {
        
        let updateMongoDB = (callback) => {
            //------------------update data from googlesheets on mongoDB----------------------//
            GoogleSheetsFunctions.readGoogleSheets(credentials, (sheets) => {
                GoogleSheetsFunctions.saveSheets(sheets, netinUsers, (result) => {
                    console.log(chalk.hex('#ff6a00').underline.bold("GoogleSheets Employee Schedule Updated @ Netin Database"));
                    return callback();
                });
            });
        }
        
        let updateGoogleSheet = (callback) => {
            //------------------insert vacancies from factorial on googlesheets----------------------//
            if (leaves.length == 0) return callback()
            let stack = [];

            leaves.forEach(leave => {
                stack.push(callback => {
                    GoogleSheetsFunctions.insertGoogleSheets(credentials, leave.netin_id, leave.leave.start_on, leave.leave.finish_on, (result) => {
                        GoogleSheetsFunctions.updateApi(leaves[0].savedDate, (result) => {
                            return callback();
                        });
                    });
                });
            });

            ASYNCJS.parallel(stack, () => {
                console.log(chalk.hex('#ff6a00').underline.bold("FactorialHR Vacancies Updated @ GoogleSheets Employee Schedule"));
                return callback();
            });
        }
        
        ASYNCJS.parallel([updateMongoDB, updateGoogleSheet], () => {
            return callback();
        });
    });
};

//this function returns the last 3 months
exports.getWorkAvg = (request, response) => {
    request.check("first.month", MESSAGES.invalid.i0).notEmpty().optional(false).isNumeric();
    request.check("first.year", MESSAGES.invalid.i0).notEmpty().optional(false).isNumeric();
    request.check("second.month", MESSAGES.invalid.i0).notEmpty().optional(false).isNumeric();
    request.check("second.year", MESSAGES.invalid.i0).notEmpty().optional(false).isNumeric();
    request.check("third.month", MESSAGES.invalid.i0).notEmpty().optional(false).isNumeric();
    request.check("third.year", MESSAGES.invalid.i0).notEmpty().optional(false).isNumeric();

    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());

        MIDDLEWARE.checkPermission("GET_Calendars", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if (!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);

            let average = [];
            
            let first = (callback) => {
                let month = request.body.first.month;
                let year = request.body.first.year;
                GoogleSheetsFunctions.getMonth(year, month, (documents) => {
                    if (documents.length == 0) return callback();
                    
                    GoogleSheetsFunctions.getAVGTotals(documents, (totals) => {
                        totals.month = months[(month - 1)];
                        average.push(totals);
                        return callback();
                    });
                });
            }

            let second = (callback) => {
                let month = request.body.second.month;
                let year = request.body.second.year;
                GoogleSheetsFunctions.getMonth(year, month, (documents) => {
                    if (documents.length == 0) return callback();
                    
                    GoogleSheetsFunctions.getAVGTotals(documents, (totals) => {
                        totals.month = months[(month - 1)];
                        average.push(totals);
                        return callback();
                    });      
                });
            }

            let third = (callback) => {
                let month = request.body.third.month;
                let year = request.body.third.year;
                GoogleSheetsFunctions.getMonth(year, month, (documents) => {
                    if (documents.length == 0) return callback();
                    
                    GoogleSheetsFunctions.getAVGTotals(documents, (totals) => {
                        totals.month = months[(month - 1)];
                        average.push(totals);
                        return callback();
                    });
                });
            }

            ASYNCJS.waterfall([first, second, third], () => {
                if (average.length != 3) return response.status(MESSAGES.error.e0.http).send(MESSAGES.error.e0);

                return response.status(200).send(average);
            });
        });
    });
}

exports.getDay = (request, response) => {
    request.check("date", MESSAGES.invalid.i1).notEmpty().optional(false).isISO8601();

    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());

        MIDDLEWARE.checkPermission("GET_Calendars", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if (!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);

            let result = {};
            let date = new Date(request.body.date);
            let data = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 1, 0);
            
            GoogleSheetsFunctions.getDay(data, (day) => {
                if (day.length == 0) return response.status(MESSAGES.success.s0.http).send(MESSAGES.success.s0);
                
                result.iotech = day.filter(element => element.employee_work_register[0].type == "IOTech");
                result.outiotech = day.filter(element => element.employee_work_register[0].type == "OutIOTech");
                result.rest = day.filter(element => element.employee_work_register[0].type == "Rest");
                result.training = day.filter(element => element.employee_work_register[0].type == "Training");
                result.vacancies = day.filter(element => element.employee_work_register[0].type == "Vacancies");
                result.dissertation = day.filter(element => element.employee_work_register[0].day_period == "D");
                result.riopele = day.filter(element => element.employee_work_register[0].day_period == "R");

                return response.status(200).send(result);
            });
        });
    });
}

exports.getEmployeeWork = (request, response) => {
    request.check("name", MESSAGES.invalid.i2).notEmpty().optional(false);
    request.check("month", MESSAGES.invalid.i0).notEmpty().optional(false).isNumeric();
    request.check("year", MESSAGES.invalid.i0).notEmpty().optional(false).isNumeric();

    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());

        MIDDLEWARE.checkPermission("GET_Calendars", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if (!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);

            let month = request.body.month;
            let year = request.body.year;
            GoogleSheetsFunctions.getMonth(year, month, (documents) => {
                let employee = documents.filter(element => element.name == request.body.name)[0];
                if (!employee) return response.status(MESSAGES.error.e0.http).send(MESSAGES.error.e0);

                let register = employee.employee_work_register
                let result = {};
                result.name = employee.name;
                result.iotech = register.filter(element => element.type == "IOTech").length;
                result.outiotech = register.filter(element => element.type == "OutIOTech").length;
                result.rest = register.filter(element => element.type == "Rest").length;
                result.training = register.filter(element => element.type == "Training").length;
                result.vacancies = register.filter(element => element.type == "Vacancies").length;
                result.dissertation = register.filter(element => element.day_period == "D").length;
                result.riopele = register.filter(element => element.day_period == "R").length;

                return response.status(200).send(result);
            });
        });
    });
}