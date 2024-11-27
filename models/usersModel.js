const db = require("../db/connection")

const selectUsers = () => {
    return db.query(`SELECT * FROM users`)
    .then(({rows}) => {
        console.log(rows, "rows from model")
        return rows
    })
}


module.exports = {selectUsers}