const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/users/";
const User = require("../../src/db/models").User;
const sequelize = require("../../src/db/models/index").sequelize;


describe('routes : users', () => {
  beforeEach(done => {
    sequelize
      .sync({ force: true })
      .then(() => {
        done();
      })
      .catch(err => {
        console.log(err);
        done();
      });
  });

  describe("user CRUD actions", () => {
    this.userCrud;
    beforeEach(done => {
      User.create({
        email: "stan3333dard@gmail.com",
        password: "1234567",
        username: "stannnnnnn",
        role: 0
      }).then(user => {
        this.userCrud = user;
        request.get(
          {
            // mock authentication
            url: "http://localhost:3000/auth/fake",
            form: {
              email: user.email,
              username: user.username,
              role: user.role, // mock authenticate as admin user
              userId: user.id,
            }
          },
          (err, res, body) => {
            done();
          }
        );
      });
    }); 
    describe("GET /users/upgrade_account", () => {
      it("should render an upgrade account page", done => {
        request.get(`${base}upgrade_account`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Upgrade your WikiTime account!");
          done();
        })
      })
    })
  })
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
            expect(user.id).toBe(user.id);
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
});