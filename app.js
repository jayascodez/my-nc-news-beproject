const endpointJson = require("./endpoints.json");
const express = require('express');
const app = express();
const {
    fetchTopics
} = require("./controllers/controller")

app.use(express.json());



app.get("/api", (req, res) => {
    res.status(200).send({endpoints: endpointJson})
});

app.get('/api/topics', fetchTopics)


app.use((err, req, res, next) => {
    if (err.code === "22P02"){
        res.status(400).send({msg: '404: invalid URL, bad request'})
    }
    if (err.status && err.msg){
        res.status(err.status).send({msg: err.msg})
    }
})

app.use((err, req, res, next) => {
    res.status(500).send({ msg: 'Server Error: Something went wrong!' });
  });

module.exports = app
