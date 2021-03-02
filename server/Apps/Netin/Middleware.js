const ioAccountFunctions = require("../../Modules/ioAccount/ioAccountFunctions");
const UserFunctions = require("./User/UserFunctions");
const CONFIG = require("./NetinConfig");

exports.checkPermission = (permission, token, clientIP, callback) => {
    let isPermited = false;
    //request.headers['x-forwarded-for']
    clientIP = "127.0.0.1";
    if(CONFIG.authorized_ips.indexOf(clientIP) < 0) return callback(isPermited);
    
    ioAccountFunctions.getUserInfo(token, (permissions) => {
        if(permissions.body.http == 200){
            let permissionsArray = permissions.body.body.auth.permissions.permissions;
        
            permissionsArray.forEach(p => {
                if(p.permission == permission) isPermited = true;
            });

            UserFunctions.findUserByIoAccountId(permissions.body.body.id, (user) => {
                if(!user) return callback(false, null)
                
                return callback(isPermited, user);
            });

            
        }else{
            return callback(isPermited, null);
        }
    });
}