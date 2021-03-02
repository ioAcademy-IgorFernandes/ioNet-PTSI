module.exports = (app, callback) => {
    const chalk = require("chalk");
    console.log(chalk.yellow("-- Initializing Sniffer"));
    const mongoose = require("mongoose");
    const COLLECTION = require("../Config/MongoDB").collection;
    const Utilities = require("@Utilities");
    let schema = new mongoose.Schema({
        origin: {
            type: String,
            default: null
        },
        path: {
            type: String,
            default: null
        },
        language: {
            type: String,
            default: null
        },
        method: {
            type: String,
            default: null
        },
        date: {
            type: Date,
            default: null
        },
        body: {
            type: Object,
            default: {}
        },
        query: {
            type: Object,
            default: {}
        }
    });
    let ioSniffer = global.MongoConnection_ioDatabase.model(COLLECTION.sniffer, schema, COLLECTION.sniffer);
    // if (!global.inDev) {
    app.use((request, response, callback) => {

        let referer = null;
        if (request.headers.referer)
            referer = request.headers.referer;
        else if (request.headers.origin)
            referer = request.headers.origin;
        else if (request.headers.host)
            referer = request.headers.host;

        const deniedOrigins = require("../Config/Init").sniffer.denied;

        let save = true;

        if (referer) {
            deniedOrigins.forEach(link => {
                if (referer.includes(link))
                    save = false;
            });
        }
        const clonedeep = require('lodash.clonedeep')
        let body = clonedeep(request.body);

        try {
            delete body.password;
        } catch (error) {}
        try {
            delete body.auth.password;
        } catch (error) {}

        if (save && referer && request.method != 'OPTIONS') {
            new ioSniffer({
                origin: referer,
                path: request.path,
                language: request.headers.language,
                method: request.method,
                body: body,
                query: request.query,
                date: new Date()

            }).save();
        }

        return callback();

    });
    // }


    return callback();
}