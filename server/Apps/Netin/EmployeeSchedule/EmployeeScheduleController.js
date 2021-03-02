const EmployeeScheduleFunctions = require("./EmployeeScheduleFunctions");
const CONFIG = require("../NetinConfig");
const MESSAGES = require("./EmployeeScheduleMessages");
const EmployeeSchedule = require("./EmployeeScheduleModel");
const MIDDLEWARE = require("../Middleware");
const UserFunctions = require("../User/UserFunctions");
const PresenceTypeFunctions = require("../PresenceType/PresenceTypeFunctions");
const ioAccountMessages = require("../../../Modules/ioAccount/ioAccountMessages");

exports.add = (request, response) => {
    request.check("idUser", MESSAGES.invalid.i0).notEmpty().optional(false);
    request.check("year", MESSAGES.invalid.i1).notEmpty().optional(false);
    request.check("month", MESSAGES.invalid.i2).notEmpty().optional(false);
    request.check("days", MESSAGES.invalid.i3).isArray().optional(false);
    
    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());
        
        let idUser = request.body.idUser;
        let year = request.body.year;
        let month = request.body.month;
        let days = request.body.days;
        let daysCompleted = [];

        MIDDLEWARE.checkPermission("POST_EmployeeSchedule", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);

            UserFunctions.findUser(idUser, (user) => {
                if (!user) return response.status(MESSAGES.invalid.i0.http).send(MESSAGES.invalid.i0);

                PresenceTypeFunctions.findActive((presenceTypes) => {

                    days.forEach(day => {
                        if(!day.day) return response.status(MESSAGES.invalid.i3.http).send(MESSAGES.invalid.i3);
                        if(!day.presence_type) return response.status(MESSAGES.invalid.i3.http).send(MESSAGES.invalid.i3);
                        
                        presenceTypes.forEach(element => {
                            if(element._id == day.presence_type) daysCompleted.push({day:day.day, presence_type:{id:element._id, name: element.name}});
                        });
                    });

                    EmployeeScheduleFunctions.findByUserYearMonth(idUser, year, month, (schedule) => {
                        if(schedule.length > 0) return response.status(MESSAGES.error.e2.http).send(MESSAGES.error.e2);
                        
                        if(days.length != daysCompleted.length) return response.status(MESSAGES.invalid.i4.http).send(MESSAGES.invalid.i4);
    
                        EmployeeScheduleFunctions.save(idUser, year, month, daysCompleted, (result) => {
                            if(result.code == 400) return response.status(MESSAGES.error.e3.http).send(MESSAGES.error.e3);

                            return response.status(MESSAGES.success.s1.http).send(MESSAGES.success.s1);
                        });
                    });
                });
            });
        });
    });
}

exports.get = (request, response) => {
    MIDDLEWARE.checkPermission("GET_EmployeeSchedules", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
        if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);

        EmployeeScheduleFunctions.find((schedules) => {
            if(!schedules) return response.status(MESSAGES.error.e1.http).send(MESSAGES.error.e1);

            return response.status(200).send(schedules);
        });
    });
}

exports.getById = (request, response) => {
    request.check("id", MESSAGES.invalid.i0).notEmpty().optional(false);
    
    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());
        
        let id = request.params.id;

        MIDDLEWARE.checkPermission("GET_EmployeeScheduleByID", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);
            
            EmployeeScheduleFunctions.findById(id, (schedule) => {
                if(!schedule) return response.status(MESSAGES.error.e1.http).send(MESSAGES.error.e1);

                return response.status(200).send(schedule);
            });
        });
    });
}

exports.getByUserId = (request, response) => {
    request.check("id", MESSAGES.invalid.i0).notEmpty().optional(false);
    
    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());
        
        let id = request.params.id;

        MIDDLEWARE.checkPermission("GET_EmployeeScheduleByUserID", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);
            
            EmployeeScheduleFunctions.findByUserId(id, (schedule) => {
                if(!schedule) return response.status(MESSAGES.error.e1.http).send(MESSAGES.error.e1);

                return response.status(200).send(schedule);
            });
        });
    });
}

exports.getByUserYear = (request, response) => {
    request.check("id", MESSAGES.invalid.i0).notEmpty().optional(false);
    request.check("year", MESSAGES.invalid.i1).notEmpty().optional(false);
    
    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());
        
        let id = request.params.id;
        let year = request.params.year;

        MIDDLEWARE.checkPermission("GET_EmployeeScheduleByUserIDYear", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);
            
            EmployeeScheduleFunctions.findByUserYear(id, year, (schedule) => {
                if(!schedule) return response.status(MESSAGES.error.e1.http).send(MESSAGES.error.e1);

                return response.status(200).send(schedule);
            });
        });
    });
}

exports.getByUserYearMonth = (request, response) => {
    request.check("id", MESSAGES.invalid.i0).notEmpty().optional(false);
    request.check("year", MESSAGES.invalid.i1).notEmpty().optional(false);
    request.check("month", MESSAGES.invalid.i2).notEmpty().optional(false);
    
    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());
        
        let id = request.params.id;
        let year = request.params.year;
        let month = request.params.month;

        MIDDLEWARE.checkPermission("GET_EmployeeScheduleByUserIDYearMonth", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);
            
            EmployeeScheduleFunctions.findByUserYearMonth(id, year, month, (schedule) => {
                if(!schedule) return response.status(MESSAGES.error.e1.http).send(MESSAGES.error.e1);

                return response.status(200).send(schedule);
            });
        });
    });
}

exports.addDay = (request, response) => {
    request.check("id", MESSAGES.invalid.i0).notEmpty().optional(false);
    request.check("days", MESSAGES.invalid.i3).notEmpty().isArray().optional(false);
    
    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());
        
        let id = request.params.id;
        let days = request.body.days;
        let daysCompleted = [];
        let daysSaved = [];

        MIDDLEWARE.checkPermission("PUT_EmployeeSchedule", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);

            EmployeeScheduleFunctions.findById(id, (schedule) => {
                if (!schedule) return response.status(MESSAGES.invalid.i0.http).send(MESSAGES.invalid.i0);

                schedule.days.forEach(day => {
                    daysSaved.push(day.day);
                });

                PresenceTypeFunctions.findActive((presenceTypes) => {

                    for (let i = 0; i < days.length; i++){
                        if(!days[i].day) return response.status(MESSAGES.invalid.i3.http).send(MESSAGES.invalid.i3);
                        if(!days[i].presence_type) return response.status(MESSAGES.invalid.i3.http).send(MESSAGES.invalid.i3);
                        if(daysSaved.indexOf(days[i].day) >= 0) return response.status(MESSAGES.invalid.i3.http).send(MESSAGES.invalid.i3);

                        for (let x = 0; x < presenceTypes.length; x++){
                            if(presenceTypes[x]._id == days[i].presence_type) daysCompleted.push({day:days[i].day, presence_type:{id:presenceTypes[x]._id, name: presenceTypes[x].name}});
                        };
                    };
                        
                    if(days.length != daysCompleted.length) return response.status(MESSAGES.invalid.i4.http).send(MESSAGES.invalid.i4);
                    
                    EmployeeScheduleFunctions.putDay(id, schedule.year, schedule.month, daysCompleted, (result) => {
                        if(result.code == 400) return response.status(MESSAGES.error.e3.http).send(MESSAGES.error.e3);

                        return response.status(MESSAGES.success.s2.http).send(MESSAGES.success.s2);
                    });
                });
            });
        });
    });
}

exports.removeDay = (request, response) => {
    request.check("id", MESSAGES.invalid.i0).notEmpty().optional(false);
    request.check("idDay", MESSAGES.invalid.i5).notEmpty().optional(false);
    
    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());
        
        let id = request.params.id;
        let idDay = request.params.idDay;

        MIDDLEWARE.checkPermission("DELETE_EmployeeSchedule", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);

            EmployeeScheduleFunctions.findById(id, (schedule) => {
                if (!schedule) return response.status(MESSAGES.invalid.i0.http).send(MESSAGES.invalid.i0);
    
                EmployeeScheduleFunctions.removeDay(id, idDay, (result) => {
                    return response.status(MESSAGES.success.s3.http).send(MESSAGES.success.s3);
                });
            });
        });
    });
}