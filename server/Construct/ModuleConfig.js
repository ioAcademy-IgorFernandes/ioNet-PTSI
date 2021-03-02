module.exports = {
    files: ['Config', 'Route', 'Controller', 'Functions', 'Model', 'Messages', 'Middleware'],
    content: {
        Config: 'module.exports = {mongodb: {collections: { ${module_name}: "${module_name}" }}}',
        Route: "const express = require('express'); const ${MODULE_NAME}Controller = require('./${MODULE_NAME}Controller'); let router = express.Router();\n\nrouter.route('/')\n.post(${MODULE_NAME}Controller.add)\n.get(${MODULE_NAME}Controller.get)\n.put(${MODULE_NAME}Controller.update)\n.delete(${MODULE_NAME}Controller.remove);\n\nmodule.exports = router;",
        Controller: 'const ${MODULE_NAME}Functions = require("./${MODULE_NAME}Functions"); const MESSAGES = require("./${MODULE_NAME}Messages"); const CONFIG = require("./${MODULE_NAME}Config"); const ${MODULE_NAME} = require("./${MODULE_NAME}Model");\n\nexports.add = (request, response) => { }\n\nexports.get = (request, response) => { }\n\nexports.update = (request, response) => { }\n\nexports.remove = (request, response) => { }',
        Functions: 'const CONFIG = require("./${MODULE_NAME}Config"); const ${MODULE_NAME} = require("./${MODULE_NAME}Model");',
        Model: 'const mongoose = require("mongoose"); const CONFIG = require("./${MODULE_NAME}Config"); let collection = CONFIG.mongodb.collections;\n\nlet schema = new mongoose.Schema({ key1: { type: String, unique: false, required: false, default: null }, key2: { type: Number, unique: false, required: false, default: 0 }, key3: { type: [String], unique: false, required: false, default: [] }, key4: { type: String, unique: false, required: false, default: null } });\n\nmodule.exports = global.MongoConnection_ioDatabase.model(collection.${module_name}, schema, collection.${module_name});',
        Messages: 'module.exports = { success: { s0: { http: 200, code: "SomethingDone", type: "success" } }, error: { e0: { http: 406, code: "Something invalid", type: "error" } } }',
        Middleware: "module.exports = (app) => {}",
    },
    dir: __dirname + '/../Modules'
}