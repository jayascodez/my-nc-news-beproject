const endpointsJson = require("../endpoints.json");
const request = require('supertest');
const db = require('../db/connection');
const data = require('../db/data/test-data');
const app = require('../app')
const seed = require('../db/seeds/seed')

const topics = require("../db/data/test-data/topics")

afterAll(() => db.end())
beforeEach(()=> seed(data))


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
    .get("/api/topic")
    .expect(404)
  });
});
