const UserFunctions = require("./UserFunctions");
const CONFIG = require("../NetinConfig");
const MESSAGES = require("./UserMessages");
const ioAccountMessages = require("../../../Modules/ioAccount/ioAccountMessages");
const User = require("./UserModel");
const MIDDLEWARE = require("../Middleware");
const Sanitize = require("@Sanitize");
const ASYNCJS = require("async");
const TermsFunctions = require("../Terms/TermsFunctions");

exports.add = (request, response) => {
    request.check("id", MESSAGES.invalid.i0).notEmpty().optional(false);
    request.check("name", MESSAGES.invalid.i2).notEmpty().optional(false);
    request.check("group", MESSAGES.invalid.i1).notEmpty().optional(false);
    
    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());
        
        let id = request.body.id;
        let name = request.body.name;
        let group = request.body.group;

        MIDDLEWARE.checkPermission("POST_User", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);
                
            UserFunctions.saveUser(id, name, group, (result) => {  
                return response.status(MESSAGES.success.s0.http).send(result);
            });    
        });
    });
};

exports.get = (request, response) => {

    MIDDLEWARE.checkPermission("GET_Users", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
        if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);
          
        UserFunctions.findUsers((users) => {
            if(users) return response.status(MESSAGES.success.s0.http).send(users);

            return response.status(MESSAGES.error.e3.http).send(MESSAGES.error.e3);
        }); 
    });

};

exports.getByID = (request, response) => {
    request.check("idUser", MESSAGES.invalid.i3).notEmpty().optional(false);
    
    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());
        
        let idUser = Sanitize.whitelist(request.params.idUser, ["alphabet", "numerical"]);

        MIDDLEWARE.checkPermission("GET_UserByID", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);
            
            UserFunctions.findUser(idUser, (user) => {
                if(user) return response.status(MESSAGES.success.s0.http).send(user);
                
                return response.status(MESSAGES.error.e3.http).send(MESSAGES.error.e3);
            });
        });
    });
};

exports.getByGroup = (request, response) => {
    request.check("group", MESSAGES.invalid.i1).notEmpty().optional(false);
    
    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());
        
        let group = Sanitize.whitelist(request.params.group, ["alphabet", "numerical"]);

        MIDDLEWARE.checkPermission("GET_UsersByGroup", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);
            
            UserFunctions.findUserByGroup(group, (users) => {
                if(users) return response.status(MESSAGES.success.s0.http).send(users);
                
                return response.status(MESSAGES.error.e3.http).send(MESSAGES.error.e3);
            });
        });   
    });
    
};

exports.update = (request, response) => {
    request.check("idUser", MESSAGES.invalid.i3).notEmpty().optional(false);
    request.check("id", MESSAGES.invalid.i0).notEmpty().optional(false);
    request.check("name", MESSAGES.invalid.i2).notEmpty().optional(false);
    request.check("group", MESSAGES.invalid.i1).notEmpty().optional(false);
    
    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());
        
        let idUser = Sanitize.whitelist(request.params.idUser, ["alphabet", "numerical"]);
        let id = request.body.id;
        let name = request.body.name;
        let group = request.body.group;

        MIDDLEWARE.checkPermission("PUT_User", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);
                
            UserFunctions.updateUser(idUser, id, name, group, (result) => {
                if(result) return response.status(MESSAGES.success.s2.http).send(MESSAGES.success.s2);
                        
                return response.status(MESSAGES.error.e4.http).send(MESSAGES.error.e4);
            });
        });
    });
};

exports.updateTerms = (request, response) => {
    request.check("idUser", MESSAGES.invalid.i3).notEmpty().optional(false);
    request.check("terms", MESSAGES.invalid.i0).notEmpty().isArray().optional(false);
    
    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());
        
        let idUser = Sanitize.whitelist(request.params.idUser, ["alphabet", "numerical"]);
        let terms = request.body.terms;
        let termsId = [];
        let completeTerms = [];
        let associatedTerms = [];

        let findUser = (callback) => {
            UserFunctions.findUser(idUser, (user) => {
                if(!user) return response.status(MESSAGES.invalid.i3.http).send(MESSAGES.invalid.i3);

                return callback();
            });
        }

        let checkTerms = (callback) => {
            let index = 0;
            terms.forEach(term => {
                if(typeof term.term_id !== 'string') return response.status(MESSAGES.invalid.i5.http).send(MESSAGES.invalid.i5);
                if(typeof term.agreed !== 'boolean') return response.status(MESSAGES.invalid.i6.http).send(MESSAGES.invalid.i6);

                termsId.push(term.term_id);
                if(index == terms.length-1) return callback();
                index++;
            });
        }

        let findTerms = (callback) => {
            TermsFunctions.readByIdArray(termsId, (terms) => {
                if(terms.length != termsId.length) return response.status(MESSAGES.invalid.i5.http).send(MESSAGES.invalid.i5);
                
                completeTerms = JSON.parse(JSON.stringify(terms));
                return callback();
            });
        }
        
        let associateTerms = (callback) => {
            let index = 0;
            completeTerms.forEach(term => {
                let termIndex = terms.map((t) => { return t.term_id; }).indexOf(term._id);
                term.term_agreed = terms[termIndex].agreed;

                associatedTerms.push(term);

                if(index == terms.length-1) return callback();
                index++;
            });
        }

        ASYNCJS.waterfall([findUser, checkTerms, findTerms, associateTerms], () => {
            MIDDLEWARE.checkPermission("GET_ApplicationByPermittedUser", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
                if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);
                
                UserFunctions.updateTerms(idUser, associatedTerms, (result) => {
                    if(result) return response.status(MESSAGES.success.s2.http).send(MESSAGES.success.s2);
                            
                    return response.status(MESSAGES.error.e4.http).send(MESSAGES.error.e4);
                });
            });
            
        });
        
    });
};

exports.remove = (request, response) => {
    request.check("idUser", MESSAGES.invalid.i3).notEmpty().optional(false);
    
    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());
        
        let idUser = Sanitize.whitelist(request.params.idUser, ["alphabet", "numerical"]);

        MIDDLEWARE.checkPermission("DELETE_User", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);
                
            UserFunctions.removeUser(idUser, (result) => {
                if(result) return response.status(MESSAGES.success.s3.http).send(MESSAGES.success.s3);
                
                return response.status(MESSAGES.error.e4.http).send(MESSAGES.error.e4);
            });
        });
    });
    
};

exports.getAuthenticatedUser = (request, response) => {

    MIDDLEWARE.checkPermission("GET_UserByID", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
        if(!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);
          
        UserFunctions.findUser(userId, (user) => {
            if(user) return response.status(MESSAGES.success.s0.http).send(user);
            
            return response.status(MESSAGES.error.e3.http).send(MESSAGES.error.e3);
        });
    });

};