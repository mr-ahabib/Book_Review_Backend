import { Request, Response, NextFunction } from 'express';
import ReviewPost from '../models/reviewpost';
import User from '../models/user';
import { ApiError } from '../utils/errors/ApiError';
import { ErrorCodes } from '../utils/errors/ErrorCodes';
import logger from '../logger/winstonLogger';
import cache from '../utils/cache';

interface AuthRequest extends Request {
  user?: { id: number };
  file?: Express.Multer.File; // multer file
}

export const createReviewPost = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError('Unauthorized: No user ID found', ErrorCodes.UNAUTHORIZED.statusCode);
    }

    const user = await User.findByPk(userId);
    if (!user) {
      throw new ApiError('User not found', ErrorCodes.NOT_FOUND.statusCode);
    }

    const { title, author, genre, rating, review } = req.body;
    const coverUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newPost = await ReviewPost.create({
      userId,
      userName: user.get('name'),
      title,
      author,
      genre,
      rating,
      review,
      coverUrl,
    });
    cache.keys().forEach(key => {
      if (key.startsWith('top_reviews')) {
        cache.del(key);
      }
    });

    logger.info(`ReviewPost created by userId ${userId}: ${newPost.get('id')}`);

    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
};




export const getTopReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const cacheKey = `top_reviews_page_${page}_limit_${limit}`;

    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      logger.info(`Serving top reviews from cache for page ${page}`);
      return res.status(200).json(cachedData);
    }

    const topReviews = await ReviewPost.findAll({
      order: [['rating', 'DESC']],
      limit,
      offset,
    });

    if (!topReviews.length) {
      throw new ApiError('No reviews found', ErrorCodes.NOT_FOUND.statusCode);
    }

    cache.set(cacheKey, topReviews);
    logger.info(`Cached top reviews for page ${page}`);

    res.status(200).json(topReviews);
  } catch (error) {
    next(error);
  }
};
