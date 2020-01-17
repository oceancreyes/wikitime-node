const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
let base2 = "http://localhost:3000/users/collaborators";
const User = require("../../src/db/models").User;
const sequelize = require("../../src/db/models/index").sequelize;
const Collaborator = require("../../src/db/models").Collaborator;
const Wiki = require("../../src/db/models").Wiki;

describe("routes : collaborators", () => {
  beforeEach(done => {
    this.user;
    this.wiki;
    sequelize
      .sync({ force: true })
      .then(() => {
        User.create({
          username: "tommyychocolate",
          email: "chocolatetom@gmail.com",
          password: "123456789",
          role: 1
        }).then(user => {
          this.user = user;
          Wiki.create({
            title: "JavaScript",
            body: "JS frameworks and fundamentals",
            userId: this.user.id,
            private: true
          })
            .then(wiki => {
              this.wiki = wiki;
          done();
        });
      })
      .catch(err => {
        console.log(err);
        done();
      });
  });       
 });

  describe("Collab", () => {
    this.userCrud;
    beforeEach(done => {
      User.create({
        email: "tefone@gmail.com",
        password: "12345678",
        username: "tefteftef",
        role: 0
      }).then(user => {
        this.userCrud = user;
        //mock auth with PREMIUM DATA
        request.get(
          {
            // mock authentication
            url: "http://localhost:3000/auth/fake",
            form: {
              email: this.user.email,
              username: this.user.username,
              role: this.user.role, // mock authenticate as admin user
              userId: this.user.id
            }
          },
          (err, res, body) => {
            done();
          }
        );
      });
    });
    describe("GET /users/collaborators", () => {
        it("should return a list of collaborators for the user", done => {
            request.get(base2, (err, res, body) => {
                expect(err).toBeNull()
                expect(body).toContain("Collaborators")
                expect(body).toContain("You are not a collaborator on any wikis!")
                done()
            })
        })
    })
  describe("GET /wikis/:wikiId/collaborators", () => {
      it("will return a form to add collaborators for a specific wiki", done => {
        request.get(`${base}${this.wiki.id}/collaborators`, (err, res, body) => {
          expect(err).toBeNull()
          done()
        })
      })
    })
  });
});
