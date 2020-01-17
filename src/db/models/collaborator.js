"use strict";
module.exports = (sequelize, DataTypes) => {
  var Collaborator = sequelize.define(
    "Collaborator",
    {
      wikiId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {}
  );
  Collaborator.associate = function(models) {
    Collaborator.belongsTo(models.Wiki, {
      foreignKey: "wikiId",
      onDelete: "CASCADE"
    });
    Collaborator.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
    Collaborator.addScope("collaboratorsFor", id => {
      return {
        //we include User model since we also want the connected User info (like email, username, etc.)
        include: [
          {
            model: models.User
          }
        ],
        //returns collaborator entries where the collaborator's wikiId property matches the input id of the private wiki
        where: { wikiId: id },
        order: [["createdAt", "ASC"]]
      };
    });
    Collaborator.addScope("collaborator", (userId) => {
      return {
        include: [{
          model: models.Wiki
        }],
        where: { userId: userId },
        order: [["createdAt", "ASC"]]
      }
    });
  };

  return Collaborator;
};
