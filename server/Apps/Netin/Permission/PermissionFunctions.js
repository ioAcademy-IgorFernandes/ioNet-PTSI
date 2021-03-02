const Permission = require("./PermissionModel");
const CONFIG = require("../NetinConfig");


exports.savePermission = (idApp, idUser, callback) => {

    const permission = new Permission({
        idApp: idApp,
        idUsers: {idUser:idUser}
    });

    permission.save((error, result) => {
        if(error) throw error;

        return callback(result);
    })
};

exports.findPermissions = (callback) => {
    Permission.find((error,result) => {
        if (error) throw error;
            
        return callback(result);
    })
};

exports.findPermissionByApp = (idApp, callback) => {
    
    Permission.find({idApp:idApp}, (error,docs) => {
        if (error) throw error;
            
        return callback(docs);
    });
};

exports.findPermissionByAppUserID = (idApp, user_id, callback) => {
    
    Permission.find({idApp:idApp, "idUsers": { $elemMatch: { idUser: user_id} }}, (error,docs) => {
        if (error) throw error;
            
        return callback(docs);
    });
};

exports.findPermission = (id, callback) => {

    Permission.findOne({_id:id}, (error, result)=>{
        if (error) throw error;

        return callback(result);
    })
};

exports.addUserPermission = (id, idUser, callback) => {

    Permission.updateOne({_id:id}, {$push: {'idUsers': {idUser:idUser}}}, (error,docs) => {
        if (error) throw error;
            
        return callback(docs);
    });
};

exports.removeUserPermission = (idPermission, idUser, callback) => {

    Permission.updateOne({_id:idPermission}, {$pull: {'idUsers': {idUser: idUser}}}, (error, docs) => {
        if (error) throw error;
            
        return callback(docs);
    });
};

exports.findPermissionsByUserId = (idUser, callback) => {

    Permission.find({ "idUsers": { $elemMatch: { idUser: idUser} } }, (error, docs) => {
        if (error) throw error;
            
        return callback(docs);
    });
};