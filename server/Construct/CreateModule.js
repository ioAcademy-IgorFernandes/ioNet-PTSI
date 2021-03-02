const MODULE_CONFIG = require("./ModuleConfig");
const chalk = require("chalk");
const fs = require("fs");
const mkdirp = require('mkdirp');
const beautify = require('js-beautify').js;

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

let init = async () => {

    let name = await ask("Write the modules name: ");
    let dir = `${MODULE_CONFIG.dir}/${name}`;
    if (!fs.existsSync(dir)) {
        mkdirp.sync(dir);
        createFiles(dir, name);
    } else {
        console.log(chalk.red("ERROR:") + " MODULE ALREADY EXISTS");
        let answer = await ask("Do you wanna add the missing files?(Y/N) ");
        if (answer == "Y" || answer == "y")
            createFiles(dir, name);
        else
            process.exit(0);
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

let createFiles = (dir, name) => {
    for (let file of MODULE_CONFIG.files) {
        if (!fs.existsSync(`${dir}/${name}${file}.js`))
            fs.writeFileSync(`${dir}/${name}${file}.js`, beautify(MODULE_CONFIG.content[file].replaceAll("${MODULE_NAME}", name).replaceAll("${module_name}", name.toLowerCase()), {
                indent_size: 4,
                space_in_empty_paren: true
            }));
    }
    buildModuleJS(dir, name);
}

let buildModuleJS = (dir, name) => {

    let module = {
        middleware: `/${name}Middleware`,
        routes: [{
            path: `/${name.toLowerCase()}`,
            file: `/${name}Route`
        }]
    }

    if (!fs.existsSync(`${dir}/module.js`))
        fs.writeFileSync(`${dir}/module.js`, beautify(`module.exports={ middleware: "/${name}Middleware", routes: [{ path: "/${name.toLowerCase()}", file: "/${name}Route" }] }`, {
            indent_size: 4,
            space_in_empty_paren: true
        }));

    console.log(chalk.green("SUCCESS:") + " Module created on '" + dir + "'");

}

init();