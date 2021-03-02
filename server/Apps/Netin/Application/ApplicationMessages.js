module.exports = {
    success: {
        s0: {
            http: 200,
            code: "ApplicationCreated",
            message: {
                pt: "Aplicação criada com sucesso!",
                eng: "Application created successfully!"
            },
            type: "success"
        },
        s1: {
            http: 200,
            code: "UpdateSuccess",
            message: {
                pt: "Aplicação atualizada com sucesso!",
                eng: "Aplication updated successfully!"
            },
            type: "success"
        },
        s2: {
            http: 200,
            code: "RemoveSuccess",
            message: {
                pt: "Aplicação eliminada com sucesso!",
                eng: "Aplication eliminated successfully!"
            },
            type: "success"
        },
        s3: {
            http: 200,
            code: "Success",
            message: {
                pt: "Sucesso!",
                eng: "Success!"
            },
            type: "success"
        }
    },
    error: {
        e0: {
            http: 200,
            code: "Unauthorized",
            message: {
                pt: "Sem autorização!",
                eng: "Unauthorized!"
            },
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
            http: 404,
            code: "NoRecordsFound",
            message: {
                pt: "Aplicação não encontrada!",
                eng: "Aplication not found!"
            },
            type: "error"
        }
    },
    invalid: {
        i0: {
            http: 406,
            code: "InvalidId",
            type: "error"
        },
        i1: {
            http: 406,
            code: "InvalidApplication",
            type: "error"
        },
        i2: {
            http: 406,
            code: "InvalidVersion",
            type: "error"
        },
        i3: {
            http: 406,
            code: "InvalidUserId",
            type: "error"
        },
        i4: {
            http: 406,
            code: "InvalidURL",
            type: "error"
        },
        i5: {
            http: 406,
            code: "InvalidCookie",
            type: "error"
        }
    }
}