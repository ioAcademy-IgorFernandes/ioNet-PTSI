const PresenceTypeFunctions = require("./PresenceTypeFunctions");
const CONFIG = require("../NetinConfig");
const MESSAGES = require("./PresenceTypeMessages");
const PresenceType = require("./PresenceTypeModel");
const MIDDLEWARE = require("../Middleware");
const ioAccountMessages = require("../../../Modules/ioAccount/ioAccountMessages");

exports.add = (request, response) => {
    request.check("name", MESSAGES.invalid.i0).notEmpty().optional(false);
    request.check("description", MESSAGES.invalid.i1).notEmpty().optional(false);
    
    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());
        
        let name = request.body.name;
        let description = request.body.description;

        MIDDLEWARE.checkPermission("POST_PresenceType", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);

            PresenceTypeFunctions.save(name, description, (result) => {
                return response.status(MESSAGES.success.s1.http).send(MESSAGES.success.s1);
            });
        });
    });
}

exports.get = (request, response) => {
    MIDDLEWARE.checkPermission("GET_PresenceTypes", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
        if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);

        PresenceTypeFunctions.find((types) => {
            if(!types) return response.status(MESSAGES.error.e1.http).send(MESSAGES.error.e1);

            return response.status(200).send(types);
        });
    });
}

exports.getActive = (request, response) => {
    MIDDLEWARE.checkPermission("GET_PresenceTypesActive", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
        if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);

        PresenceTypeFunctions.findActive((types) => {
            if(!types) return response.status(MESSAGES.error.e1.http).send(MESSAGES.error.e1);

            return response.status(200).send(types);
        });
    });
}

exports.getById = (request, response) => {
    request.check("id", MESSAGES.invalid.i2).notEmpty().optional(false);
    
    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());
        
        let id = request.params.id;

        MIDDLEWARE.checkPermission("GET_PresenceTypeByID", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);
            
            PresenceTypeFunctions.findById(id, (presenceType) => {
                if(!presenceType) return response.status(MESSAGES.error.e1.http).send(MESSAGES.error.e1);

                return response.status(200).send(presenceType);
            });
        });
    });
}

exports.deactivate = (request, response) => {
    request.check("id", MESSAGES.invalid.i2).notEmpty().optional(false);
    
    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());
        
        let id = request.params.id;

        MIDDLEWARE.checkPermission("DELETE_PresenceType", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);
            
            PresenceTypeFunctions.deleteL(id, (result) => {
                return response.status(MESSAGES.success.s3.http).send(MESSAGES.success.s3);
            });
        });
    });
}

exports.activate = (request, response) => {
    request.check("id", MESSAGES.invalid.i0).notEmpty().optional(false);
    
    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());
        
        let id = request.params.id;

        MIDDLEWARE.checkPermission("PUT_PresenceType", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);
            
            PresenceTypeFunctions.activateType(id, (result) => {
                return response.status(MESSAGES.success.s2.http).send(MESSAGES.success.s2);
            });
        });
    });
}