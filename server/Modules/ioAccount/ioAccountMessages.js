module.exports = {
    success: {
        s0: {
            http: 200,
            code: "SomethingDone",
            type: "success"
        }
    },
    error: {
        e0: {
            http: 406,
            code: "Something invalid",
            type: "error"
        },
        e1: {
            http: 500,
            code: "InternalError",
            message: {
                pt: "Erro Interno",
                eng: "Internal Error"
            },
            type: "error"
        },
        e2: {
            http: 400,
            code: "InvalidPassword",
            message: {
                pt: "Password inválida!",
                eng: "Password does not match!"
            },
            type: "error"
        },
        e3: {
            http: 404,
            code: "NoRecordsFound",
            message: {
                pt: "Email não existente!",
                eng: "Email does not exist!"
            },
            type: "error"
        },
        e4: {
            http: 401,
            code: "Unauthorized",
            message: {
                pt: "Sem autorização!",
                eng: "Unauthorized!"
            },
            type: "error"
        
       
        }
    },
    invalid: {
        i0: {
            http: 406,
            code: "InvalidEmail",
            type: "error"
        },
        i1: {
            http: 406,
            code: "InvalidPassword",
            type: "error"
        },
        i2: {
            http: 406,
            code: "InvalidName",
            type: "error"
        },
        i3: {
            http: 406,
            code: "InvalidUserType",
            type: "error"
        }
    }
}