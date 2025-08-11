'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Votes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      review_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'ReviewPosts', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      vote_type: {
        type: Sequelize.ENUM('upvote', 'downvote'),
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Ensure a user can only vote once per review
    await queryInterface.addConstraint('Votes', {
      fields: ['user_id', 'review_id'],
      type: 'unique',
      name: 'unique_user_review_vote'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Votes');
  }
};
