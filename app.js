const endpointJson = require("./endpoints.json");
const express = require('express');
const app = express();
const {fetchTopics} = require("./controllers/topicsController");
const {fetchArticleById} = require("./controllers/articleController");
const {customErrors, serverError} = require("./errorhandling")

// app.use(express.json());

app.get("/api", (req, res) => {
    res.status(200).send({endpoints: endpointJson})
});

app.get('/api/topics', fetchTopics);

app.get('/api/articles/:article_id', fetchArticleById);


app.all("*", (req, res) => {
    res.status(404).send({ msg: "404: not found" });
  });
  
app.use(customErrors);
  
app.use(serverError);


module.exports = app
