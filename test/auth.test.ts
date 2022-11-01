import request from "supertest";
import app from "../src/app";

// Create account
describe("Account Creation | POST /api/v1/auth/create", () => {
  // create valid account
  it("Creates an account with a valid email and password.", (done) => {
    request(app)
      .post("/api/v1/auth/create")
      .send({
        email: "deleteme-" + Date.now() + "@example.com",
        password: "password",
      })
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual(
          expect.objectContaining({
            error: null,
            access_token: expect.any(String),
          })
        );
        done();
      });
  });
  // create account with empty email
  it("Attempts to create an account with an empty email and returns an error object.", (done) => {
    request(app)
      .post("/api/v1/auth/create")
      .send({
        email: "",
        password: "password",
      })
      .set("Accept", "application/json")
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual(
          expect.objectContaining({
            error: expect.any(String),
            access_token: null,
          })
        );
        done();
      });
  });
  // create account with empty password
  it("Attempts to create an account with an empty password and returns an error object.", (done) => {
    request(app)
      .post("/api/v1/auth/create")
      .send({
        email: "deleteme-" + Date.now() + "@example.com",
        password: "",
      })
      .set("Accept", "application/json")
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual(
          expect.objectContaining({
            error: expect.any(String),
            access_token: null,
          })
        );
        done();
      });
  });
  // create account with invalid email
  it("Attempts to create an account with an empty email and returns an error object.", (done) => {
    request(app)
      .post("/api/v1/auth/create")
      .send({
        email: "deleteme-" + Date.now(),
        password: "password",
      })
      .set("Accept", "application/json")
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual(
          expect.objectContaining({
            error: expect.any(String),
            access_token: null,
          })
        );
        done();
      });
  });
  // create account with duplicate email
  it("Attempts to create an account with a duplicate email and returns an error object.", (done) => {
    request(app)
      .post("/api/v1/auth/create")
      .send({
        email: "test@freespeechaac.com",
        password: "password",
      })
      .set("Accept", "application/json")
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual(
          expect.objectContaining({
            error: expect.any(String),
            access_token: null,
          })
        );
        done();
      });
  });
});

// Login
describe("Logging in/Account Validation | POST /api/v1/auth/login", () => {
  // login to test account
  it("Successfully logs into the test account and returns an access token. ", (done) => {
    request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "test@freespeechaac.com",
        password: "test",
      })
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual(
          expect.objectContaining({
            error: null,
            access_token: expect.any(String),
          })
        );
        done();
      });
  });
  // login with empty email
  it("Attempts a login with an empty email and returns an error object.", (done) => {
    request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "",
        password: "test",
      })
      .set("Accept", "application/json")
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual(
          expect.objectContaining({
            error: expect.any(String),
            access_token: null,
          })
        );
        done();
      });
  });
  // login with empty password
  it("Attempts a login with an empty password and returns an error object.", (done) => {
    request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "test@freespeechaac.com",
        password: "",
      })
      .set("Accept", "application/json")
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual(
          expect.objectContaining({
            error: expect.any(String),
            access_token: null,
          })
        );
        done();
      });
  });
  // login with invalid email
  it("Attempts a login with an invalid email and returns an error object.", (done) => {
    request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "test",
        password: "test",
      })
      .set("Accept", "application/json")
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual(
          expect.objectContaining({
            error: expect.any(String),
            access_token: null,
          })
        );
        done();
      });
  });
  // login to test account with invalid password
  it("Attempts a login with an invalid password and returns an error object.", (done) => {
    request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "test@freespeechaac.com",
        password: "test2",
      })
      .set("Accept", "application/json")
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual(
          expect.objectContaining({
            error: expect.any(String),
            access_token: null,
          })
        );
        done();
      });
  });
});
