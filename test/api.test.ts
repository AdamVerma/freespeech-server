import request from 'supertest';
import app from '../src/app';

// create valid account
describe('POST /api/v1/auth/create', () => {
  it('responds with an access token', (done) => {
    request(app)
      .post('/api/v1/auth/create')
      .send({
        email: 'deleteme-' + Date.now() + '@example.com',
        password: 'password',
      })
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual(
          expect.objectContaining({
            error: null,
            access_token: expect.any(String),
          }),
        );
        done();
      });
  });
});

// create account with empty email
describe('POST /api/v1/auth/create', () => {
  it('responds with an error', (done) => {
    request(app)
      .post('/api/v1/auth/create')
      .send({
        email: '',
        password: 'password',
      })
      .set('Accept', 'application/json')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual(
          expect.objectContaining({
            error: expect.any(String),
            access_token: null,
          }),
        );
        done();
      });
  });
});

// create account with empty password
describe('POST /api/v1/auth/create', () => {
  it('responds with an error', (done) => {
    request(app)
      .post('/api/v1/auth/create')
      .send({
        email: 'deleteme-' + Date.now() + '@example.com',
        password: '',
      })
      .set('Accept', 'application/json')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual(
          expect.objectContaining({
            error: expect.any(String),
            access_token: null,
          }),
        );
        done();
      });
  });
});

// create account with invalid email
describe('POST /api/v1/auth/create', () => {
  it('responds with an error', (done) => {
    request(app)
      .post('/api/v1/auth/create')
      .send({
        email: 'deleteme-' + Date.now(),
        password: 'password',
      })
      .set('Accept', 'application/json')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual(
          expect.objectContaining({
            error: expect.any(String),
            access_token: null,
          }),
        );
        done();
      });
  });
});

// create account with duplicate email
describe('POST /api/v1/auth/create', () => {
  it('responds with an error', (done) => {
    request(app)
      .post('/api/v1/auth/create')
      .send({
        email: 'test@freespeechaac.com',
        password: 'password',
      })
      .set('Accept', 'application/json')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual(
          expect.objectContaining({
            error: expect.any(String),
            access_token: null,
          }),
        );
        done();
      });
  });
});

// login to test account
describe('POST /api/v1/auth/login', () => {
  it('responds with an access token', (done) => {
    request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@freespeechaac.com',
        password: 'test',
      })
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual(
          expect.objectContaining({
            error: null,
            access_token: expect.any(String),
          }),
        );
        done();
      });
  });
});

// login to test account with empty email
describe('POST /api/v1/auth/login', () => {
  it('responds with an error', (done) => {
    request(app)
      .post('/api/v1/auth/login')
      .send({
        email: '',
        password: 'test',
      })
      .set('Accept', 'application/json')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual(
          expect.objectContaining({
            error: expect.any(String),
            access_token: null,
          }),
        );
        done();
      });
  });
});

// login to test account with empty password
describe('POST /api/v1/auth/login', () => {
  it('responds with an error', (done) => {
    request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@freespeechaac.com',
        password: '',
      })
      .set('Accept', 'application/json')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual(
          expect.objectContaining({
            error: expect.any(String),
            access_token: null,
          }),
        );
        done();
      });
  });
});

// login to test account with invalid email
describe('POST /api/v1/auth/login', () => {
  it('responds with an error', (done) => {
    request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test',
        password: 'test',
      })
      .set('Accept', 'application/json')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual(
          expect.objectContaining({
            error: expect.any(String),
            access_token: null,
          }),
        );
        done();
      });
  });
});

// login to test account with invalid password
describe('POST /api/v1/auth/login', () => {
  it('responds with an error', (done) => {
    request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@freespeechaac.com',
        password: 'test2',
      })
      .set('Accept', 'application/json')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual(
          expect.objectContaining({
            error: expect.any(String),
            access_token: null,
          }),
        );
        done();
      });
  });
});
