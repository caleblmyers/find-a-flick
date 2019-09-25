'use strict';

module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define('Favorite', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    mediaType: {
      type: DataTypes.STRING
    },
    tmdbId: {
      type: DataTypes.INTEGER
    },
    title: {
      type: DataTypes.STRING
    }
  }, { timestamps: false });

  Favorite.associate = function (models) {
    Favorite.belongsTo(models.User, { foreignKey: "userId" })
  };

  return Favorite;
};