module.exports = (app, callback) => {
    const chalk = require("chalk");
    console.log(chalk.yellow("-- Initializing CORS"));
    const permittedLinker = require("../Config/Init").cors.allowed;

    const cors = require("cors");
    app.use(cors());
    app.options('*', cors());

    app.use((request, response, callback) => {

        response.header('Access-Control-Allow-Origin', '*');
        response.header('Access-Control-Allow-Methods',
            'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        response.header('Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept, Authorization, Language');
        response.header('Access-Control-Expose-Headers', 'Authorization, Language');

        if (!global.inDev) {
            let referer = null;
            if (request.headers.referer)
                referer = request.headers.referer;
            else if (request.headers.origin)
                referer = request.headers.origin;
            else if (request.headers.host)
                referer = request.headers.host;

            referer += request.path;

            let found = false;

            if (referer) {
                permittedLinker.forEach(link => {
                    if (referer.includes(link))
                        found = true;
                });
            }
            if (!found)
                response.status(404).sendFile(global.rootPath + '/iopages/index_wait.html');
            else
                return callback();
        } else
            return callback();

    });

    return callback();



}