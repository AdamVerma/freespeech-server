import request from "supertest";
import app from "../src/app";

let testProjectId: string;

// Creating Projects
describe("Project Creation | POST /api/v1/project/create", () => {
  // create a project with a valid token
  it("Successfully creates a new project and returns project information.", (done) => {
    request(app)
      .post("/api/v1/project/create")
      .send({
        name: "Test Project",
        description: "This is a test project.",
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
            id: expect.any(String),
            project: null,
          })
        );
        done();
        // save the project id for later tests
        testProjectId = res.body.id;
      });
  });
  // create a project with an invalid token
  it("Attempts to create a project given an invalid token and returns an error object.", (done) => {
    request(app)
      .post("/api/v1/project/create")
      .send({
        name: "Test Project",
        description: "This is a test project.",
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
  // create a project with empty name
  it("Attempts to create a project with an empty name and returns an error object.", (done) => {
    request(app)
      .post("/api/v1/project/create")
      .send({
        name: "",
        description: "This is a test project.",
      })
      .set({
        Accept: "application/json",
        Authorization: "Bearer " + process.env.TEST_TOKEN,
      })
      .expect(400)
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

// Getting a project
describe("Project Retrieval | POST /api/v1/project/get", () => {
  // get a project with a valid token
  it("Successfully gets a project and returns project information.", (done) => {
    request(app)
      .post("/api/v1/project/get")
      .send({
        slug: "my-awesome-new-project-19275",
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
            id: expect.any(String),
            project: expect.any(Object),
          })
        );
        done();
      });
  });
  // get a project with an invalid token
  it("Attempts to get a project given an invalid token and returns an error object.", (done) => {
    request(app)
      .post("/api/v1/project/get")
      .send({
        slug: "test-project",
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
  // get a project with empty slug
  it("Attempts to get a project with an empty slug and returns an error object.", (done) => {
    request(app)
      .post("/api/v1/project/get")
      .send({
        slug: "",
      })
      .set({
        Accept: "application/json",
        Authorization: "Bearer " + process.env.TEST_TOKEN,
      })
      .expect(400)
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
  // get a project with an empty id
  it("Attempts to get a project with an empty id and returns an error object.", (done) => {
    request(app)
      .post("/api/v1/project/get")
      .send({
        id: "",
      })
      .set({
        Accept: "application/json",
        Authorization: "Bearer " + process.env.TEST_TOKEN,
      })
      .expect(400)
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
  // get a public project not owned by the user
  it("Successfully gets a project and returns project information from a public project.", (done) => {
    request(app)
      .post("/api/v1/project/get")
      .send({
        id: "cl9d233kj0000jw09y8duq1wt",
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
            id: expect.any(String),
            project: expect.any(Object),
          })
        );
        done();
      });
  });
});

// Updating a project
describe("Project Update | POST /api/v1/project/update", () => {
  // update a project with a valid token
  it("Successfully updates a project and returns project information.", (done) => {
    request(app)
      .post("/api/v1/project/update")
      .send({
        id: testProjectId,
        name: "This is my new edited title!",
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
            id: expect.any(String),
            project: null,
          })
        );
        done();
      });
  });
  // update a project with an invalid token
  it("Attempts to update a project given an invalid token and returns an error object.", (done) => {
    request(app)
      .post("/api/v1/project/update")
      .send({
        id: testProjectId,
        isPublic: true,
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
  // update a project with empty id
  it("Attempts to update a project with an empty id and returns an error object.", (done) => {
    request(app)
      .post("/api/v1/project/update")
      .send({
        id: "",
        isPublic: true,
      })
      .set({
        Accept: "application/json",
        Authorization: "Bearer " + process.env.TEST_TOKEN,
      })
      .expect(400)
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
  // update a project with an empty name, it will return normal response no error
  it("Attempts to update a project with an empty name and returns a normal response.", (done) => {
    request(app)
      .post("/api/v1/project/update")
      .send({
        id: testProjectId,
        name: "",
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
            id: expect.any(String),
            project: null,
          })
        );
        done();
      });
  });
  // update a project with an empty description, it will return normal response no error
  it("Attempts to update a project with an empty description and returns a normal response.", (done) => {
    request(app)
      .post("/api/v1/project/update")
      .send({
        id: testProjectId,
        description: "",
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
            id: expect.any(String),
            project: null,
          })
        );
        done();
      });
  });
  // update a project with an empty isPublic, it will return normal response no error
  it("Attempts to update a project with an empty isPublic and returns a normal response.", (done) => {
    request(app)
      .post("/api/v1/project/update")
      .send({
        id: testProjectId,
        isPublic: "",
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
            id: expect.any(String),
            project: null,
          })
        );
        done();
      });
  });
});

// Deleting a project
describe("Project Delete | POST /api/v1/project/delete", () => {
  // delete a project with a valid token
  it("Successfully deletes a project and returns project information.", (done) => {
    request(app)
      .post("/api/v1/project/delete")
      .send({
        id: testProjectId,
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
            url: null,
            id: null,
            project: null,
          })
        );
        done();
      });
  });
  // delete a project with an invalid token
  it("Attempts to delete a project given an invalid token and returns an error object.", (done) => {
    request(app)
      .post("/api/v1/project/delete")
      .send({
        id: testProjectId,
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
  // delete a project with empty id
  it("Attempts to delete a project with an empty id and returns an error object.", (done) => {
    request(app)
      .post("/api/v1/project/delete")
      .send({
        id: "",
      })
      .set({
        Accept: "application/json",
        Authorization: "Bearer " + process.env.TEST_TOKEN,
      })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual(
          expect.objectContaining({
            error: expect.any(String),
            url: null,
            id: null,
            project: null,
          })
        );
        done();
      });
  });
  // attempt a delete on a nonexistent project
  it("Attempts to delete a project that does not exist and returns an error object.", (done) => {
    request(app)
      .post("/api/v1/project/delete")
      .send({
        id: "invalid",
      })
      .set({
        Accept: "application/json",
        Authorization: "Bearer " + process.env.TEST_TOKEN,
      })
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual(
          expect.objectContaining({
            error: expect.any(String),
            url: null,
            id: null,
            project: null,
          })
        );
        done();
      });
  });
  // attempt a delete on a project that does not belong to the user
  it("Attempts to delete a project that does not belong to the user and returns an error object.", (done) => {
    request(app)
      .post("/api/v1/project/delete")
      .send({
        id: "cl9d233kj0000jw09y8duq1wt",
      })
      .set({
        Accept: "application/json",
        Authorization: "Bearer " + process.env.TEST_TOKEN,
      })
      .expect(403)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual(
          expect.objectContaining({
            error: expect.any(String),
            url: null,
            id: null,
            project: null,
          })
        );
        done();
      });
  });
});
