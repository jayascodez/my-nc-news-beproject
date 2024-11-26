const {selectCommentsByArticleId, sendCommentsByArticleId} = require("../models/commentsModel")
const {selectArticleById} = require("../models/articleModel");

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

const postCommentsByArticleId = (req, res, next) => {
    const newComment = req.body
    const {article_id} = req.params
    const promises = [selectArticleById(article_id), sendCommentsByArticleId(newComment, article_id)]
   
    return Promise.all(promises)
    .then((promiseRes) => {
        res.status(201).send( {comment: promiseRes[1]} )
    })
    .catch(next)
};

module.exports = {fetchCommentsByArticleId, postCommentsByArticleId}