exports.customErrors = (err, req, res, next) => {
    if (err.code === "22P02" || err.code === "23502" ||err.code === "23503"){
        res.status(400).send({msg: '400: bad request'})
    }
    if (err.status && err.msg) {
        res.status(err.status).send({msg: err.msg})
    } else {
        next(err)
    }
}

exports.serverError = (err, req, res, next) => {
    res.status(500).send({msg: "500: Server error"})
}