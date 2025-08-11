import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize';

class ReviewPost extends Model {
    [x: string]: any;
}

ReviewPost.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    review: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    coverUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'ReviewPost',
    tableName: 'ReviewPosts',
    timestamps: true,
    underscored: true, // created_at, updated_at
  }
);

export default ReviewPost;
