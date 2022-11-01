import request from "supertest";
import app from "../src/app";

describe("S3 | POST /api/v1/s3/upload", () => {
  // upload a file with a valid token
  it("Successfully uploads a file to S3 and returns the url.", (done) => {
    request(app)
      .post("/api/v1/s3/upload")
      .send({
        file: "test",
        name: "test",
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
            url: expect.any(String),
          })
        );
        done();
      });
  });
  // upload a file with an invalid token
  it("Attempts to upload a file given an invalid token and returns an error object.", (done) => {
    request(app)
      .post("/api/v1/s3/upload")
      .send({
        file: "test",
        name: "test",
      })
      .set({
        Accept: "application/json",
        Authorization: "Bearer invalid",
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
