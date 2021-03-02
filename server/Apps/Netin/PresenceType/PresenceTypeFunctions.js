const PresenceType = require("./PresenceTypeModel");
const CONFIG = require("../NetinConfig");

exports.find = (callback) => {
    PresenceType.find((error,result) => {
        if (error) throw error;
            
        return callback(result);
    })
};

exports.findActive = (callback) => {
    PresenceType.find({isActive:true}, (error, result)=>{
        if (error) throw error;

        return callback(result);
    })
};

exports.findById = (id, callback) => {
    PresenceType.findOne({_id:id}, (error, result)=>{
        if (error) throw error;

        return callback(result);
    })
};

exports.save = (name, description, callback) => {
    
    const Type = new PresenceType({
        name: name,
        description: description,
        isActive: true
    });

    Type.save((error, result) => {
        if(error) throw error;

        return callback(result);
    })
};

exports.deleteL = (id, callback) => {
    PresenceType.updateOne({_id:id}, {isActive: false}, (error, docs) => {
        if (error) throw error;
            
        return callback(docs);
    });
};

exports.activateType = (id, callback) => {
    PresenceType.updateOne({_id:id}, {isActive: true}, (error, docs) => {
        if (error) throw error;
            
        return callback(docs);
    });
};