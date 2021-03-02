module.exports = {
    success: {
        s0: {
            http: 200,
            code: "EmailSent",
            message: {
                eng: "Email sent with success!",
                pt: "Email enviado com sucesso!"
            },
            type: "success"
        }
    },
    error: {
        e0: {
            http: 500,
            code: "TransporterError",
            message: {
                eng: "An error has ocurred when sending the email! x.x",
                pt: "Ocorreu um erro ao enviar o email! x.x"
            },
            type: "error"
        }
    }

}