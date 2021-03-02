const Terms = require("./TermsModel");
const CONFIG = require("../NetinConfig");

exports.save = (number, description, internal_rule, callback) => {

    const Term = new Terms({
        number,
        description,
        internal_rule,
        creation_date: new Date(),
        active: true
    });

    Term.save((error, result) => {
        if (error) throw error;
        
        return callback(result);
    });
}

exports.readAll = (callback) => {
    Terms.find((error, result) => {
        if (error) throw error;
        
        return callback(result);  
    })
}

exports.readActive = (callback) => {
    Terms.find({active: true}).sort({number:1})
    .then(result => {
        return callback(result);
    }).catch(error => {throw error;})
}

exports.readByNumber = (number, callback) => {
    Terms.find({
        number: number, 
        active: true
    }, (error, result) => {
        if (error) throw error;

        return callback(result);
    });
}

exports.readByIdArray = (array, callback) => {
    Terms.find({$or:[{"_id":{"$in":array}}]}, (error, result) => {
        if (error) throw error;
        
        return callback(result);
    });
}

exports.remove = (id, callback) => {

    Terms.updateOne({_id: id}, {active: false}, (error, result) => {
        if (error) throw error;
        
        return callback(result);
    });
}