'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
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
    userName: DataTypes.STRING,
    mediaType: DataTypes.STRING,
    tmdbId: DataTypes.INTEGER,
    body: DataTypes.TEXT,
    replyTo: DataTypes.INTEGER,
    likes: {
      type: DataTypes.INTEGER,
      default: 0
    },
    createdAt: {
      type: DataTypes.DATE,
      default: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      default: DataTypes.NOW
    }
  }, {
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['id', 'userId']
      }
    ]
  });
  Comment.associate = function (models) {
    Comment.belongsTo(models.User, { foreignKey: "userId" })
  };
  return Comment;
};