const User = require("./UserModel");
const CONFIG = require("../NetinConfig");

let verifyUserId = (id, callback) => {
    User.findOne( {id: id },(error, result) => {
        if(error) throw error;

        callback(result);
    });
};

exports.saveUser = (id, name, group, email, callback) => {
	let newUser = new User({
        id: id,                
        name: name,
        group: group,
        email: email,
        terms: []
    });
	verifyUserId(id, (user) =>{
        if (user) return callback(user);     
        
        newUser.save((error, result) => {      
            if (error) throw error;

            verifyUserId(id, (user)=>{
                return callback(user);
            });
        });
    });
};

exports.findUsers = (callback) => {
    User.find((error, docs) => {
        if (error) throw error;

        return callback(docs);
    });
};

exports.findUser = (id, callback) => {

    User.findOne({_id : id}, (error, docs) => {
        if (error) throw error;

        return callback(docs);
    });
};

exports.findUserByIoAccountId = (ioaccountId, callback) => {

    User.findOne({id : ioaccountId}, (error, docs) => {
        if (error) throw error;

        return callback(docs);
    });
};

exports.findByEmail = (email, callback) => {

    User.findOne({email}, (error, docs) => {
        if (error) throw error;

        return callback(docs);
    });
};

exports.findUserByGroup = (group, callback) => {
    
    User.find({group : group}, (error, docs) => {
        if (error) throw error;

        return callback(docs);
    });
};

exports.findByIdArray = (array, callback) => {
    
    User.find({$or:[{"_id":{"$in":array}}]}, (error, docs) => {
        if (error) throw error;
        
        return callback(docs);
    });
}

exports.updateUser = (idUser, id, name, group, email, callback) => {
    User.updateOne(
        {_id : idUser}, 
        {id:id, name:name, group:group, email: email}, 
    (error, result) =>{
        if (error) throw error;
            
        return callback(result); 
    });
};

exports.updateTerms = (idUser, terms, callback) => {
    
    User.updateOne({_id : idUser}, {$push: {'terms': terms}}, (error, result) =>{
        if (error) throw error;
            
        return callback(result); 
    });
};

exports.updatePermissions = (ioaccountId, permissions, callback) => {
    
    User.updateOne({id: ioaccountId}, {permissions: permissions}, (error, result) =>{
        if (error) throw error;
            
        return callback(result); 
    });
};

exports.removeUser = (idUser, callback) => {

    User.deleteOne({_id : idUser}, (error, result) => {
        if (error) throw error;
            
        return callback(result);
    });
}