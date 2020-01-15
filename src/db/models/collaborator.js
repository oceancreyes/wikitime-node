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
        include: [
          {
            model: models.User
          }
        ],
        where: { wikiId: id },
        order: [["createdAt", "ASC"]]
      };
    });
  };

  return Collaborator;
};
