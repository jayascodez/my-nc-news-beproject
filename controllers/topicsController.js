const {
    selectTopics
} = require('../models/topicsModel')

const fetchTopics= (req,res,next)=>{
    selectTopics().then((topics)=>{
        res.status(200).send( {topics} );
    })
    .catch((err)=>{
        next(err)
    })
};

module.exports = {fetchTopics}