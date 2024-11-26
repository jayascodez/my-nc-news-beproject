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
          article_id: expect.any(Number),
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