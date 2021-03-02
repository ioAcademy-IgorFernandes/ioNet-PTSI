const ClickupFunctions = require("./ClickupFunctions");
const MESSAGES = require("./ClickupMessages");
const CONFIG = require("./ClickupConfig");
const Clickup = require("./ClickupModel");
const ioAccountMessages = require("../../Modules/ioAccount/ioAccountMessages");
const MIDDLEWARE = require("../../Apps/Netin/Middleware");
const ASYNCJS = require("async");
const chalk = require('chalk');
const UserFunctions = require("../../Apps/Netin/User/UserFunctions");

exports.synchronize = (callback) => {
    let credentials = null;
    let teams = [];
    let current_date = new Date();
    current_date.setHours(0)
    current_date.setMinutes(0)
    current_date.setSeconds(0)
    current_date.setMilliseconds(0)

    let getCredentials = (callback) => {
        ClickupFunctions.authUser(null, 'api', (_credentials) => {
            credentials = _credentials;
            if (typeof credentials.url !== 'undefined' && credentials.url) console.log(chalk.hex('#ff0000').underline.bold("Clickup Credentials Error!"));
            return callback();
        });
    }

    let getTeams = (callback) => {
        ClickupFunctions.getTeams(credentials.token.access_token, (_teams) => {
            teams = _teams.teams
            if (!teams) console.log(chalk.hex('#ff0000').underline.bold("No Teams Found @ CLickup!"));
            return callback();
        });
    }

    let deleteTaskRecords = (callback) => {
        ClickupFunctions.deleteTaskRecords((_records) => {
            return callback();
        });
    }

    ASYNCJS.waterfall([getCredentials, getTeams, deleteTaskRecords], () => {
        if (typeof credentials.url !== 'undefined' && credentials.url) return callback();
        if (!teams) return callback();
        
        let stackTeams = [];

        teams.forEach(team => {
            stackTeams.push(callback => {

                ClickupFunctions.getSpaces(credentials.token.access_token, team.id, false, (_spaces) => {
                    let stackSpaces = [];
                    
                    _spaces.spaces.forEach(space => {
                        stackSpaces.push(callback => {

                            ClickupFunctions.getFolders(credentials.token.access_token, space.id, false, (_folders) => {
                                let stackFolders = [];
                                _folders.folders.forEach(folder => {
                                    stackFolders.push(callback => {

                                        ClickupFunctions.getLists(credentials.token.access_token, folder.id, false, (_lists) => {
                                            let stackLists = [];

                                            _lists.lists.forEach(list => {
                                                stackLists.push(callback => {
                                                    //console.log(list)
                                                    ClickupFunctions.getTasks(credentials.token.access_token, list.id, false, (_tasks) => {
                                                        let stackTasks = [];

                                                        _tasks.tasks.forEach(task => {
                                                            stackTasks.push(callback => {
                                                                let task_date = new Date(Number(task.due_date));
                                                                let assignees = [];
                                                                //if(task.due_date == null || task_date < current_date) return callback()
                                                                if(task.project.id == '4500899' 
                                                                    || task.status.status == 'ready'
                                                                    || task.status.status == 'staged'
                                                                    || task.status.status == 'review'
                                                                    || task.status.status == 'in progress'
                                                                    || task.status.status == 'pending') return callback();

                                                                    
                                                                let findAssignees = (callback) => {
                                                                    let stackAssignees = [];
                                                                    task.assignees.forEach(assignee => {
                                                                        stackAssignees.push(callback => {
                                                                            UserFunctions.findByEmail(assignee.email, (_user) => {
                                                                                if(_user) assignees.push(_user._id)
                                                                                
                                                                                return callback();
                                                                            });
                                                                        })
                                                                    });

                                                                    ASYNCJS.parallel(stackAssignees, () => {
                                                                        return callback();
                                                                    });
                                                                }

                                                                let saveTask = (callback) => {
                                                                    ClickupFunctions.saveTaskRecord(assignees, task, (task_record) => {
                                                                        return callback()
                                                                    });
                                                                }
                                                                
                                                                ASYNCJS.waterfall([findAssignees, saveTask], () => {
                                                                    return callback()
                                                                });
                                                            });
                                                        });

                                                        ASYNCJS.parallel(stackTasks, () => {
                                                            return callback()
                                                        });
                                                    });

                                                });
                                            });

                                            ASYNCJS.parallel(stackLists, () => {
                                                return callback()
                                            });
                                        });

                                    });
                                });

                                ASYNCJS.parallel(stackFolders, () => {
                                    return callback()
                                });

                            });
                            
                        });
                    });

                    ASYNCJS.parallel(stackSpaces, () => {
                        return callback()
                    });

                });

            });
        });

        ASYNCJS.parallel(stackTeams, () => {
            console.log(chalk.hex('#ff6a00').underline.bold("Clickup Tasks Updated @ Netin Database"));
            return callback();
        });
    });
}

exports.updateToken = (request, response) => {
    request.check("code", MESSAGES.invalid.i0).notEmpty().optional(false);

    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());

        let code = request.body.code;

        MIDDLEWARE.checkPermission("GET_Calendars", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if (!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);

            ASYNCJS.parallel([], () => {
                ClickupFunctions.storeToken(userId._id, code, (credentials) => {
                    if (!credentials || credentials.url) return response.status(200).send(credentials);
                    return response.status(MESSAGES.success.s0.http).send(MESSAGES.success.s0);
                });
            });
        });
    });
}

exports.getUserInfo = (request, response) => {
    MIDDLEWARE.checkPermission("GET_Calendars", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
        if (!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);

        ASYNCJS.parallel([], () => {
            ClickupFunctions.authUser(userId._id, 'user', (credentials) => {
                if (typeof credentials.url !== 'undefined' && credentials.url) return response.status(200).send(credentials);

                ClickupFunctions.getAuthorizedUser(credentials.token.access_token, (_authorized_user) => {
                    if (!_authorized_user) return response.status(200).send(_authorized_user);
                    return response.status(200).send(_authorized_user);
                });
            });
        });
    });
}

exports.getTeams = (request, response) => {
    MIDDLEWARE.checkPermission("GET_Calendars", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
        if (!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);

        ASYNCJS.parallel([], () => {
            ClickupFunctions.authUser(userId._id, 'user', (credentials) => {
                if (typeof credentials.url !== 'undefined' && credentials.url) return response.status(200).send(credentials);

                ClickupFunctions.getTeams(credentials.token.access_token, (_teams) => {
                    if (!_teams) return response.status(200).send(_teams);
                    return response.status(200).send(_teams);
                });
            });
        });
    });
}

exports.getSpaces = (request, response) => {
    request.check("team_id", MESSAGES.invalid.i1).notEmpty().optional(false);
    request.check("is_archived", MESSAGES.invalid.i2).notEmpty().optional(false).isBoolean();

    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());

        let team_id = request.params.team_id;
        let is_archived = request.params.is_archived;

        MIDDLEWARE.checkPermission("GET_Calendars", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if (!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);

            ASYNCJS.parallel([], () => {
                ClickupFunctions.authUser(userId._id, 'user', (credentials) => {
                    if (typeof credentials.url !== 'undefined' && credentials.url) return response.status(200).send(credentials);

                    ClickupFunctions.getSpaces(credentials.token.access_token, team_id, is_archived, (_spaces) => {
                        if (!_spaces) return response.status(200).send(_spaces);
                        return response.status(200).send(_spaces);
                    });
                });
            });
        });
    });
}

exports.getFolders = (request, response) => {
    request.check("space_id", MESSAGES.invalid.i3).notEmpty().optional(false);
    request.check("is_archived", MESSAGES.invalid.i2).notEmpty().optional(false).isBoolean();

    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());

        let space_id = request.params.space_id;
        let is_archived = request.params.is_archived;

        MIDDLEWARE.checkPermission("GET_Calendars", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if (!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);

            ASYNCJS.parallel([], () => {
                ClickupFunctions.authUser(userId._id, 'user', (credentials) => {
                    if (typeof credentials.url !== 'undefined' && credentials.url) return response.status(200).send(credentials);

                    ClickupFunctions.getFolders(credentials.token.access_token, space_id, is_archived, (_folders) => {
                        if (!_folders) return response.status(200).send(_folders);
                        return response.status(200).send(_folders);
                    });
                });
            });
        });
    });
}

exports.getLists = (request, response) => {
    request.check("folder_id", MESSAGES.invalid.i4).notEmpty().optional(false);
    request.check("is_archived", MESSAGES.invalid.i2).notEmpty().optional(false).isBoolean();

    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());

        let folder_id = request.params.folder_id;
        let is_archived = request.params.is_archived;

        MIDDLEWARE.checkPermission("GET_Calendars", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if (!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);

            ASYNCJS.parallel([], () => {
                ClickupFunctions.authUser(userId._id, 'user', (credentials) => {
                    if (typeof credentials.url !== 'undefined' && credentials.url) return response.status(200).send(credentials);

                    ClickupFunctions.getLists(credentials.token.access_token, folder_id, is_archived, (_lists) => {
                        if (!_lists) return response.status(200).send(_lists);
                        return response.status(200).send(_lists);
                    });
                });
            });
        });
    });
}

exports.getTasks = (request, response) => {
    request.check("list_id", MESSAGES.invalid.i4).notEmpty().optional(false);
    request.check("is_archived", MESSAGES.invalid.i2).notEmpty().optional(false).isBoolean();

    request.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) return response.status(406).send(validationResult.mapped());

        let list_id = request.params.list_id;
        let is_archived = request.params.is_archived;

        MIDDLEWARE.checkPermission("GET_Calendars", request.headers.authorization, request.headers['x-forwarded-for'], (permissions, userId) => {
            if (!permissions || !userId) return response.status(ioAccountMessages.error.e4.http).send(ioAccountMessages.error.e4);

            ASYNCJS.parallel([], () => {
                ClickupFunctions.authUser(userId._id, 'user', (credentials) => {
                    if (typeof credentials.url !== 'undefined' && credentials.url) return response.status(200).send(credentials);

                    ClickupFunctions.getTasks(credentials.token.access_token, list_id, is_archived, (_tasks) => {
                        if (!_tasks) return response.status(200).send(_tasks);
                        return response.status(200).send(_tasks);
                    });
                });
            });
        });
    });
}