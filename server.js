const express = require("express");
const app = express();
const chalk = require("chalk");
const Asyncjs = require("async");

global.inDev = true;
global.rootPath = __dirname;

if (!process.env.PORT)
    process.env.PORT = 8081
if (!process.env.IP)
    process.env.IP = "0.0.0.0"

Asyncjs.waterfall([
    require("./server/Init/ModuleAlias"),
    callback => require("./server/Init/Cors")(app, callback),
    callback => require("./server/Init/HeaderReader")(app, callback),
    callback => require("./server/Init/ioReporter")(app, callback),
    require("./server/Init/GlobalVariables"),
    callback => require("./server/Init/Middleware")(app, callback),
    callback => require("./server/Init/Sniffer")(app, callback),
    callback => require("./server/Init/FileReader")(app, callback),
    require("./server/Init/Cron"),
    require("./server/Init/PackageForcer")
], () => {
    app.listen(process.env.PORT || 8080, process.env.IP || "0.0.0.0", () => {
        console.log(chalk.green("Server listening on: ") + chalk.red(process.env.IP + ":" + process.env.PORT));
    });
});