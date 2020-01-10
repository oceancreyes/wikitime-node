const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/users/";
const User = require("../../src/db/models").User;
const sequelize = require("../../src/db/models/index").sequelize;

describe("routes : users", () => {
  beforeEach(done => {
    this.user;

    sequelize.sync({ force: true }).then(res => {
      User.create({
        username: "john100",
        email: "john100@gmail.com",
        password: "friedChicken"
      })
        .then(user => {
          this.user = user;
          request.get({
            url: "http://localhost:3000/auth/fake",
            form: {
              userId: user.id,
              username: user.username,
              email: user.email,
              role: user.role
            }
          }
          );
          done()

        })
        .catch(err => {
          console.log(err);
          done();
        });
    });
  });

  describe("GET /users/sign_up", () => {
    it("should render a view with a sign up form", done => {
      request.get(`${base}sign_up`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Create your WikiTime account");
        done();
      });
    });
  });

  describe("POST /users", () => {
    it("should create a new user with valid values and redirect", done => {
      const options = {
        url: base,
        form: {
          username: "examplejr",
          email: "user@example.com",
          password: "123456789",
          password_conf: "123456789"
        }
      };

      request.post(options, (err, res, body) => {
        User.findOne({ where: { email: "user@example.com" } })
          .then(user => {
            expect(user).not.toBeNull();
            expect(user.email).toBe("user@example.com");
            expect(user.id).toBe(2);
            done();
          })
          .catch(err => {
            done();
          });
      });
    });
    it("should not make a new user with insufficient information", done => {
      const options = {
        url: base,
        form: {
          username: "",
          email: "user2@example.com",
          password: "123456789",
          password_conf: "123456789"
        }
      };
      request.post(options, (err, res, body) => {
        User.findOne({ where: { email: "user2@example.com" } })
          .then(user => {
            expect(user).toBeNull()
            done();
          })
          .catch(err => {
            done();
          });
      });
    })
    it("should not create a duplicate username", done => {
      let options = {
        url: base,
        form: {
          username: "john100",
          email: "john1000@gmail.com",
          password: "friedChicken"
        }
      };
      request.post(options, (err, res, body) => {
        User.findOne({ where: { email: "john1000@gmail.com" } })
          .then(user => {
            expect(user).toBeNull();
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          });
      });
    });
  });
  describe("GET /users/sign_in", () => {
    it("should render a view with a sign in form", done => {
      request.get(`${base}sign_in`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Sign in");
        done();
      });
    });
  });
  fdescribe("GET /users/upgrade", () => {
    fit("should render an upgrade account page", done => {
      request.get(`${base}upgrade`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("WikiTime Premium Membership");
        done();
      })
    })
  })
 describe("POST /users/upgrade", () => {
    it("should update the user's role from 0 to 1 (standard to premium)", done => {
      const options = {
        url: `${base}${this.user.id}/upgrade`,
        form: {
          stripeEmail: this.user.email,
          stripeToken: "tok_amex"	
        }
      }
      request.post(options, (err, res, body) => {
        User.findByPk(this.user.id).then(user => {
          expect(user.email).toBe(this.user.email)
          expect(user.role).toBe(1)
          done()
        })
      })
    })
  })
});