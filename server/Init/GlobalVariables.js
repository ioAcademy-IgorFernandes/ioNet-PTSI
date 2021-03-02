module.exports = (callback) => {
    const chalk = require("chalk");
    console.log(chalk.yellow("-- Initializing GlobalVariables"));
    global.path_config = global.rootPath + "/server/Config";
    global.path_modules = global.rootPath + "/server/Modules";
    global.path_apps = global.rootPath + "/server/Apps";
    global.sendEmail = true;
    global.proEmail = true;
    return callback();
};