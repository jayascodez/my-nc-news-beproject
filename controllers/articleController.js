const {selectArticleById, selectArticles, updateArticlesByID,
} = require("../models/articleModel");

const fetchArticleById = (req, res, next) => {
    const {article_id} = req.params

    selectArticleById(article_id)
    .then((article)=> {
        res.status(200).send( {article} )
    })
    .catch(next)
};

const fetchArticles = (req, res, next) => {
    const {sort_by, order_by, topic} = req.query

    return selectArticles(sort_by, order_by, topic)
        .then((articles) => {
            res.status(200).send({ articles });
        })
        .catch(next)
};

const patchArticlesByID = (req, res, next) => {
    const patchedArticle = req.body
    const {article_id} = req.params

    updateArticlesByID(patchedArticle, article_id).then((article) => {
        res.status(200).send({article})
    })
    .catch(next)

}

module.exports = {fetchArticleById, fetchArticles, patchArticlesByID}