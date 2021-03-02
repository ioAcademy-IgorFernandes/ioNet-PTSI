const TermsFunctions = require("./TermsFunctions");
const CONFIG = require("../NetinConfig");
const MESSAGES = require("./TermsMessages");
const Terms = require("./TermsModel");
const MIDDLEWARE = require("../Middleware");
const ioAccountMessages = require("../../../Modules/ioAccount/ioAccountMessages");

exports.add = (request, response) => {
    request.check("number", MESSAGES.invalid.i0).notEmpty().optional(false);
    request.check("description", MESSAGES.invalid.i1).notEmpty().optional(false);
    request.check("internal_rule", MESSAGES.invalid.i2).notEmpty().optional(false);
    
    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());
        
        let number = request.body.number;
        let description = request.body.description;
        let internal_rule = request.body.internal_rule;

        MIDDLEWARE.checkPermission("POST_Application", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);
            
            TermsFunctions.readByNumber(number, (term) => {
                if(term.length > 0) return response.status(MESSAGES.error.e1.http).send(MESSAGES.error.e1);

                TermsFunctions.save(number, description, internal_rule, (term) => {
                    return response.status(MESSAGES.success.s0.http).send(MESSAGES.success.s0);
                }); 
            });
            
        });

    });
}

exports.get = (request, response) => {
    MIDDLEWARE.checkPermission("GET_Application", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
        if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);
            
        TermsFunctions.readAll((terms) => {
            if (!terms || terms.length == 0) return response.status(MESSAGES.error.e1.http).send(MESSAGES.error.e1);

            return response.status(MESSAGES.success.s0.http).send(terms);
        }); 
    });
}

exports.getActive = (request, response) => {
    MIDDLEWARE.checkPermission("GET_ApplicationByPermittedUser", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
        if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);
            
        TermsFunctions.readActive((terms) => {
            if (!terms || terms.length == 0) return response.status(MESSAGES.error.e1.http).send(MESSAGES.error.e1);

            return response.status(MESSAGES.success.s0.http).send(terms);
        }); 
    });
}

exports.update = (request, response) => {}

exports.remove = (request, response) => {
    request.check("id", MESSAGES.invalid.i3).notEmpty().optional(false);
    
    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());
        
        let id = request.params.id;

        MIDDLEWARE.checkPermission("POST_Application", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);
                
            TermsFunctions.remove(id, (term) => {
                return response.status(MESSAGES.success.s0.http).send(MESSAGES.success.s0);
            }); 
        });

    });
}