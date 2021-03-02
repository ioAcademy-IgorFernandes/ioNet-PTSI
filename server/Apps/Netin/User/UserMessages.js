module.exports = {
    success: {
        s0: {
            http: 200,
            code: "SomethingDone",
            type: "success"
        },
        s1: {
            http: 200,
            code: "Saved",
            message: {
                pt: "Utilizador foi guardado com sucesso",
                eng:"User was saved successfully"
            }
        },
        s2: {
            http: 200,
            code: "Updated",
            message: {
                pt: "Utilizador foi atualizado com sucesso",
                eng:"User updated successfully"
            }
        },
        s3: {
            http: 200,
            code: "Removed",
            message: {
                pt: "Utilizador foi removido com sucesso",
                eng:"User removed successfully"
            }
        },
        s4: {
            http: 200,
            code: "Found",
            message: {
                pt: "Utilizador encontrado",
                eng:"User was found"
            }
        }
        
    },
    error: {
        e0: {
            http: 406,
            code: "Something invalid",
            type: "error"
        },
        e1:{
            http: 401,
            code: "Unauthenticated",
            message: {
                pt: "Não autenticado",
                eng:"Unauthenticated"
            }
        },
        e2:{
            http: 401,
            code: "Invalid User",
            message: {
                pt: "Utilizador já existente",
                eng:"User already registed"
            }
        },
        e3:{
            http: 404,
            code: "NotFound",
            message: {
                pt: "Utilizador não encontrado",
                eng:"User not found"
            }
        },
        e4: {
            http: 500,
            code: "InternalError",
            message: {
                pt: "Erro Interno",
                eng: "Internal Error"
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
            code: "InvalidGroup",
            type: "error"
        },
        i2: {
            http: 406,
            code: "InvalidName",
            type: "error"
        },
        i3: {
            http: 406,
            code: "InvalidUserId",
            type: "error"
        },
        i4: {
            http: 406,
            code: "InvalidTerms",
            type: "error"
        },
        i5: {
            http: 406,
            code: "InvalidTermID",
            type: "error"
        },
        i6: {
            http: 406,
            code: "InvalidAgreement",
            type: "error"
        }
    }
}