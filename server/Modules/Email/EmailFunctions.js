// PACKAGES
const Handlebars = require("handlebars");
const fs = require("fs");
const Nodemailer = require("nodemailer");
// CONFIG
const EMAIL_CONFIG = require("./EmailConfig");
// MESSAGES
const EMAIL_MESSAGES = require("./EmailMessages");

let email_account;

if (!global.proEmail)
    email_account = EMAIL_CONFIG.account.dev;
else
    email_account = EMAIL_CONFIG.account.pro;

exports.sendEmail = (html, to, subject, callback) => {
    let transporter = Nodemailer.createTransport(email_account);

    let mailOptions = {
        from: "IOTECH - Innovation on Technology <" + email_account.auth.user + ">",
        to: to,
        subject: subject,
        html: html
    }

    transporter.sendMail(mailOptions, (error = null, info = {}) => {
        if (error) {
            console.log(error)
            error = EMAIL_MESSAGES.error.e0;
        } else
            info = EMAIL_MESSAGES.success.s0;
        return callback(error, info);
    });

}

exports.sendEmailFrom = (html, to, from, subject, callback) => {
    let transporter = Nodemailer.createTransport(email_account);

    let mailOptions = {
        from: from,
        to: to,
        subject: subject,
        html: html
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error)
            error = EMAIL_MESSAGES.error.e0;
        else
            info = EMAIL_MESSAGES.success.s0;
        return callback(error, info);
    });

}

exports.buildEmailHTML = (main_template, template, data) => {
    let main = fs.readFileSync(main_template, "utf8");
    let page = fs.readFileSync(template + ".hbs", "utf8");

    let compileTemplate = Handlebars.compile(main);
    let compilePage = compileTemplate({
        body: page
    });

    let compiled = Handlebars.compile(compilePage);
    return compiled(data);
}