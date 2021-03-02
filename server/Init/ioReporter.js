module.exports = (app, callback) => {
    const chalk = require("chalk");
    console.log(chalk.yellow("-- Initializing ioReporter"));

    if (!global.inDev) {

        app.use((request, response, callback) => {
            process.on('unhandledRejection', (reason, location) => {
                unhandledRejection(reason, location);
            });

            process.on('uncaughtException', error => {
                uncaughtException(error, request, response);
            });

            response.on('finish', () => {
                process.removeAllListeners();
            });

            return callback();

        });
    }

    app.post("/app/error", uncaughtExceptionFromApp);

    return callback();

}

const CRASH_MESSAGE = {
    message: {
        http: 500,
        code: "ServerError",
        type: "error"
    }
};

const SLACK_CONFIG = require("../Config/Slack");

const slack_node = require('slack-node');

let getRemoteAddress = (request) => {
    return request.headers['x-forwarded-for'] || request.ip || request._remoteAddress || request.connection && request.connection.remoteAddress || undefined;
}

let createCodeBlock = (title, code) => {
    if (!code) return '';
    code = typeof code === 'string' ? code.trim() : JSON.stringify(code, null, 2);
    let tripleBackticks = '```';
    return '_' + title + '_' + tripleBackticks + code + tripleBackticks + '\n';
}

let secToHHMMSS = (sec) => {
    let sec_num = parseInt(sec, 10);
    let days = Math.floor(sec_num / 86400);
    let hours = Math.floor((sec_num - (days * 86400)) / 3600);
    let minutes = Math.floor((sec_num - (days * 86400) - (hours * 3600)) / 60);
    let seconds = sec_num - (days * 86400) - (hours * 3600) - (minutes * 60);

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return days + " days - " + hours + ':' + minutes + ':' + seconds;
}

let uncaughtException = (error, request, response) => {
    let slack = new slack_node().setWebhook(SLACK_CONFIG.webhooks.api);
    let req = {
        method: request.method,
        url: request.url,
        headers: request.headers,
        query: request.query,
        body: request.body || {}
    };

    let referer = null;
    if (request.headers.referer)
        referer = request.headers.referer;
    else if (request.headers.origin)
        referer = request.headers.origin;
    else if (request.headers.host)
        referer = request.headers.host;

    let attachment = {
        fallback: error.name + ': ' + error.message,
        color: 'danger',
        author_name: referer,
        title: error.name + ': ' + error.message,
        fields: [{
                title: 'Request URL',
                value: request.originalUrl,
                short: true
            }, {
                title: 'Request Method',
                value: request.method,
                short: true
            }, {
                title: 'Status Code',
                value: error.status,
                short: true
            }, {
                title: 'Remote Address',
                value: getRemoteAddress(request),
                short: true
            },
            {
                title: 'Up Time',
                value: secToHHMMSS(process.uptime()),
                short: true
            }
        ],
        text: [{
            title: 'Stack',
            code: error.stack
        }, {
            title: 'Request',
            code: req
        }],
        mrkdwn_in: ['text'],
        footer: 'ioReporter',
        ts: parseInt(Date.now() / 1000)
    }
    attachment.text = attachment.text.map((data) => {
        return createCodeBlock(data.title, data.code);
    }).join('');

    slack.webhook({
        attachments: [attachment]
    }, (error) => {
        if (error) console.error(error);
        try {
            response.status(CRASH_MESSAGE.message.http).send(CRASH_MESSAGE.message);

        } catch (error) {}
    });
}

let uncaughtExceptionNoRequest = (error) => {
    let slack = new slack_node().setWebhook(SLACK_CONFIG.webhooks.api);
    let attachment = {
        fallback: error.name + ': ' + error.message,
        color: 'danger',
        author_name: "ioAPI",
        title: error.name + ': ' + error.message,
        fields: [{
                title: 'Status Code',
                value: error.status,
                short: true
            },
            {
                title: 'Up Time',
                value: secToHHMMSS(process.uptime()),
                short: true
            }
        ],
        text: [{
            title: 'Stack',
            code: error.stack
        }],
        mrkdwn_in: ['text'],
        footer: 'ioReporter',
        ts: parseInt(Date.now() / 1000)
    }
    attachment.text = attachment.text.map((data) => {
        return createCodeBlock(data.title, data.code);
    }).join('');

    slack.webhook({
        attachments: [attachment]
    }, (error) => {
        if (error) console.error(error);
    });
}

let uncaughtExceptionFromApp = (request, response) => {

    let slack = new slack_node().setWebhook(SLACK_CONFIG.webhooks.app);

    let referer = "Unknown";
    if (request.headers.referer)
        referer = request.headers.referer;
    else if (request.headers.origin)
        referer = request.headers.origin;
    else if (request.headers.host)
        referer = request.headers.host;

    let error = request.body.error;
    let line = request.body.line;
    let url = request.body.url;

    let attachment = {
        fallback: "fallback",
        color: 'danger',
        author_name: referer,
        title: error,
        fields: [{
            title: 'Line',
            value: line,
            short: true
        }],
        text: [{
                title: 'Stack',
                code: error
            },
            {
                title: 'Location',
                code: url
            }
        ],
        mrkdwn_in: ['text'],
        footer: 'ioReporter',
        ts: parseInt(Date.now() / 1000)
    }
    attachment.text = attachment.text.map((data) => {
        return createCodeBlock(data.title, data.code);
    }).join('');

    slack.webhook({
        attachments: [attachment]
    }, (error) => {
        if (error) console.error(error);
        response.sendStatus(200)
    });
}

let unhandledRejection = (reason, location) => {
    let slack = new slack_node().setWebhook(SLACK_CONFIG.webhooks.api);
    let attachment = {
        fallback: 'Unhandled Rejection',
        color: 'warning',
        author_name: "ioAPI",
        title: 'Unhandled Rejection',
        fields: [],
        text: [{
            title: 'Location',
            code: location
        }, {
            title: 'Reason',
            code: reason
        }],
        mrkdwn_in: ['text'],
        footer: 'ioReporter',
        ts: parseInt(Date.now() / 1000)
    }
    attachment.text = attachment.text.map((data) => {
        return createCodeBlock(data.title, data.code);
    }).join('');

    slack.webhook({
        attachments: [attachment]
    }, (error) => {
        if (error) console.error(error);
    });

}