const PermissionFunctions = require("./PermissionFunctions");
const CONFIG = require("../NetinConfig");
const MESSAGES = require("./PermissionMessages");
const ioAccountMessages = require("../../../Modules/ioAccount/ioAccountMessages");
const Permission = require("./PermissionModel");
const MIDDLEWARE = require("../Middleware");
const Sanitize = require("@Sanitize");
const Utilities = require("@Utilities");
const UserFunctions = require("../User/UserFunctions");
const ApplicationFunctions = require("../Application/ApplicationFunctions");

exports.add = (request, response) => {
    request.check("idApp", MESSAGES.invalid.i6).notEmpty().optional(false);
    request.check("idUser", MESSAGES.invalid.i3).notEmpty().optional(false);
    
    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());
        
        let idApp = request.body.idApp;
        let idUser = request.body.idUser;

        MIDDLEWARE.checkPermission("POST_Permission", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);
            
            UserFunctions.findUser(idUser, (user) => {
                if(!user || user.group != "Testers") return response.status(MESSAGES.invalid.i3.http).send(MESSAGES.invalid.i3);
                
                ApplicationFunctions.readById(idApp, (app) => {
                    if(!app) return response.status(MESSAGES.invalid.i6.http).send(MESSAGES.invalid.i6);

                    PermissionFunctions.findPermissionByApp(idApp, (permission) => {
                        if(permission.length > 0) return response.status(MESSAGES.error.e2.http).send(MESSAGES.error.e2);
                        
                        PermissionFunctions.savePermission(idApp, idUser, (result) => {
                            return response.status(MESSAGES.success.s1.http).send(MESSAGES.success.s1);
                        });
                    });
                });
            });
        });
    });
};

exports.get = (request, response) => {
    MIDDLEWARE.checkPermission("GET_Permissions", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
        if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);
 
        PermissionFunctions.findPermissions((permissions) => {
            if (permissions.length == 0) return response.status(MESSAGES.error.e1.http).send(MESSAGES.error.e1);

            return response.status(MESSAGES.success.s0.http).send(permissions);
        });
    });
};

exports.getByApp = (request, response) => {
    request.check("idApp", MESSAGES.invalid.i6).notEmpty().optional(false);
    
    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());
        
        let idApp = Sanitize.whitelist(request.params.idApp, ["alphabet", "numerical"]);

        MIDDLEWARE.checkPermission("GET_PermissionByApplication", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);
 
            PermissionFunctions.findPermissionByApp(idApp, (permission) =>{ 
                if (permission.length == 0) return response.status(MESSAGES.error.e1.http).send(MESSAGES.error.e1);

                let userIdArray=[];
                let newPermission = JSON.parse(JSON.stringify(permission[0]));

                permission[0].idUsers.forEach(idUser => {
                    userIdArray.push(idUser.idUser);
                });

                ApplicationFunctions.readById(newPermission.idApp, (app) => {
                    if(!app) return response.status(MESSAGES.invalid.i6.http).send(MESSAGES.invalid.i6);
    
                    newPermission.application = app;
                    delete newPermission.idApp;

                    UserFunctions.findByIdArray(userIdArray, (users) => {
                        newPermission.idUsers = users;
                        return response.status(MESSAGES.success.s0.http).send(newPermission);
                    });
                });
            });
        });
    });
}

exports.getById = (request, response) => {
    request.check("id", MESSAGES.invalid.i0).notEmpty().optional(false);
    
    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());
        
        let id = Sanitize.whitelist(request.params.id, ["alphabet", "numerical"]);

        MIDDLEWARE.checkPermission("GET_PermissionsByID", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);
 
            PermissionFunctions.findPermission(id, (permission) => {
                if(!permission) return response.status(MESSAGES.error.e1.http).send(MESSAGES.error.e1);

                let userIdArray=[];
                let newPermission = JSON.parse(JSON.stringify(permission));

                permission.idUsers.forEach(idUser => {
                    userIdArray.push(idUser.idUser);
                });

                ApplicationFunctions.readById(newPermission.idApp, (app) => {
                    if(!app) return response.status(MESSAGES.invalid.i6.http).send(MESSAGES.invalid.i6);
    
                    newPermission.application = app;
                    delete newPermission.idApp;

                    UserFunctions.findByIdArray(userIdArray, (users) => {
                        newPermission.idUsers = users;
                        return response.status(MESSAGES.success.s0.http).send(newPermission);
                    });
                });
            });
        });
    });
};

exports.update = (request, response) => {
    request.check("id", MESSAGES.invalid.i0).notEmpty().optional(false);
    request.check("idUser", MESSAGES.invalid.i3).notEmpty().optional(false);
    
    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());
        
        let id = Sanitize.whitelist(request.params.id, ["alphabet", "numerical"]);
        let idUser = request.body.idUser;

        MIDDLEWARE.checkPermission("PUT_Permission", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);
                
            PermissionFunctions.findPermission(id, (permission) => {
                if(permission == null || permission.length == 0) return response.send(MESSAGES.invalid.i0);

                UserFunctions.findUser(idUser, (user) => {
                    if(!user || user.group != "Testers") return response.status(MESSAGES.invalid.i3.http).send(MESSAGES.invalid.i3);
                    
                    PermissionFunctions.addUserPermission(id, idUser, (result) => {
                        if (result.length == 0) return response.status(MESSAGES.error.e1.http).send(MESSAGES.error.e1);
    
                        return response.status(MESSAGES.success.s3.http).send(MESSAGES.success.s3);
                    });
                });
            });
        });
    });    
};

exports.removeUser = (request, response) => {
    request.check("id", MESSAGES.invalid.i0).notEmpty().optional(false);
    request.check("idUser", MESSAGES.invalid.i3).notEmpty().optional(false);
    
    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());
        
        let id = Sanitize.whitelist(request.params.id, ["alphabet", "numerical"]);
        let idUser = Sanitize.whitelist(request.params.idUser, ["alphabet", "numerical"]);

        MIDDLEWARE.checkPermission("DELETE_Permission", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);

            PermissionFunctions.findPermission(id, (permission) => {
                if(permission == null || permission.length == 0) return response.status(MESSAGES.invalid.i0.http).send(MESSAGES.invalid.i0);

                PermissionFunctions.removeUserPermission(id, idUser, (result) => {
                    if (result.length == 0) return response.status(MESSAGES.error.e1.http).send(MESSAGES.error.e1);
                    
                    return response.status(MESSAGES.success.s2.http).send(MESSAGES.success.s2);
                });
            });
        });
    });
};