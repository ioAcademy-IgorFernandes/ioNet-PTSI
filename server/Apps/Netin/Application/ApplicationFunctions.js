const Application = require("./ApplicationModel");
const CONFIG = require("../NetinConfig");
const MESSAGES = require("./ApplicationMessages");


exports.save = (application, version, url, callback) => {
    let creation_date = new Date;

    const app = new Application({
        application: application,
        version: version,
        creation_date: creation_date,
        url: url,
        isActive: true
    });

    app.save((error, result) => {
        if (error) throw error;
        
        return callback(result);
    });
}

exports.readAll = (callback) => {
    Application.find((error, docs) => {
        if (error) throw error;
        
        return callback(docs);  
    }).select('_id application url version creation_date isActive');
}

exports.readActive = (callback) => {
    Application.find({isActive: true}, (error, docs) => {
        if (error) throw error;

        return callback(docs);
    }).select('_id application url version creation_date');
}


exports.readById = (id, callback) => {  
    Application.findOne({_id: id}, (error, docs) => {
        if (error) throw error;
            
        return callback(docs);
    }).select('_id application url version creation_date isActive');
}

exports.readByIdArray = (array, callback) => {
    Application.find({$or:[{"_id":{"$in":array}}]}, (error, docs) => {
        if (error) throw error;
        
        return callback(docs);
    }).select('_id application url version creation_date isActive');
}

exports.update = (id, application, version, url, callback) => {
    let app = {};
    app.application = application;
    app.version = version;
    app.url = url;
    let idApp = {_id: id}

    Application.updateOne(idApp, app, (error, result) => {
        if (error) throw error;
        
        return callback(result);
    });
}

exports.remove = (id, callback) => {
    let idApp = {_id: id};
    let app = {};
    app.isActive = false;

    Application.updateOne(idApp, app, (error, result) => {
        if (error) throw error;
        
        return callback(result);
    });
}