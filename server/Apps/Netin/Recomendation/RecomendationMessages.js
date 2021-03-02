module.exports = {
    success: {
        s0: {
            http: 200,
            code: "RecomendationCreated",
            message: {
                pt: "Recomendação criada com sucesso!",
                eng: "Recomendation created successfully!"
            },
            type: "success"
        },
        s1: {
            http: 200,
            code: "UpdatedSuccess",
            message: {
                pt: "Recomendação atualizada com sucesso!",
                eng: "Recomendation updated successfully!"
            },
            type: "success"
        },
        s2: {
            http: 200,
            code: "RemoveSuccess",
            message: {
                pt: "Recomendação eliminada com sucesso!",
                eng: "Recomendation eliminated successfully!"
            },
            type: "success"
        },
        s3: {
            http: 200,
            code: "InsertedSucess",
            message: {
                pt: "Recomendação inserida com sucesso!",
                eng: "Recomendation inserted successfully!"
            },
            type: "success"
        },
        s4: {
            http: 200,
            code: "DeletedSucess",
            message: {
                pt: "Recomendação eliminada com sucesso!",
                eng: "Recomendation eliminated successfully!"
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
            http: 200,
            code: "NoUserRecords",
            message: {
                pt: "User não encontrado!",
                eng: "User not found!"
            },
            type: "error"
        },
        e3: {
            http: 200,
            code: "NoTestsRecords",
            message: {
                pt: "Testes não encontrados!",
                eng: "Tests not found!"
            },
            type: "error"
        },
        e4: {
            http: 404,
            code: "NoTestsEvaluationsRecords",
            message: {
                pt: "Avaliações de testes não encontrados!",
                eng: "Tests evaluations not found!"
            },
            type: "error"
        },
        e5: {
            http: 200,
            code: "UserAlreadyExists",
            message: {
                pt: "IdUser já existe!",
                eng: "idUser already exists!"
            },
            type: "error"
        },
        e6: {
            http: 200,
            code: "TestEvaluationAlreadyExists",
            message: {
                pt: "TestEvaluation já existe!",
                eng: "TestEvaluation already exists!"
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
            code: "InvalidFeedback",
            type: "error"
        }
        ,
        i5: {
            http: 406,
            code: "InvalidTestId",
            type: "error"
        }
    }
}