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

const selectArticles = () => {
    const SQLquery = `SELECT 
    articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.article_img_url, articles.votes,
    COUNT (comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC`
    
    const queryValues = []

    return db.query(SQLquery, queryValues)
    .then(( {rows} ) => {
        return rows
    })
};

const updateArticlesByID = (patchedArticle, article_id) => {
    const {inc_votes} = patchedArticle
    const SQLquery = `UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *`
    const queryValues = [inc_votes, article_id]

    return db.query(SQLquery, queryValues)
    .then(( {rows} ) => {
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: "404: not found"})
        }
    return rows[0]
    })
}

module.exports = {selectArticleById, selectArticles, updateArticlesByID}