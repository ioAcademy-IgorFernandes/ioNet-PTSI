const RecomendationFunctions = require("./RecomendationFunctions");
const CONFIG = require("../NetinConfig");
const MESSAGES = require("./RecomendationMessages");
const Recomendation = require("./RecomendationModel");
const UserFunctions = require("../User/UserFunctions");
const ApplicationFunctions = require("../Application/ApplicationFunctions");
const ioAccountMessages = require("../../../Modules/ioAccount/ioAccountMessages");
const MIDDLEWARE = require("../Middleware");
const Sanitize = require("@Sanitize");
const Utilities = require("@Utilities");

exports.add = (request, response) => {
    request.check("idUser", MESSAGES.invalid.i3).notEmpty().optional(false);
    request.check("idApp", MESSAGES.invalid.i5).notEmpty().optional(false);
    request.check("feedbacks", MESSAGES.invalid.i4).notEmpty().isArray().optional(false);
    
    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());
        
        let idUser = request.body.idUser;
        let idApp = request.body.idApp;
        let feedbacks = request.body.feedbacks;

        MIDDLEWARE.checkPermission("POST_Recomendation", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);
            
            UserFunctions.findUser(idUser, (user) => {
                if(!user || user.length == 0) return response.status(MESSAGES.invalid.i3.http).send(MESSAGES.invalid.i3);
                    
                ApplicationFunctions.readById(idApp, (app) => {
                    if(!app || app.length == 0) return response.status(MESSAGES.invalid.i5.http).send(MESSAGES.invalid.i5);
                    
                    RecomendationFunctions.readByIdAppIdUser(idApp, idUser, (recomendation) => {
                        if(recomendation) return response.status(MESSAGES.error.e6.http).send(MESSAGES.error.e6);
                        
                        RecomendationFunctions.save(idApp, idUser, feedbacks, (result) => {
                            return response.status(MESSAGES.success.s0.http).send(MESSAGES.success.s0);
                        });
                    });
                });
            });
        });
    });
}


exports.get = (request, response) => {
    MIDDLEWARE.checkPermission("GET_Recomendations", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
        if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);
        
        RecomendationFunctions.readAll((recomendations) => {
            if (!recomendations || recomendations.length == 0) return response.status(MESSAGES.error.e4.http).send(MESSAGES.error.e4);
            
            return response.status(MESSAGES.success.s0.http).send(recomendations);
        });
    });
}

exports.readByID = (request, response) => {
    request.check("id", MESSAGES.invalid.i0).notEmpty().optional(false);
    
    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());
        
        let id = Sanitize.whitelist(request.params.id, ["alphabet", "numerical"]);

        MIDDLEWARE.checkPermission("GET_RecomendationByID", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);
            
            RecomendationFunctions.readById(id, (recomendation) => {
                if (!recomendation) return response.status(MESSAGES.error.e4.http).send(MESSAGES.error.e4);
 
                return response.status(MESSAGES.success.s0.http).send(recomendation);
            });
        });
    });
}

exports.readByIDUser = (request, response) => {
    request.check("idUser", MESSAGES.invalid.i3).notEmpty().optional(false);
    
    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());
        
        let idUser = Sanitize.whitelist(request.params.idUser, ["alphabet", "numerical"]);

        MIDDLEWARE.checkPermission("GET_RecomendationByUserID", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);
            
            RecomendationFunctions.readByIdUser(idUser, (recomendations) => {
                if (!recomendations || recomendations.length == 0) return response.status(MESSAGES.error.e4.http).send(MESSAGES.error.e4);

                return response.status(MESSAGES.success.s0.http).send(recomendations);
            });
        });
    });
}

exports.readByIdAppIdUser = (request, response) => {
    request.check("idUser", MESSAGES.invalid.i3).notEmpty().optional(false);
    request.check("idApp", MESSAGES.invalid.i5).notEmpty().optional(false);
    
    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());
        
        let idUser = Sanitize.whitelist(request.params.idUser, ["alphabet", "numerical"]);
        let idApp = Sanitize.whitelist(request.params.idApp, ["alphabet", "numerical"]);

        MIDDLEWARE.checkPermission("GET_RecomendationByApplicationIDUserID", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);
            
            RecomendationFunctions.readByIdAppIdUser(idApp, idUser, (recomendation) => {
                if (!recomendation || recomendation.length == 0) return response.status(MESSAGES.error.e4.http).send(MESSAGES.error.e4);
                
                return response.status(MESSAGES.success.s0.http).send(recomendation);
            });
        });
    });
}

exports.readByIdApp = (request, response) => {
    request.check("idApp", MESSAGES.invalid.i5).notEmpty().optional(false);
    
    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());
        
        let idApp = Sanitize.whitelist(request.params.idApp, ["alphabet", "numerical"]);

        MIDDLEWARE.checkPermission("GET_RecomendationByApplicationID", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);
            
            RecomendationFunctions.readByIdApp(idApp, (recomendation) => {
                if (!recomendation) return response.status(MESSAGES.error.e4.http).send(MESSAGES.error.e4);

                return response.status(MESSAGES.success.s0.http).send(recomendation);
            });
        });
    });
}

exports.put = (request, response) => {
    request.check("id", MESSAGES.invalid.i0).notEmpty().optional(false);
    request.check("feedbacks", MESSAGES.invalid.i4).notEmpty().isArray().optional(false);
    
    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());
        
        let id = request.params.id;
        let feedbacks = request.body.feedbacks;

        MIDDLEWARE.checkPermission("PUT_Recomendation", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);
                
            RecomendationFunctions.readById(id, (recomendation) => {
                if(!recomendation) return response.status(MESSAGES.invalid.i0.http).send(MESSAGES.invalid.i0);
                
                RecomendationFunctions.putRecomendation(id, feedbacks, (result) => {
                    return response.status(MESSAGES.success.s1.http).send(MESSAGES.success.s1);
                });
            });
        });
    });
};

exports.delete = (request, response) => {
    request.check("id", MESSAGES.invalid.i0).notEmpty().optional(false);
    request.check("idFeedback", MESSAGES.invalid.i4).notEmpty().optional(false);
    
    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());
        
        let id = request.params.id;
        let idFeedback = request.params.idFeedback;

        MIDDLEWARE.checkPermission("DELETE_Recomendation", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);
            
            RecomendationFunctions.readById(id, (recomendation) => {
                if(!recomendation) return response.status(MESSAGES.invalid.i0.http).send(MESSAGES.invalid.i0);
                
                RecomendationFunctions.removeRecomendation(id, idFeedback, (result) => {
                    return response.status(MESSAGES.success.s4.http).send(MESSAGES.success.s4);
                });
            });
        });
    });
};