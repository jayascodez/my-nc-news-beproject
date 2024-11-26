const {
    selectArticleById, selectArticles, selectCommentsByArticleId
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
    selectArticles().then((articles) => {
        res.status(200).send( {articles} );
    })
    .catch(next)
};

const fetchCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params
    const promises = [selectCommentsByArticleId(article_id)]

    if(article_id){
        promises.push(selectArticleById(article_id))
    }
    return Promise.all(promises)
    .then(( [comments] ) => {
        res.status(200).send( {comments} )
    })
    .catch(next)
};

module.exports = {fetchArticleById, fetchArticles, fetchCommentsByArticleId}