module.exports = (app, callback) => {
    const chalk = require("chalk");
    console.log(chalk.yellow("-- Initializing HeaderReader"));

    const allowed_languages = require("../Config/Init").languages;

    app.use((request, response, callback) => {
        let language = request.headers.language;
        
        let found = false;
        if (language) {
            allowed_languages.forEach(lang => {
                if (language.includes(lang))
                    found = true;
            });
        }

        if (!found)
            request.headers.language = 'pt';

        return callback();
    });

    return callback();



}