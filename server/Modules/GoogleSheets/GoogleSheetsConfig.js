module.exports = {
    mongodb: {
        collections: {
            googlesheets: "googlesheets_test",
            googlesheets_management: "googlesheets_management"
        }
    },
    credentials: {
        "web":
        {
            "client_id": "563765534848-bc5qgei98bmrp1h3vgt4ha36j019osb5.apps.googleusercontent.com",
            "project_id": "quickstart-1583142714840", "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_secret": "HToqgmmoQOOSzJjOqBXhbrf0",
            "redirect_uris": ["urn:ietf:wg:oauth:2.0:oob", "http://localhost"]
        }
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive.readonly'],
    spreadsheet: {
        id: "1iZHHwILeMFcXSEuPfZ1_j5wOh_JPVD2Y0LfWZobbQF0",
        year: 2020,
        ranges: ['Schedule ioTeam!A5:JY29']
    },
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    //interval of time for cron schedule
    cronTime: 3
}