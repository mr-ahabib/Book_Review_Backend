import User from './user';
import ReviewPost from './reviewpost';
import Comment from './comment';
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

User.hasMany(Comment,{
  foreignKey: 'user_id',  // snake_case here
  as: 'comments',
})

Comment.belongsTo(User, {
  foreignKey: 'user_id',  // snake_case here
  as: 'user',
});


ReviewPost.hasMany(Comment, {
  foreignKey: 'review_id',  // snake_case here
  as: 'comments',
});

Comment.belongsTo(ReviewPost, {
  foreignKey: 'review_id',  // snake_case here
  as: 'review',
});

};
