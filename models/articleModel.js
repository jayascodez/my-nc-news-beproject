const db = require("../db/connection")

const selectArticleById = (article_id) => {
    const SQLquery = `SELECT * FROM articles WHERE article_id = $1`
    const queryValues = [article_id]

    return db.query(SQLquery, queryValues)
    .then(( {rows} )=> {
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: "404: not found"})
        }
        return rows[0];
    })
};

module.exports = {selectArticleById}