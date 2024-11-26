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
        console.log(article, "<-- article in test")
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
      console.log(body.articles, "<----bodyArticles")
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

})