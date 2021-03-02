module.exports = {
    mongodb: {
        collections: {
            factorial_shift: "factorial_shift",
            factorial_leave: "factorial_leave",
            factorial_token: "factorial_token"
        }
    },
    credentials: {
        web: {
            "application_id":"aHDpQUYuNVsUyA2E1o7tzKIZhhBaM0VW4M5RZwA4ohg",
            "client_secret":"Zfgf1NA3igZoaiLzOZEQ__g2EJrsrnvudPC93QLvA_w",
            "auth_uri" : "https://api.factorialhr.com/oauth/authorize",
            "factorial_uri" : "https://api.factorialhr.com",
            "token_uri":"https://api.factorialhr.com/oauth/token",
            "redirect_uris": ["https://intranet.iotech.pt/factorial/auth", "urn:ietf:wg:oauth:2.0:oob"]
        }
    },
    scopes: ['read+write'],
    auth_base_url: "https://api.factorialhr.com/oauth",
    base_url: "https://api.factorialhr.com/api/v1",
    //interval of time for cron schedule
    cronTime: 3,
    leave_type_id: 410560
}
