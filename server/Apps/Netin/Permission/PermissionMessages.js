module.exports = {
    success: {
        s0: {
            http: 200,
            code: "SomethingDone",
            type: "success"
        },
        s1: {
            http: 200,
            code: "SavedSuccess",
            message: {
                pt: "Permissão guardada com sucesso",
                eng: "Permission saved successfully!"
            },
            type: "success"
        },
        s2: {
            http: 200,
            code: "RemovedSuccess",
            message: {
                pt: "Permissão removida com sucesso",
                eng: "Permission removed successfully!"
            },
            type: "success"
        },
        s3: {
            http: 200,
            code: "UpdatedSuccess",
            message: {
                pt: "Permissão atualizada com sucesso",
                eng: "Permission updated successfully!"
            },
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
            http: 404,
            code: "NoRecordsFound",
            message: {
                pt: "Permissão não encontrada",
                eng: "Permission not found"
            },
            type: "error"
        },
        e2: {
            http: 406,
            code: "PermissionAlreadyCreated",
            message: {
                pt: "Permissão já criada para Aplicação selecionada",
                eng: "Permission already created for the selected Application"
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
            code: "InvalidUserName",
            type: "error"
        },
        i2: {
            http: 406,
            code: "InvalidGroup",
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
            code: "InvalidAppName",
            type: "error"
        },
        i6: {
            http: 406,
            code: "InvalidAppId",
            type: "error"
        }
    }
}