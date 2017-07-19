//Require the dev-dependencies
var supertest = require("supertest");
var should = require("should");
var app = require('../app.js');

// This agent refers to PORT where program is runninng.
var server = supertest.agent("http://localhost:" + (process.env.PORT || '3030'));
// UNIT test begin
describe("API endpoint testing", () => {

  it("should return correct values of emission for a sample country", (done) => {
    server
      .get('/')
      .expect("Content-type", /json/)
      .expect(200)
      .end((err, res) => {
        res.status.should.equal(200);
        done();
      });
  });
});
