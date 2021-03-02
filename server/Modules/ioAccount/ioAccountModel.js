const mongoose = require("mongoose");
const CONFIG = require("./ioAccountConfig");
let collection = CONFIG.mongodb.collections;

let schema = new mongoose.Schema({
    id: {
        type: String

    },
    name: {
        type: String

    },
    group: {
        type: String

    }

        
});

module.exports = global.MongoConnection_ioDatabase.model(collection.ioaccount, schema, collection.ioaccount);