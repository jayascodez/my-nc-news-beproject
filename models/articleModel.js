const db = require("../db/connection")

const selectArticleById = (article_id) => {
    const SQLquery = `SELECT articles.*,
    CAST(COUNT(comments.comment_id) AS INTEGER) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`

    const queryValues = [article_id]

    return db.query(SQLquery, queryValues)
    .then(( {rows} )=> {
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: "404: not found"})
        }
        return rows[0];
    })
};

const addingValidTopics = () => {
    const SQLquery = `SELECT * FROM topics`
    const values = []

    return db.query(SQLquery, values)
    .then(({rows}) => {
        rows.forEach((topicObj) => {
            values.push(topicObj.slug)
        })
        return values
    })
};

const selectArticles = async (sort_by = 'created_at', order_by = `DESC`, topic) => {
    const validSortBy = ["author", "title", "article_id", "body", "topic", "created_at", "votes", "article_img_url"]
    const validOrder = ["ASC", "DESC"]
    const validTopics = await addingValidTopics()

    if(!validSortBy.includes(sort_by)){
        return Promise.reject({status: 400, msg: "400: bad request"})
    }
    if(!validOrder.includes(order_by)){
        return Promise.reject({status: 400, msg: "400: bad request"})
    }
    if(topic && !validTopics.includes(topic)){
        return Promise.reject({status: 400, msg: "400: bad request"})
    }

    let SQLquery = `SELECT 
    articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.article_img_url, articles.votes,
    COUNT (comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id `

    const queryValues = []

    if(topic){
        SQLquery += `WHERE articles.topic='${topic}' `
    }

    if(sort_by, order_by){
        SQLquery += `GROUP BY articles.article_id ORDER BY ${sort_by} ${order_by}`
    }

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

module.exports = {addingValidTopics, selectArticleById, selectArticles, updateArticlesByID}