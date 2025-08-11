import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize';

class Vote extends Model {
    [x: string]: any;
}

Vote.init(
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
    reviewId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    voteType: {
      type: DataTypes.ENUM('upvote', 'downvote'),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Vote',
    tableName: 'Votes',
    timestamps: true,
    underscored: true,
  }
);

export default Vote;
