const mongoose = require("mongoose");
const CONFIG = require("../NetinConfig");
let collection = CONFIG.mongodb.collections;

let schema = new mongoose.Schema({
    id: {
        type: String,
        require:true
    },
    name: {
        type: String,
        require:true
    },
    email: {
        type: String,
        default: null
    },
    group: {
        type: String,
        require:true
    },
    terms: [{
        number: {
            type: Number,
            unique: false,
            required: false,
            default: null
        },
        description: {
            type: String,
            unique: false,
            required: false,
            default: null
        },
        internal_rule: {
            type: Boolean,
            unique: false,
            required: false,
            default: null
        },
        creation_date: {
            type: Date,
            unique: false,
            required: false,
            default: null
        },
        term_agreed: {
            type: Boolean,
            unique: false,
            required: false,
            default: true
        }
    }],
    /*permissions:{
        type: Array,
        default: null
    }*/
});

module.exports = global.MongoConnection_ioDatabase.model(collection.user, schema, collection.user);