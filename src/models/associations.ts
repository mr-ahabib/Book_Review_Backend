import User from './user';
import ReviewPost from './reviewpost';
import Comment from './comment';
import Vote from './vote';
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

User.hasMany(Vote, {
    foreignKey: 'user_id',
    as: 'votes',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  // A vote belongs to one user
  Vote.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  // One review can have many votes
  ReviewPost.hasMany(Vote, {
    foreignKey: 'review_id',
    as: 'votes',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  // A vote belongs to one review
  Vote.belongsTo(ReviewPost, {
    foreignKey: 'review_id',
    as: 'review',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });


};
