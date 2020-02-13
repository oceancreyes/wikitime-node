"use strict";
module.exports = (sequelize, DataTypes) => {
  const Wiki = sequelize.define(
    "Wiki",
    {
      title: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      private: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {}
  );
  Wiki.associate = function(models) {
    Wiki.hasMany(models.Collaborator, {
      foreignKey: "wikiId",
      as: "collaborators"
    });
    Wiki.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
    // associations can be defined here
  };
  return Wiki;
};
