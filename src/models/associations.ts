import User from './user';
import ReviewPost from './reviewpost';

export const applyAssociations = () => {
  // One User can have many ReviewPosts
 User.hasMany(ReviewPost, {
  foreignKey: 'user_id',  // snake_case here
  as: 'reviews',
});

ReviewPost.belongsTo(User, {
  foreignKey: 'user_id',  // snake_case here
  as: 'user',
});

};
