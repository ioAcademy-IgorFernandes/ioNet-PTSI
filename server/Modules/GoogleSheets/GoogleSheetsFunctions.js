const CONFIG = require('./GoogleSheetsConfig');
const { GoogleSheets } = require("./GoogleSheetsModel");
const { Token } = require("./GoogleSheetsModel");
const { API } = require("./GoogleSheetsModel");
const { google } = require('googleapis');
const readline = require('readline');
const User = require("../../Apps/Netin/User/UserModel");
const ASYNCJS = require("async");


// functions of authentication google
exports.authorize = (callback) => {
    const { client_secret, client_id, redirect_uris } = CONFIG.credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    exports.findToken("token", (document) => {
        if (document) {
            let expiryDate = new Date(document.token.expiry_date);
            let nowDate = new Date;
            if (nowDate < expiryDate) {
                oAuth2Client.setCredentials(document.token);
                callback(oAuth2Client);
            } else {
                oAuth2Client.setCredentials(document.token);
                oAuth2Client.refreshAccessToken(function (error, token) {
                    if (error) {
                        exports.getNewToken(oAuth2Client, (result) => {
                            return callback(result);
                        });
                    } else {
                        exports.updateToken(token, (result) => {
                            oAuth2Client.setCredentials(token);
                            return callback(oAuth2Client);
                        });
                    }
                });
            }
        } else {
            return exports.getNewToken(oAuth2Client, callback);
        }
    });
}

exports.getNewToken = (oAuth2Client, callback) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: CONFIG.scopes,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (error, token) => {
            if (error) throw error;

            oAuth2Client.setCredentials(token);
            exports.saveToken(token, (token) => {
                return callback(oAuth2Client);
            });
            
        });
    });
}

// get data from google sheets api
exports.readGoogleSheets = (auth, callback) => {

    const sheets = google.sheets({ version: 'v4', auth });
    sheets.spreadsheets.get({
        spreadsheetId: CONFIG.spreadsheet.id,
        ranges: CONFIG.spreadsheet.ranges,
        includeGridData: true,
    }, (error, sheet) => {
            if (error) throw error;
            return callback(sheet);
    });
}

//save google sheets data on mongodb
exports.saveSheets = (sheet, netinUsers, callback) => {
    let stack = [];
    //console.log(sheet.data.sheets[0].data[0].rowData[0].values[1])
    sheet.data.sheets[0].data[0].rowData.forEach((element) => {
        stack.push(callback => {

            let employee_name = element.values[1].formattedValue;
            //prevent empty data
            if (!employee_name) return callback();
            let year = CONFIG.spreadsheet.year;
            //function to get user_id from netin using is name
            let sheet_id = element.values[0].formattedValue;
            //match name and get netin_id

            let netin_id = null;
            let user = netinUsers.findIndex(element => element.name == employee_name);
            if (netinUsers[user]) netin_id = netinUsers[user]._id.toString();

            //----------------------------------- Month data treatement -----------------------------------------------------------------//
            // initial index for get the array of days for every month, for jannuary the first index is 6
            let init_month = 6;

            // for every month insert or update data
            let stack2 = [];
            
            for (let month = 0; month < 12; month++) {
                stack2.push(callback => {
                    //----------------------------------- employee_work_register -----------------------------------------------------------------//                     
                    let date = new Date(year, (month + 1), 0, 1, 0, 0);
                    //console.log(date)
                    let days_month = date.getDate();
                    let array_days = element.values.slice(init_month, (init_month + days_month));
                    //update index initial with number of days of last month plus 1 that correspondes on sheet to an total
                    init_month += (days_month + 1);

                    //prevent empty data
                    if (array_days.length == 0) return callback()

                    let stack3 = [];
                    let employee_work_register = [];

                    array_days.forEach((day, day_index) => {
                        stack3.push(callback => {
                            if (JSON.stringify(day) === "{}") return callback();
                            date = new Date(year, month, (day_index + 1), 1, 0, 0);
                            //console.log(day)
                            let color = day.effectiveFormat.backgroundColor;
                            let type = colors(color.red, color.green, color.blue);

                            if (type == "null") return callback();

                            let str = '{ "type":"' + type + '", "day":"' + date.toISOString() + '", "day_period":"' + day.formattedValue + '"}';
                            //treatment of blank spaces and undefined values
                            str = str.replace(/ /g, '');
                            str = str.replace(/""/g, '"null"');
                            str = str.replace(/"undefined"/g, '"null"');
                            //console.log(str)
                            employee_work_register.push(JSON.parse(str));
                            return callback();
                        });
                    });

                    ASYNCJS.parallel(stack3, () => {
                        //----------------------------------- Save on MONGO -----------------------------------------------------------------// 
                        // this function save or updates
                        
                        exports.updateModel(sheet_id, netin_id, employee_name, year, (month + 1), employee_work_register, (result) => {
                            return callback(result);
                        });
                    });
                });
            }
            
            ASYNCJS.parallel(stack2, () => {
                return callback();
            });
            //-----------------------------------End Month data treatement -----------------------------------------------------------------//
        })
    });

    ASYNCJS.parallel(stack, () => {
        return callback();
    });
}

exports.insertGoogleSheets = (auth, netin_id, start, end, callback) => {

    let startDate = new Date(start);
    let endDate = new Date(end);

    exports.findUser(netin_id, startDate.getFullYear(), (startDate.getMonth() + 1), (document) => {
        if (document) {

            let str = JSON.stringify(document);
            let json = JSON.parse(str);
            let id = json.sheet_id;
            let startRow = (4 + parseInt(id) - 1);
            //its necessary take milliseconds into days
            let endColumn = ((endDate.getTime() - startDate.getTime()) / (60 * 60 * 24 * 1000));
            let startColumn = 5;

            for (let month = 0; month < startDate.getMonth(); month++) {
                let date = new Date(startDate.getFullYear(), (month + 1), 0);
                let days_month = date.getDate();
                //update index initial with number of days of last month plus 1 that correspondes on sheet to an total
                startColumn += (days_month + 1);
            }


            const request = {
                requests: [{
                    updateCells: {
                        range: {
                            sheetId: 0,
                            startRowIndex: startRow,
                            endRowIndex: (startRow + 1),
                            startColumnIndex: (startColumn + startDate.getDate()),
                            endColumnIndex: (startColumn + startDate.getDate() + endColumn + 1)
                        },
                        rows: [{
                            values: []
                        }],
                        fields: "userEnteredFormat"
                    }
                }]
            };
            //value too be input
            let vacancie = {
                userEnteredFormat: {
                    backgroundColor: { red: 0.6431373, green: 0.7607843, blue: 0.95686275 }
                }
            };

            let weekend = {
                userEnteredFormat: {
                    backgroundColor: { red: 0.9490196, green: 0.9490196, blue: 0.9490196 }
                }
            };

            for (startDate; startDate <= endDate; startDate.setDate(startDate.getDate() + 1)) {
                // set weekends
                if (startDate.getDay() !== 0 && startDate.getDay() !== 6) {
                    request.requests[0].updateCells.rows[0].values.push(vacancie);
                } else {
                    request.requests[0].updateCells.rows[0].values.push(weekend);
                }
            }

            const sheets = google.sheets({ version: 'v4', auth });
            sheets.spreadsheets.batchUpdate({
                spreadsheetId: CONFIG.spreadsheet.id,
                requestBody: request
            }, (error, result) => {
                    if (error) throw error;
                    
                    return callback(result);
            });
        }
    });
}

//colors of spreadsheet: used to prepare data on update
let colors = (red, green, blue, type) => {
    if (red == 0.7137255 && green == 0.84313726 && blue == 0.65882355) {
        type = "IOTech";
        return type;
    } else if (red == 0.94509804 && green == 0.7607843 && blue == 0.19607843) {
        type = "OutIOTech";
        return type;
    } else if (red == 0.7058824 && green == 0.654902 && blue == 0.8392157) {
        type = "Rest";
        return type;
    } else if (red == 0.91764706 && green == 0.6 && blue == 0.6) {
        type = "Training";
        return type;
    } else if (red == 0.6431373 && green == 0.7607843 && blue == 0.95686275) {
        type = "Vacancies";
        return type;
    } else if (red == 0.9490196 && green == 0.9490196 && blue == 0.9490196) {
        type = "Weekend";
        return type;
    } else {
        type = "null";
        return type;
    }
}

// Month Totals
exports.getAVGTotals = (documents, callback) => {

    let allDay = 0;
    let iotech = 0;
    let outiotech = 0;
    let rest = 0;
    let training = 0;
    let vacancies = 0;
    let dissertation = 0;
    let morning = 0;
    let afternoon = 0;
    let riopele = 0;
    let stack = []

    documents.forEach(document => {
        stack.push(callback => {
            document = JSON.stringify(document);
            document.replace(/_/g, '');
            document = JSON.parse(document);
            register = document.employee_work_register;

            allDay += register.filter(element => element.day_period == "X").length;
            iotech += register.filter(element => element.type == "IOTech").length;
            outiotech += register.filter(element => element.type == "OutIOTech").length;
            rest += register.filter(element => element.type == "Rest").length;
            training += register.filter(element => element.type == "Training").length;
            vacancies += register.filter(element => element.type == "Vacancies").length;
            dissertation += register.filter(element => element.day_period == "D").length;
            morning += register.filter(element => element.day_period == "M").length;
            afternoon += register.filter(element => element.day_period == "T").length;
            riopele += register.filter(element => element.day_period == "R").length;
            
            return callback();
        });
    });

    ASYNCJS.parallel(stack, () => {
        allDay = allDay / documents.length;
        iotech = iotech / documents.length;
        outiotech = outiotech / documents.length;
        rest = rest / documents.length;
        training = training / documents.length;
        vacancies = vacancies / documents.length;
        dissertation = dissertation / documents.length;
        morning = morning / documents.length;
        afternoon = afternoon / documents.length;
        riopele = riopele / documents.length;


        let result = {
            AllDay: allDay.toFixed(),
            AM: morning.toFixed(),
            PM: afternoon.toFixed(),
            IOTech: iotech.toFixed(),
            OutIOTech: outiotech.toFixed(),
            Rest: rest.toFixed(),
            Training: training.toFixed(),
            Vacancies: vacancies.toFixed(),
            Dissertation: dissertation.toFixed(),
            Riopele: riopele.toFixed()
        };
        return callback(result);
    });
}

exports.getDay = (date, callback) => {
    GoogleSheets.aggregate([
        { $match: { 'employee_work_register.day': { $eq: date } } },
        { $project: { _id: 0, name: 1, employee_work_register: { $filter: { input: '$employee_work_register', as: 'day', cond: { $eq: ['$$day.day', date] } } } } }
    ], (error, documents) => {
        if (error) throw error;
        return callback(documents);
    });
}

exports.getMonth = (year, month, callback) => {
    GoogleSheets.find({
        year: year,
        month: month
    }, (error, documents) => {
        if (error) throw error;
        return callback(documents);
    });
}

//MODEL FUNCTIONS
//with upsert true this function update if exists, save if not
exports.updateModel = (sheet_id, netin_id, name, year, month, employee_work_register, callback) => {
    GoogleSheets.updateOne({
        sheet_id: sheet_id,
        year: year,
        month: month
    },
        {
            sheet_id: sheet_id,
            netin_id: netin_id,
            name: name,
            year: year,
            month: month,
            employee_work_register: employee_work_register
        },
        {
            upsert: true
        },
        (error, result) => {
            if (error) throw error;
            return callback(result);
        });
}

exports.findUser = (netin_id, year, month, callback) => {
    Token.findOne({
        netin_id: netin_id,
        year: year,
        month: month,
    }, (error, docs) => {
        if (error) throw error;
        return callback(docs);
    });
}

//token 
exports.saveToken = (token,callback) => {
    const model = new Token({
        type: "token",
        token: token
    });
    model.save((error,result) => {
        if (error) throw error;
        return callback(result);
    });
}

exports.findToken = (type, callback) => {
    Token.findOne({
        type: type
    }, (error, docs) => {
            if (error) throw error;
        return callback(docs);
    });
}

exports.updateToken = (token,callback) => {
    Token.updateOne({ type: "token" },
        { token: token },
        { upsert: true },
        (error, result) => {
            if (error) throw error;
            return callback(result);
        });
}

//last leave(savedDate) update to google sheets api
exports.lastUpdate = (callback) => {
    API.findOne({
        type: "api"
    }, (error, docs) => {
        if (error) throw error;
        return callback(docs);
    });
}

exports.updateApi = (date, callback) => {
    API.updateOne({
        type: "api"
    }, {
        type: "api",
        last_update: date
    }, {
        upsert: true
    }, (error,result) => {
            if (error) console.log(error);
            return callback(result);
    });
}

exports.getByEmployeeMonth = (year, month, employee, callback) => {
    GoogleSheets.find({
        year: year,
        month: month,
        name: new RegExp('^' + employee + '$', 'i')
    }, (error, documents) => {
        if (error) throw error;
        return callback(documents);
    });
}