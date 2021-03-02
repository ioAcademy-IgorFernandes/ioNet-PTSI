const ioAccountFunctions = require("./ioAccountFunctions");
const MESSAGES = require("./ioAccountMessages");
const CONFIG = require("./ioAccountConfig");
const ioAccount = require("./ioAccountModel");
const UserFunctions = require("../../Apps/Netin/User/UserFunctions");
const NetinCONFIG = require("../../Apps/Netin/NetinConfig");
const SANITIZE = require("../../Utils/Sanitize");
const async = require("async");
/*
global.checkAuth = (request, response, permission, callback) => {

    let token = request.headers.authorization;
    if (!token && !permission) return callback();
    ioAccount.tokens.validate(token, (error, token, payload) => {
        if (error) return response.header("Authorization", null).status(AUTH_MESSAGES.error.e1.http).send(AUTH_MESSAGES.error.e1);

        response.header("Authorization", token);

        UserFunctions.findById(payload.user_id, (user) => {
            if (!user) return response.header("Authorization", null).status(AUTH_MESSAGES.error.e1.http).send(AUTH_MESSAGES.error.e1);
            request.user = user;
            if (!permission || global.inDev) return callback(user);

            let found = false;

            if (user.permissions_group)
                for (let p of user.permissions_group.permissions) {
                    if (p.name == permission)
                        found = true;
                }

            if (found)
                return callback(user);
            else
                return response.status(AUTH_MESSAGES.error.e2.http).send(AUTH_MESSAGES.error.e2);

        });

    });
}
*/
exports.login = (request, response) => {
    request.check("email", MESSAGES.invalid.i0).isEmail().notEmpty().optional(false);
    request.check("password", MESSAGES.invalid.i1).notEmpty().optional(false).isLength({ min: 8, max: 64 });

    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());
        let clientIP = "127.0.0.1";
        //let clientIP = request.headers['x-forwarded-for'];
        if(NetinCONFIG.authorized_ips.indexOf(clientIP) < 0) return response.status(MESSAGES.error.e4.http).send(MESSAGES.error.e4);

        let email = SANITIZE.whitelist(request.body.email, ["alphabet", "numerical", "allowed"]);
        let password = request.body.password;
        let authResponse = null;
        let getUserInfoResponse = null;
        let getPermissionGroupsResponse = null;
        let hasPermission = false;

        let auth = (callback) => {
            ioAccountFunctions.auth(email, password, (resp) => {
                authResponse = resp;
                return callback();
            });
        }

        let getUserInfo = (callback) => {
            if (authResponse.body.type == "error" || typeof authResponse.body.email !== "undefined") return callback();

            ioAccountFunctions.getUserInfo(authResponse.headers.authorization, (userInfo) => {
                getUserInfoResponse = userInfo;
                return callback();
            });
        }

        let checkPermissions = (callback) => {
            if (!getUserInfoResponse || getUserInfoResponse.body.http != 200) return callback()

            for (let i = 0; i < Object.keys(getUserInfoResponse.body.body.auth.permissions.permissions).length && (hasPermission =! false); i++) {
                if (getUserInfoResponse.body.body.auth.permissions.permissions[i].application == "ioaccount") hasPermission = true;
            }

            return callback()
        }

        let getPermissionGroups = (callback) => {
            if (!hasPermission) return callback()

            ioAccountFunctions.getPermissionGroups(authResponse.headers.authorization, getUserInfoResponse.body.body.auth.permissions.group, (res)=>{
                getPermissionGroupsResponse = res;
                return callback()
            });
        }

        async.waterfall([auth, getUserInfo, checkPermissions, getPermissionGroups], () => {
            if (authResponse.body.type == "error" || typeof authResponse.body.email !== "undefined") return response.status(200).send(authResponse.body);
            if (getUserInfoResponse.body.http != 200) return response.status(200).send(getUserInfoResponse.body);
            if (!hasPermission) return response.status(MESSAGES.error.e4.http).send(MESSAGES.error.e4);
            if (getPermissionGroupsResponse.body.http != 200) return response.status(200).send(getPermissionGroupsResponse.body);

            getUserInfoResponse.body.body.auth.permissions.groupName = getPermissionGroupsResponse.body.body.name;
            response.setHeader('Authorization', authResponse.headers.authorization);
    
            if(getUserInfoResponse.body.type != "success") return response.send(getUserInfoResponse);  
            
            let id = getUserInfoResponse.body.body.id;
            let name = getUserInfoResponse.body.body.info.name;
            let group = getUserInfoResponse.body.body.auth.permissions.groupName;
            let email = getUserInfoResponse.body.body.auth.email;
                                
            UserFunctions.saveUser(id, name, group, email, (userResult)=> {
                if(userResult.name == name && userResult.group == group && userResult.email == email){
                    getUserInfoResponse.body.body.netinId = userResult._id;
                    getUserInfoResponse.body.body.netin_terms = false;
                    if(userResult.terms.length > 0) getUserInfoResponse.body.body.netin_terms = true;

                    return response.status(200).send(getUserInfoResponse.body);
                }else{
                    UserFunctions.updateUser(userResult._id, id, name, group, email, (result) => {
                        getUserInfoResponse.body.body.netinId = userResult._id;
                        getUserInfoResponse.body.body.netin_terms = false;
                        if(userResult.terms.length > 0) getUserInfoResponse.body.body.netin_terms = true;

                        return response.status(200).send(getUserInfoResponse.body);
                    });
                }
            });
        });
    });
}
/*
exports.login = (request, response) => {
    request.check("email", MESSAGES.invalid.i0).isEmail().notEmpty().optional(false);
    request.check("password", MESSAGES.invalid.i1).notEmpty().optional(false).isLength({ min: 8, max: 64 });

    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());
        let clientIP = "127.0.0.1";
        //let clientIP = request.headers['x-forwarded-for'];
        if(NetinCONFIG.authorized_ips.indexOf(clientIP) < 0) return response.status(MESSAGES.error.e4.http).send(MESSAGES.error.e4);

        let email = SANITIZE.whitelist(request.body.email, ["alphabet", "numerical", "allowed"]);
        let password = request.body.password;
        let authResponse = null;
        let getUserInfoResponse = null;
        let getPermissionGroupsResponse = null;
        let hasPermission = false;

        let auth = (callback) => {
            ioAccountFunctions.auth(email, password, (resp) => {
                authResponse = resp;
                return callback();
            });
        }

        let getUserInfo = (callback) => {
            if (authResponse.body.type == "error" || typeof authResponse.body.email !== "undefined") return callback();

            ioAccountFunctions.getUserInfo(authResponse.headers.authorization, (userInfo) => {
                getUserInfoResponse = userInfo;
                return callback();
            });
        }

        let checkPermissions = (callback) => {
            if (getUserInfoResponse.body.http != 200) return callback()

            for (let i = 0; i < Object.keys(getUserInfoResponse.body.body.auth.permissions.permissions).length && (hasPermission =! false); i++) {
                if (getUserInfoResponse.body.body.auth.permissions.permissions[i].application == "ioaccount") hasPermission = true;
            }

            return callback()
        }

        let getPermissionGroups = (callback) => {
            if (!hasPermission) return callback()

            ioAccountFunctions.getPermissionGroups(authResponse.headers.authorization, getUserInfoResponse.body.body.auth.permissions.group, (res)=>{
                getPermissionGroupsResponse = res;
                return callback()
            });
        }

        async.waterfall([auth, getUserInfo, checkPermissions, getPermissionGroups], () => {
            if (authResponse.body.type == "error" || typeof authResponse.body.email !== "undefined") return response.status(200).send(authResponse.body);
            if (getUserInfoResponse.body.http != 200) return response.status(200).send(getUserInfoResponse.body);
            if (!hasPermission) return response.status(MESSAGES.error.e4.http).send(MESSAGES.error.e4);
            if (getPermissionGroupsResponse.body.http != 200) return response.status(200).send(getPermissionGroupsResponse.body);

            getUserInfoResponse.body.body.auth.permissions.groupName = getPermissionGroupsResponse.body.body.name;
            response.setHeader('Authorization', authResponse.headers.authorization);
    
            if(getUserInfoResponse.body.type != "success") return response.send(getUserInfoResponse);  
            
            let id = getUserInfoResponse.body.body.id;
            let name = getUserInfoResponse.body.body.info.name;
            let group = getUserInfoResponse.body.body.auth.permissions.groupName;
            
            let saveUserResult = null;
            let permission_list = [];

            let updatePermissions = (callback) => {
                let stack = [];

                getUserInfoResponse.body.body.auth.permissions.permissions.forEach(permission => {
                    stack.push(callback => {
                        permission_list.push(permission.permission);
                        return callback();
                    });
                });

                async.parallel(stack, () => {
                    UserFunctions.updatePermissions(id, permission_list, () => {
                        return callback();
                    });
                });
            }

            let saveUser = (callback) => {
                UserFunctions.saveUser(id, name, group, (userResult)=> {
                    saveUserResult = userResult;
                    return callback()
                });
            }

            async.parallel([updatePermissions, saveUser], () => {
                if(saveUserResult.name == name && saveUserResult.group == group){
                    getUserInfoResponse.body.body.netinId = saveUserResult._id;
                    getUserInfoResponse.body.body.netin_terms = false;
                    if(saveUserResult.terms.length > 0) getUserInfoResponse.body.body.netin_terms = true;

                    return response.status(200).send(getUserInfoResponse.body);
                }else{
                    UserFunctions.updateUser(saveUserResult._id, id, name, group, (result) => {
                        getUserInfoResponse.body.body.netinId = saveUserResult._id;
                        getUserInfoResponse.body.body.netin_terms = false;
                        if(saveUserResult.terms.length > 0) getUserInfoResponse.body.body.netin_terms = true;

                        return response.status(200).send(getUserInfoResponse.body);
                    });
                }
            });
        });
    });
}
*/