const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("Wiki", () => {
  beforeEach(done => {
    this.wiki;
    this.user;

    sequelize.sync({ force: true }).then(res => {
      User.create({
        username: "rabbitroger",
        email: "rabbitroger@tesla.com",
        password: "rogerrrrrrrrr",
      }).then(user => {
        this.user = user; //store the user
        Wiki.create({
          title: "JavaScript",
          body: "JS frameworks and fundamentals",
          userId: user.id
        }).then(wiki => {
          this.wiki = wiki;
          done();
        });
      });
    });
  });

  describe("#create()", () => {
    it("should create a wiki object and store it in the database", done => {
      Wiki.create({
        title: "Created wiki",
        body: "Created wiki description",
        userId: this.user.id
      })
        .then(newWiki => {
          expect(newWiki.title).toBe("Created wiki");
          expect(newWiki.body).toBe("Created wiki description");
          done();
        })
        .catch(err => {
          expect(err).toBeNull();
          console.log(err);
          done();
        });
    });

    it("should not create a wiki without a description", done => {
      Wiki.create({
        title: "Wiki without a description",
        body: "13213123123123123"
      })
        .then(newWiki => {
          done();
        })
        .catch(err => {
            expect(err.message).toContain("Wiki.userId cannot be null")
          done();
        });
    });
  });
});
describe("#getWikis", () => {
    it("should return all associated posts from the main topic", done => {
      this.user.getWikis().then(wikis => {
        expect(wikis[0].title).toBe("JavaScript");
        done();
      });
    });
});