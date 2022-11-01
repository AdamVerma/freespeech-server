import request from "supertest";
import app from "../src/app";

describe("OpenAI Conjugation | POST /api/v1/openai/conjugate", () => {
  // get conjugations with a valid token
  it("Successfully returns all variations of a word.", (done) => {
    request(app)
      .post("/api/v1/openai/conjugate")
      .send({
        word: "run",
        language: "en-US",
      })
      .set({
        Accept: "application/json",
        Authorization: "Bearer " + process.env.TEST_TOKEN,
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual(
          expect.objectContaining({
            error: null,
            conjugations: expect.any(Array),
          })
        );
        done();
      });
  });
  // get conjugations with an invalid token
  it("Attempts to conjugate a word given an invalid token and returns an error object.", (done) => {
    request(app)
      .post("/api/v1/openai/conjugate")
      .send({
        word: "run",
        language: "en-US",
      })
      .set({
        Accept: "application/json",
        Authorization: "Bearer " + process.env.TEST_TOKEN + "invalid",
      })
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual(
          expect.objectContaining({
            error: expect.any(String),
          })
        );
        done();
      });
  });
});
