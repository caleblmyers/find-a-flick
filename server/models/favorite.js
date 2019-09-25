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
      type: DataTypes.INTEGER,
      unique: true
    },
    title: {
      type: DataTypes.STRING
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      default: DataTypes.NOW
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      default: DataTypes.NOW
    }
  }, { timestamps: false });

  Favorite.associate = function (models) {
    Favorite.belongsTo(models.User, { foreignKey: "userId" })
  };

  return Favorite;
};