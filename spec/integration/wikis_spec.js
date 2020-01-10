const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("routes : wikis", () => {
  beforeEach(done => {
    this.user;
    this.wiki;
    sequelize.sync({ force: true }).then(res => {
      User.create({
        username: "tommychocolate",
        email: "chocolatetom@gmail.com",
        password: "123456789"
      })
        .then(user => {
          this.user = user;
          request.get({
            url: "http://localhost:3000/auth/fake",
            form: {
              userId: user.id,
              username: user.username,
              email: user.email
            }
          });
          Wiki.create({
            title: "JavaScript",
            body: "JS frameworks and fundamentals",
            userId: user.id,
            private: false
          })
            .then(wiki => {
              this.wiki = wiki;
              done();
            })
            .catch(err => {
              console.log(err);
              done();
            });
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });
  });

  describe("GET /wikis", () => {
    it("should render the wiki index page", done => {
      request.get(base, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Wikis");
        done();
      });
    });
  });

  describe("GET /wikis/new", () => {
    it("should render a view with a new wiki form", done => {
      request.get(`${base}new`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("New Wiki");
        done();
      });
    });
  });

  describe("POST /wikis/create", () => {
    it("should create a new wiki and redirect", done => {
      const options = {
        url: `${base}create`,
        form: {
          title: "Brand new wiki",
          body: "New wiki body!",
          userId: this.user.id
        }
      };
      request.post(options, (err, res, body) => {
        Wiki.findOne({ where: { title: "Brand new wiki" } })
          .then(wiki => {
            expect(wiki.title).toBe("Brand new wiki");
            expect(wiki.body).toBe("New wiki body!");
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          });
      });
    });
    it("should not make a new wiki with nonvalidated data", done => {
      const options = {
        url: `${base}create`,
        form: {
          title: "1",
          body: "1",
          userId: this.user.id
        }
      };
      request.post(options, (err, res, body) => {
        Wiki.findOne({ where: { title: "1" } })
          .then(wiki => {
            expect(wiki).toBeNull()
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          });
      });
    })
  });

  describe("GET /wikis/:id", () => {
    it("should render a view with the selected wiki", done => {
      request.get(`${base}${this.wiki.id}`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("JS frameworks");
        done();
      });
    });
  });

  describe("POST /wikis/:id/destroy", () => {
    it("should delete the wiki with the associated ID", done => {
      Wiki.findAll().then(wikis => {
        const wikiCountBeforeDelete = wikis.length;
        expect(wikiCountBeforeDelete).toBe(1);
        request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
          Wiki.findAll()
            .then(wikis => {
              expect(err).toBeNull();
              expect(wikis.length).toBe(wikiCountBeforeDelete - 1);
              done();
            })
            .catch(err => {
              console.log(err);
              done();
            });
        });
      });
    });
  });

  describe("GET /wikis/:id/edit", () => {
    it("should render a view with an edit wiki form", done => {
      request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Edit Wiki");
        expect(body).toContain("JS frameworks and fundamentals");
        done();
      });
    });
  });

  describe("POST /wikis/:id/update", () => {
    it("should update the wiki with the given values", done => {
      request.post(
        {
          url: `${base}${this.wiki.id}/update`,
          form: {
            title: "JavaScript Frameworks",
            body: "There are a lot of them",
            userId: this.user.id
          }
        },
        (err, res, body) => {
          expect(err).toBeNull();
          Wiki.findOne({
            where: { id: 1 }
          })
            .then(wiki => {
              expect(wiki.title).toBe("JavaScript Frameworks");
              done();
            })
            .catch(err => {
              console.log(err);
              done();
            });
        }
      );
    });
    it("should not update a wiki with insufficient data", done => {
      const options = {
        url: `${base}${this.wiki.id}/update`,
        form: {
          title: "2",
          body: "2"
        }
      };
      request.post(options, (err, res, body) => {
        Wiki.findOne({
          where: { body: "2" }
        }).then(wiki => {
          expect(wiki).toBeNull()
          done();
        });
      });
    })
    it("should update another user's wiki", done => {
      User.create({
        email: "fellowuser@gmail.com",
        username: "fellowuser",
        password: "jsafkhasfjlsa"
      }).then(user => {
        let fellowOption = {
          url: `${base}${this.wiki.id}/update`,
          form: {
            title: "I was updated",
            body: "UPDATED BODY!!!!!",
            userId: this.user.id
          }
        }
        request.post(fellowOption, (err, res, body) => {
          Wiki.findOne({where: {title: "I was updated"}}).then(wiki => {
            expect(wiki.title).toBe("I was updated")
            expect(wiki.body).toBe("UPDATED BODY!!!!!")
            done()
          }).catch(err => {
            console.log(err)
            done()
          })
        })
      })
    })
  });
});
