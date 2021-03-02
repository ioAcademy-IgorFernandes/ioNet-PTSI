const ApplicationFunctions = require("./ApplicationFunctions");
const CONFIG = require("../NetinConfig");
const MESSAGES = require("./ApplicationMessages");
const Application = require("./ApplicationModel");
const ioAccountMessages = require("../../../Modules/ioAccount/ioAccountMessages");
const MIDDLEWARE = require("../Middleware");
const Sanitize = require("@Sanitize");
const PermissionFunctions = require("../Permission/PermissionFunctions");
const ApplicationCookieFunctions = require("../ApplicationCookie/ApplicationCookieFunctions");
const ASYNCJS = require("async");

exports.add = (request, response) => {
    request.check("application", MESSAGES.invalid.i1).notEmpty().optional(false);
    request.check("version", MESSAGES.invalid.i2).notEmpty().optional(false);
    request.check("url", MESSAGES.invalid.i4).notEmpty().optional(false);
    
    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());
        
        let application = Sanitize.whitelist(request.body.application, ["alphabet", "numerical", "allowed"]);
        let version = Sanitize.whitelist(request.body.version, ["alphabet", "numerical", "allowed"]);
        let url = Sanitize.whitelist(request.body.url, ["alphabet", "numerical", "allowed"]);;

        MIDDLEWARE.checkPermission("POST_Application", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);
                
            ApplicationFunctions.save(application, version, url, (result) => {
                return response.status(MESSAGES.success.s0.http).send(MESSAGES.success.s0);
            }); 
        });

    });
}

exports.getActive = (request, response) => {
    MIDDLEWARE.checkPermission("GET_ApplicationsActive", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
        if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);
        
        ApplicationFunctions.readActive((apps) => {
            if (!apps || apps.length == 0) return response.status(MESSAGES.error.e2.http).send(MESSAGES.error.e2);

            return response.status(MESSAGES.success.s0.http).send(apps);
        });   
    });
}

exports.get = (request, response) => {
    MIDDLEWARE.checkPermission("GET_Applications", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
        if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);
        
        ApplicationFunctions.readAll((apps) => {
            if (!apps || apps.length == 0) return response.status(MESSAGES.error.e2.http).send(MESSAGES.error.e2);
                    
            return response.status(MESSAGES.success.s0.http).send(apps);
        });
    });
}

exports.readByID = (request, response) => {
    request.check("id", MESSAGES.invalid.i0).notEmpty().optional(false);
    
    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());
        
        let id = Sanitize.whitelist(request.params.id, ["alphabet", "numerical"]);

        MIDDLEWARE.checkPermission("GET_ApplicationByID", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);
            
            ApplicationFunctions.readById(id, (app) => {
                if (!app) return response.status(MESSAGES.error.e2.http).send(MESSAGES.error.e2);
                
                return response.status(MESSAGES.success.s0.http).send(app);
            });
        });
    });
}

exports.getByUser = (request, response) => {
    request.check("userId", MESSAGES.invalid.i3).notEmpty().optional(false);
    
    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());
        
        let idUser = Sanitize.whitelist(request.params.userId._id, ["alphabet", "numerical"]);

        MIDDLEWARE.checkPermission("GET_ApplicationByPermittedUser", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);
            
            let permittedApps = [];
            let AppIds = [];

            let getPermissionsByUser = (callback) => {
                PermissionFunctions.findPermissionsByUserId(idUser, (permission) => {
                    permittedApps = permission;
                    return callback();
                });
            };

            let getAppIds = (callback) => {
                permittedApps.forEach(element => {
                    AppIds.push(element.idApp);
                });
                return callback();
            }

            ASYNCJS.waterfall([getPermissionsByUser, getAppIds], () => {
                if (permittedApps.length == 0) return response.status(MESSAGES.error.e2.http).send(MESSAGES.error.e2);
                
                ApplicationFunctions.readByIdArray(AppIds, (apps)=>{
                    if (!apps || apps.length == 0) return response.status(MESSAGES.error.e2.http).send(MESSAGES.error.e2);
                    
                    return response.status(MESSAGES.success.s0.http).send(apps);
                });
            });
            
        });
    });
}

exports.createAccess = (request, response) => {
    request.check("id", MESSAGES.invalid.i0).notEmpty().optional(false);
    
    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());
        
        let id = Sanitize.whitelist(request.params.id, ["alphabet", "numerical"]);

        MIDDLEWARE.checkPermission("GET_ApplicationByPermittedUser", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);
            
            ApplicationFunctions.readById(id, (application) => {
                if(!application) return response.status(MESSAGES.invalid.i0.http).send(MESSAGES.invalid.i0);

                MIDDLEWARE.checkPermission("POST_Application", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, user) => {
                    if(!permissions || !userId){
                        PermissionFunctions.findPermissionByAppUserID(id, userId._id, (permission) => {
                            if(permission.length <= 0) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);

                            getApplicationCookie(userId._id, id, application, (app_cookie) => {
                                return response.status(app_cookie.http).send(app_cookie);
                            });
                        });
                    }else{
                        getApplicationCookie(userId._id, id, application, (app_cookie) => {
                            return response.status(app_cookie.http).send(app_cookie);
                        });
                    }
                });
            });
        });
    });
}

let getApplicationCookie = (userId, id, application, callback) => {
    ApplicationCookieFunctions.readByUserIdAppId(userId, id, (app_cookie) => {
                        
        if(app_cookie.length <= 0){
            
            ApplicationCookieFunctions.save(userId, id, application.url, (application_cookie) => {
                let message = MESSAGES.success.s3;
                message.body = application_cookie;
                
                return callback(message);
            });
        }else{
            let date = new Date();
            let expiration_date = new Date(app_cookie[0].expiration_date);
            
            if(date.getTime() < expiration_date.getTime()) {
                let message = MESSAGES.success.s3;
                message.body = app_cookie[0];
                
                return callback(message);
            }else{
                ApplicationCookieFunctions.deactivate(userId, id, (result) => {
                    ApplicationCookieFunctions.save(userId, id, application.url, (application_cookie) => {
                        let message = MESSAGES.success.s3;
                        message.body = application_cookie;
                        
                        return callback(message);
                    });
                });
            }
        }
    });
}

exports.checkAccess = (request, response) => {
    request.check("cookie", MESSAGES.invalid.i5).notEmpty().optional(false);
    
    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());
        
        let cookie = request.body.cookie;
        
        ApplicationCookieFunctions.readByCookie(cookie, (app_cookie) => {
            if(!app_cookie) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);

            let date = new Date();
            let expiration_date = new Date(app_cookie.expiration_date);
            
            if(date.getTime() > expiration_date.getTime()) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);
            
            let message = MESSAGES.success.s3;
            message.body = app_cookie;
                
            return response.status(message.http).send(message);
        });
    });
}

exports.update = (request, response) => {
    request.check("id", MESSAGES.invalid.i0).notEmpty().optional(false);
    request.check("application", MESSAGES.invalid.i1).notEmpty().optional(false);
    request.check("version", MESSAGES.invalid.i2).notEmpty().optional(false);
    request.check("url", MESSAGES.invalid.i4).notEmpty().optional(false);
    
    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());
        
        let id = Sanitize.whitelist(request.params.id, ["alphabet", "numerical"]);
        let application = request.body.application;
        let version = request.body.version;
        let url = request.body.url;

        MIDDLEWARE.checkPermission("PUT_Application", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);
            
            ApplicationFunctions.update(id, application, version, url, (result) => {
                return response.status(MESSAGES.success.s1.http).send(MESSAGES.success.s1);
            });
        });
    });
}

exports.remove = (request, response) => {
    request.check("id", MESSAGES.invalid.i0).notEmpty().optional(false);
    
    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());
        
        let id = Sanitize.whitelist(request.params.id, ["alphabet", "numerical"]);

        MIDDLEWARE.checkPermission("DELETE_Application", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);
                
            ApplicationFunctions.remove(id, (result) => {
                response.status(MESSAGES.success.s2.http).send(MESSAGES.success.s2);
            });
        });
    });
}