const db = require("../db/connection")

const selectCommentsByArticleId = (article_id) => {
    const SQLquery = `SELECT * FROM comments WHERE article_id = $1
    ORDER BY created_at DESC`
    const queryValues = [article_id]

    return db.query(SQLquery, queryValues)
    .then(( {rows} ) => {
        return rows;
    })
};

const sendCommentsByArticleId = (newComment, article_id) => {
    const {username, body} = newComment
    const SQLquery = `INSERT INTO comments 
    (author, body, article_id)
    VALUES ($1, $2, $3)
    RETURNING *;`
    const values = [username, body, article_id]

    return db.query(SQLquery, values)
    .then(( {rows} ) => {
        return rows[0]
    })
}

const deleteCommentById = (comment_id) => {
    const SQLquery = `DELETE FROM comments WHERE comment_id = $1
    RETURNING *`
    const values = [comment_id]

    return db.query(SQLquery, values)
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: "404: not found"})
        }
        return rows[0]
    })
}

module.exports = {selectCommentsByArticleId, sendCommentsByArticleId, deleteCommentById}