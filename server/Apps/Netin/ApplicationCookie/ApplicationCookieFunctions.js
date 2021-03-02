const ApplicationCookie = require("./ApplicationCookieModel");
const CONFIG = require("../NetinConfig");
const GERERATE = require("../../../Utils/Generate");

exports.save = (user_id, application_id, application_url, callback) => {
    let cookie = GERERATE.generateID(64);
    let creation_date = new Date();
    let expiration_date = new Date().setDate(creation_date.getDate()+7);

    const AppCookie = new ApplicationCookie({
        user_id,
        application_id,
        application_url,
        cookie,
        creation_date,
        expiration_date,
        active: true
    });

    AppCookie.save((error, result) => {
        if (error) throw error;
        
        return callback(result);
    });
}
/*
exports.readActive = (callback) => {
    Terms.find({active: true}).sort({number:1})
    .then(result => {
        return callback(result);
    }).catch(error => {throw error;})
}
*/
exports.readByUserIdAppId = (user_id, application_id, callback) => {
    ApplicationCookie.find({
        user_id,
        application_id,
        active: true
    }, (error, result) => {
        if (error) throw error;

        return callback(result);
    });
}

exports.readByCookie = (cookie, callback) => {
    ApplicationCookie.findOne({
        cookie,
        active: true
    }, (error, result) => {
        if (error) throw error;

        return callback(result);
    });
}

exports.deactivate = (user_id, application_id, callback) => {

    ApplicationCookie.updateOne({
        user_id,
        application_id,
        active: true
    }, {
        active: false
    }, (error, result) => {
        if (error) throw error;
        
        return callback(result);
    });
}