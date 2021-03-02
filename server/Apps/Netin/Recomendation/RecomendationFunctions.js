const Recomendation = require("./RecomendationModel");
const CONFIG = require("../NetinConfig");

exports.save = (idApp, idUser, feedbacks, callback) => {
    let date = new Date;
    feedbacks.forEach((element) => {
        element.date = date;
        element.isActive = true;
    });
    
    const recomendation = new Recomendation({
        idUser: idUser,
        idApplication: idApp,
        feedbacks: feedbacks
    });

    recomendation.save((error, result) => {
        if (error) throw error;
            
        return callback(result);
    });
}

exports.readAll = (callback) => {
    Recomendation.find((error, docs) => {
        if (error) throw error;
        
        return callback(docs);
    }).select('_id idUser idTest feedbacks');
}

exports.readById = (id, callback) => {
    Recomendation.findOne({_id: id}, (error, docs) => {
        if (error) throw error;

        return callback(docs);
    }).select('_id idUser idTest feedbacks');
}

exports.readByIdUser = (idUser, callback) => {
    Recomendation.find({idUser: idUser}, (error, docs) => {
        if (error) throw error;

        return callback(docs);
    }).select('_id idUser idTest feedbacks');
}

exports.readByIdAppIdUser = (idApp, idUser, callback) => {
    Recomendation.findOne({idUser: idUser, idApplication: idApp}, (error, docs) => {
        if (error) throw error;

        return callback(docs);
    }).select('_id idUser idTest feedbacks');
}

exports.readByIdApp = (idApp, callback) => {
    Recomendation.find({idApplication: idApp}, (error, docs) => {
        if (error) throw error;
            
        return callback(docs);
    }).select('_id idUser idTest feedbacks');
}

exports.putRecomendation = (id, feedbacks, callback) => {
    let date = new Date;
    feedbacks.forEach((element) => {
        element.date = date;
        element.isActive = true;
    });

    Recomendation.updateMany({_id: id}, { $push: {feedbacks: feedbacks}}, (error, success) => {
        if (error) throw error;
            
        return callback(success);
    });
}

exports.removeRecomendation = (id, idFeedback, callback) => {

    Recomendation.updateOne({_id: id, "feedbacks._id":idFeedback}, {$set: {'feedbacks.$.isActive': false}}, (error, success) => {
        if (error) throw error;
            
        return callback(success);
    });
}