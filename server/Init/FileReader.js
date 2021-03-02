const fs = require('fs');
const chalk = require('chalk');

module.exports = (app, callback) => {
    console.log(chalk.yellow("-- Initializing Apps & Modules"));
    let modules_paths = [];
    let modules = fs.readdirSync(global.path_modules);
    let apps_paths = [];
    let apps = fs.readdirSync(global.path_apps);

    for (let i in modules) {
        let file_path = global.path_modules + "/" + modules[i];
        modules_paths.push(file_path);
    }

    for (let i in apps) {
        let file_path = global.path_apps + "/" + apps[i];
        apps_paths.push(file_path);
    }
    runApp(app, apps_paths, () => {
        runModule(app, modules_paths, () => {
            return callback();
        });
    });
}

let runModule = (app, files_paths, callback) => {

    for (let file_path of files_paths) {
        let module = null;
        try {
            module = require(file_path + "/module");

        } catch (error) {
            console.log(chalk.red(`++ No 'module.js' file found in '${file_path}'`));
        }
        if (module) {
            if (module.routes)
                module.routes.forEach((route) => {
                    app.use(route.path, require(file_path + route.file));
                });
            if (module.middleware)
                require(file_path + module.middleware)(app);
            console.log(chalk.green(`++ Module ready '${file_path}'`));
        }


    }
    return callback();
};

let runApp = (app, files_paths, callback) => {

    for (let file_path of files_paths) {
        let module = null;
        try {
            module = require(file_path + "/app");

        } catch (error) {
            console.log(chalk.red(`++ No 'app.js' file found in '${file_path}'`));
        }
        if (module) {
            if (module.routes)
                module.routes.forEach((route) => {
                    app.use(route.path, require(file_path + route.file));
                });
            if (module.middleware)
                require(file_path + module.middleware)(app);
            console.log(chalk.green(`++ App ready '${file_path}'`));
        }
    }
    return callback();

}