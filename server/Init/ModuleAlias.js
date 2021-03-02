const moduleAlias = require('module-alias')
module.exports = (callback) => {
    const chalk = require("chalk");
    console.log(chalk.yellow("-- Initializing ModuleAlias"));
    moduleAlias.addAliases({
        '@Sanitize': global.rootPath + '/server/Utils/Sanitize',
        '@Utilities': global.rootPath + '/server/Utils/Utilities',
        '@Generate': global.rootPath + '/server/Utils/Generate',
        '@Encrypt': global.rootPath + '/server/Utils/Encrypt',
        '@Modules': global.rootPath + '/server/Modules'
    });
    return callback();
};