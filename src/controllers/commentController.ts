import { Request, Response, NextFunction } from 'express';
import Comment from '../models/comment';
import User from '../models/user';
import { ApiError } from '../utils/errors/ApiError';
import { ErrorCodes } from '../utils/errors/ErrorCodes';
import logger from '../logger/winstonLogger';
import cache from '../utils/cache';

interface AuthRequest extends Request {
  user?: { id: number };
}

export const createComment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const reviewId = parseInt(req.params.reviewId, 10);
    const { comment } = req.body;

    if (!userId) {
      throw new ApiError('Unauthorized: No user ID found', ErrorCodes.UNAUTHORIZED.statusCode);
    }
    if (!reviewId || isNaN(reviewId)) {
      throw new ApiError('Invalid review ID', ErrorCodes.BAD_REQUEST.statusCode);
    }
    if (!comment) {
      throw new ApiError('Comment text is required', ErrorCodes.BAD_REQUEST.statusCode);
    }

    const user = await User.findByPk(userId);
    if (!user) {
      throw new ApiError('User not found', ErrorCodes.NOT_FOUND.statusCode);
    }

    const newComment = await Comment.create({
      userId,
      userName: user.get('name'),
      reviewId,
      comment,
    });

    const commentCachePrefix = `comments:${reviewId}:`;
    cache.keys().forEach(key => {
      if (key.startsWith(commentCachePrefix)) {
        cache.del(key);
      }
    });

    logger.info(`Comment created by userId ${userId} on reviewId ${reviewId}: commentId ${newComment.get('id')}`);

    res.status(201).json({
      message: 'Comment created successfully',
      data: newComment,
    });
  } catch (error) {
    next(error);
  }
};



export const getCommentsByReviewId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reviewId = parseInt(req.params.reviewId, 10);

    if (!reviewId || isNaN(reviewId)) {
      throw new ApiError('Invalid review ID', ErrorCodes.BAD_REQUEST.statusCode);
    }

    const cacheKey = `comments:${reviewId}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      logger.info(`Serving comments from cache for reviewId ${reviewId}`);
      return res.status(200).json({
        message: 'Comments retrieved successfully (from cache)',
        ...cachedData,
      });
    }

    const total = await Comment.count({ where: { reviewId } });

    const comments = await Comment.findAll({
      where: { reviewId },
      order: [['createdAt', 'DESC']],
    });

    if (comments.length === 0) {
      throw new ApiError('No comments found for this review', ErrorCodes.NOT_FOUND.statusCode);
    }

    const responseData = {
      data: comments,
      totalComments: total,
    };

    cache.set(cacheKey, responseData, 60);
    logger.info(`Cached comments for reviewId ${reviewId}`);

    res.status(200).json({
      message: 'Comments retrieved successfully',
      ...responseData,
    });
  } catch (error) {
    next(error);
  }
};


export const countCommentsByReviewId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reviewId = parseInt(req.params.reviewId, 10);

    if (!reviewId || isNaN(reviewId)) {
      throw new ApiError('Invalid review ID', ErrorCodes.BAD_REQUEST.statusCode);
    }

    const totalComments = await Comment.count({
      where: { reviewId }
    });

    logger.info(`Counted ${totalComments} comments for reviewId ${reviewId}`);

    res.status(200).json({
      message: 'Comment count retrieved successfully',
      totalComments
    });

  } catch (error) {
    next(error);
  }
};