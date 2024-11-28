const endpointsJson = require("../endpoints.json");
const request = require('supertest');
const db = require('../db/connection');
const data = require('../db/data/test-data');
const app = require('../app')
const seed = require('../db/seeds/seed')
const sorted = require('jest-sorted')

afterAll(() => db.end());
beforeEach(()=> seed(data));

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with all topics", () => {
    return request(app)
    .get("/api/topics")
    .expect(200)
    .then(({body})=>{
      expect(body.topics.length).toBe(3);

      body.topics.forEach((topic) => {
        expect(typeof topic.description).toBe("string")
        expect(typeof topic.slug).toBe("string")
      })
    })
  });

  test("404: Error when endpoint not found" ,() => {
    return request(app)
    .get("/api/not-a-topic")
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe('404: not found')
    })
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an article by its ID", () => {
    return request(app)
    .get("/api/articles/4")
    .expect(200)
    .then(({body}) => {
        expect(body.article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String)
        })
    })
  });

  test('400: errors when given bad request', () => {
    return request(app)
    .get("/api/articles/fireworks")
    .expect(400)
    .then(({body})=> {
      expect(body.msg).toBe('400: bad request')
    })
  });

  test('404: errors if given an ID number that doesn\'t exist', () => {
    return request(app)
    .get("/api/articles/1234")
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe('404: not found')
    })
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with all articles", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({body})=>{
      expect(body.articles.length).toBe(13);

      body.articles.forEach((article) => {
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(String)
        })
      })
    })
  });
  test("200: Responds with articles sorted in desc date", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({body}) => {
      expect(body.articles).toBeSortedBy('created_at', {
        descending: true,
      })
    })
  });
  test("404: Errors if link not found", () => {
    return request(app)
    .get("/api/not_articles")
    .then(({body}) => {
      expect(body.msg).toBe('404: not found')
    })
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with all comments on an article", () => {
    return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then(( {body} ) => {
      expect(body.comments).toHaveLength(11)
      body.comments.forEach((comment) => {
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          article_id: 1,
        })
      })
      expect(body.comments).toBeSortedBy('created_at', {
        descending: true,
      })
    })
  });
  test("200: Responds with empty array if no comments on an article", () => {
    return request(app)
    .get("/api/articles/10/comments")
    .expect(200)
    .then(( {body} ) => {
      expect(body.comments).toEqual([])
    })
  })
  test("400: Errors if given a bad article_id", () => {
    return request(app)
    .get("/api/articles/cats/comments")
    .expect(400)
    .then(({body})=> {
      expect(body.msg).toBe('400: bad request')
    })
  });
  test("404: Errors if given an article_id which doesn't exist", () => {
    return request(app)
    .get("/api/articles/1234/comments")
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe('404: not found')
    })
  })
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Adds a new comment to selected article", () => {
    const newComment = {
      username: "butter_bridge",
      body: "I love all articles",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          article_id: 3,
          author: "butter_bridge",
          body: "I love all articles",
          comment_id: expect.any(Number),
          created_at: expect.any(String),
          votes: 0,
        })
      })
  });
  test("201: Adds a new comment to article with existing comments", () => {
    const newComment = {
      username: "butter_bridge",
      body: "I love all articles",
    };
    return request(app)
      .post("/api/articles/9/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          article_id: 9,
          author: "butter_bridge",
          body: "I love all articles",
          comment_id: expect.any(Number),
          created_at: expect.any(String),
          votes: 0,
        })
      })
  });
  test("400: Errors when attempting to post a bad request", () => {
    const newComment = {
      body: "no username so shouldn't post"
    };
    return request(app)
    .post("/api/articles/3/comments")
    .send(newComment)
    .expect(400)
    .then(( {body} ) => {
      expect(body.msg).toBe("400: bad request")
    })
  });
  test("400: Errors when attempting to post a bad request", () => {
    const newComment = {
      username: "butter_bridge"
    };
    return request(app)
    .post("/api/articles/3/comments")
    .send(newComment)
    .expect(400)
    .then(( {body} ) => {
      expect(body.msg).toBe("400: bad request")
    })
  });
  test("400: Errors when attempting to post using an unexistent username", () => {
    const newComment = {
      username: "helllo123",
      body: "i love articles"
    };
    return request(app)
    .post("/api/articles/3/comments")
    .send(newComment)
    .expect(400)
    .then(( {body} ) => {
      expect(body.msg).toBe("400: bad request")
    })
  });
  test("404: Errors when trying to post to an article which doesnt exist", () => {
    const newComment = {
      username: "butter_bridge",
      body: "I love all articles",
    };
    return request(app)
      .post("/api/articles/345/comments")
      .send(newComment)
      .expect(404)
      .then(( {body} ) => {
        expect(body.msg).toBe("404: not found")
      })
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: Responds with updated article by article id", () => {
    const patchedArticle = { inc_votes : 5 }
    return request(app)
    .patch("/api/articles/3")
    .send(patchedArticle)
    .expect(200)
    .then(({body: {article}}) => {
      expect(article).toMatchObject({
        author: expect.any(String),
        title: expect.any(String),
        article_id: 3,
        body: expect.any(String),
        topic: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String)
      })
      expect(article.votes).toBe(5)
    })
  });
  test("400: Errors when trying to send an invalid update", () => {
    const patchedArticle = {newAuthor: "sam"}
    return request(app)
    .patch("/api/articles/4")
    .send(patchedArticle)
    .expect(400)
    .then(({body})=> {
      expect(body.msg).toBe('400: bad request')
    })
  });
  test("400: Errors when trying to send an invalid update", () => {
    const patchedArticle = { inc_votes : 5 }
    return request(app)
    .patch("/api/articles/rainbow")
    .send(patchedArticle)
    .expect(400)
    .then(({body})=> {
      expect(body.msg).toBe('400: bad request')
    })
  });
  test("404: Errors if sending to invalid article id", () => {
    const patchedArticle = { inc_votes : 5 }
    return request(app)
    .patch("/api/articles/3636")
    .send(patchedArticle)
    .expect(404)
    .then(({body})=> {
      expect(body.msg).toBe('404: not found')
    })
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Sucessfully deleted comment by comment ID", () => {
    return request(app)
    .delete("/api/comments/1")
    .expect(204)
  });
  test("404: Errors if trying to delete a comment that doesnt exist", () => {
    return request(app)
    .delete("/api/comments/222")
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("404: not found")
    })
  });
});

describe("GET /api/users", () => {
  test("200: Responds with all users", () => {
    return request(app)
    .get("/api/users")
    .expect(200)
    .then(({body})=>{
      expect(body.users.length).toBe(4);

      body.users.forEach((user) => {
        expect(typeof user.username).toBe("string")
        expect(typeof user.name).toBe("string")
        expect(typeof user.avatar_url).toBe("string")
      })
    })
  });

  test("404: Error when endpoint not found" ,() => {
    return request(app)
    .get("/api/not-users")
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe('404: not found')
    })
  });
});

describe("GET /api/articles (sorting queries)", () => {
  test("200: Responds with all articles sorted by select column", () => {
    return request(app)
    .get("/api/articles?sort_by=votes&order_by=DESC")
    .expect(200)
    .then(({body}) => {
      expect(body.articles).toBeSortedBy('votes', {
        descending: true,
      })
    })
  });
  test("200: Responds with all articles sorted by select column", () => {
    return request(app)
    .get("/api/articles?sort_by=title&order_by=ASC")
    .expect(200)
    .then(({body}) => {
      expect(body.articles).toBeSortedBy('title', {
        descending: false,
      })
    })
  });
  test("400: Errors if sort_by query is invalid", () => {
    return request(app)
    .get("/api/articles?sort_by=sunflower&order_by=ASC")
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("400: bad request")
    })
  });
  test("400: Errors if order query is invalid", () => {
    return request(app)
    .get("/api/articles?sort_by=title&order_by=BIGGEST")
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("400: bad request")
    })
  });
});

describe("GET /api/articles (topic query)", () => {
  test("200: filters articles by the topic specified in the query", () => {
    return request(app)
    .get("/api/articles?topic=mitch")
    .expect(200)
    .then(({body}) => {
      expect(body.articles.length).toBe(12)
    })
  });
  test("400: Errors if topic query is invalid", () => {
    return request(app)
    .get("/api/articles?topic=not_a_topic")
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("400: bad request")
    });
  });
})