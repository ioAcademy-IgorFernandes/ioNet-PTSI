module.exports = (app, callback) => {
    const chalk = require("chalk");
    console.log(chalk.yellow("-- Initializing Middleware"));
    let expressValidator = require("express-validator");
    let fileUpload = require('express-fileupload');
    app.use(expressValidator());
    app.use(fileUpload());

    let bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

    let settings = {
        //reconnectTries: Number.MAX_VALUE,
        //autoReconnect: true,
        useNewUrlParser: true
    };

    let mongoose = require("mongoose");
    mongoose.set('useCreateIndex', true);
    mongoose.set('useUnifiedTopology', true);
    console.log(chalk.blue("*** Connecting to DBs"));

    if (global.inDev) {

        global.MongoConnection_ioDatabase = mongoose.createConnection(require("../Config/MongoDB").dev_db, settings, (error) => {
            if (error) throw error;
            console.log(chalk.blue("*** Connected to 'devDatabase'"));
            global.MongoConnection_ioTemp = mongoose.createConnection(require("../Config/MongoDB").googleURI_temp, settings, (error) => {
                if (error) throw new Error(error);
                console.log(chalk.blue("*** Connected to 'ioTemp'"));
                return callback();
            });
        });

    } else {
        global.MongoConnection_ioDatabase = mongoose.createConnection(require("../Config/MongoDB").googleURI, settings, (error) => {
            if (error) throw new Error(error);
            console.log(chalk.blue("*** Connected to 'ioDatabase'"));
            global.MongoConnection_ioTemp = mongoose.createConnection(require("../Config/MongoDB").googleURI_temp, settings, (error) => {
                if (error) throw new Error(error);
                console.log(chalk.blue("*** Connected to 'ioTemp'"));
                return callback();
            });
        });
    }


}