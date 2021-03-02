const APP_CONFIG = require("./AppConfig");
const chalk = require("chalk");
const fs = require("fs");
const mkdirp = require('mkdirp');
const beautify = require('js-beautify').js;
const Utilities = require("../Utils/Utilities");

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

let routes = [];
let collections = {};

let init = async () => {
    let app_name = await ask("Write the app name: ");
    let dir = `${APP_CONFIG.dir}/${app_name}`;
    if (!fs.existsSync(dir)) {
        mkdirp.sync(dir);
        addFolders(dir, app_name);
    } else {
        console.log(chalk.red("ERROR:") + " APP ALREADY EXISTS");
        let answer = await ask("Do you wanna add a folder?(Y/N) ");
        if (answer == "Y" || answer == "y")
            addFolders(dir, app_name);
        else
            process.exit(0);
    }
}

let addFolders = async (app_dir, app_name) => {

    let name = await ask("Write the folder name (0 to stop): ");
    if (name == 0) {
        buildAppJS(app_dir, app_name)
    } else {
        let dir = `${app_dir}/${name}`;
        if (!fs.existsSync(dir)) {
            mkdirp.sync(dir);
            createFiles(dir, name, app_name);
            routes.push({
                path: `/${app_name.toLowerCase()}/${name.toLowerCase()}`,
                file: `/${name}/${name}Route`
            });
            collections[name.toLowerCase()] = `${app_name.toLowerCase()}_${name.toLowerCase()}`;
            addFolders(app_dir, app_name);
        } else {
            console.log(chalk.red("ERROR:") + " FOLDER ALREADY EXISTS");
            addFolders(app_dir, app_name);
        }
    }
}

let ask = async (sentence) => {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let prompt = (message) => {
        return new Promise((resolve, reject) => {
            rl.question(message, (answer) => {
                resolve(answer);
            });
        });
    }

    let answer = await prompt(sentence);
    rl.close();
    return answer;
}

let createFiles = (dir, name, app_name) => {
    for (let file of APP_CONFIG.files) {
        if (!fs.existsSync(`${dir}/${name}${file}.js`)) {
            let file_content = APP_CONFIG.content[file].replaceAll("${MODULE_NAME}", name).replaceAll("${module_name}", name.toLowerCase());
            fs.writeFileSync(`${dir}/${name}${file}.js`, beautify(file_content.replaceAll("${APP_NAME}", app_name), {
                indent_size: 4,
                space_in_empty_paren: true
            }));
        }

    }
}

let createAppFiles = (dir, app_name) => {
    if (!fs.existsSync(`${dir}/${app_name}Config.js`)) {
        let config = {
            mongodb: {
                collections: {}
            }
        };
        config.mongodb.collections = collections;
        fs.writeFileSync(`${dir}/${app_name}Config.js`, beautify(APP_CONFIG.app_content['Config'].replaceAll("${APP_NAME}", app_name) + JSON.stringify(config), {
            indent_size: 4,
            space_in_empty_paren: true
        }));
    } else {
        let config = getCurrentConfig(dir, app_name);
        config.mongodb.collections = Utilities.joinTwoObjects(config.mongodb.collections, collections);
        fs.writeFileSync(`${dir}/${app_name}Config.js`, beautify(APP_CONFIG.app_content['Config'].replaceAll("${APP_NAME}", app_name) + JSON.stringify(config), {
            indent_size: 4,
            space_in_empty_paren: true
        }));
    }
    if (!fs.existsSync(`${dir}/${app_name}Middleware.js`)) {
        fs.writeFileSync(`${dir}/${app_name}Middleware.js`, beautify(APP_CONFIG.app_content['Middleware'].replaceAll("${APP_NAME}", app_name), {
            indent_size: 4,
            space_in_empty_paren: true
        }));
    }
}

let buildAppJS = (dir, name) => {

    createAppFiles(dir, name);

    if (!fs.existsSync(`${dir}/app.js`)) {
        let app = {
            middleware: `/${name}Middleware`,
            routes: routes
        }

        fs.writeFileSync(`${dir}/app.js`, beautify('module.exports = ' + JSON.stringify(app), {
            indent_size: 4,
            space_in_empty_paren: true
        }));
    } else {
        let app = getCurrentAppJS(dir);
        app.routes = app.routes.concat(routes);
        app.routes = Utilities.remove(app.routes, "path");
        fs.writeFileSync(`${dir}/app.js`, beautify('module.exports = ' + JSON.stringify(app), {
            indent_size: 4,
            space_in_empty_paren: true
        }));
    }
    console.log(chalk.green("SUCCESS:") + " App created on '" + dir + "'");
}

let getCurrentAppJS = (dir) => {
    if (fs.existsSync(`${dir}/app.js`)) {
        let file = fs.readFileSync(`${dir}/app.js`, "utf8");
        let json = file.slice(file.indexOf("{"), file.length);
        return JSON.parse(json);
    } else
        return {};
}

let getCurrentConfig = (dir, app_name) => {
    if (fs.existsSync(`${dir}/${app_name}Config.js`)) {
        let file = fs.readFileSync(`${dir}/${app_name}Config.js`, "utf8");
        let json = file.slice(file.indexOf("{"), file.length);
        return JSON.parse(json);
    } else
        return {};
}

init();