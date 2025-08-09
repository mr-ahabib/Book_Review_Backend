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


export const getRecentReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const cacheKey = `recent_reviews_page_${page}_limit_${limit}`;

    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      logger.info(`Serving recent reviews from cache for page ${page}`);
      return res.status(200).json(cachedData);
    }

    const recentReviews = await ReviewPost.findAll({
      order: [['createdAt', 'DESC']],  // order by createdAt descending (most recent first)
      limit,
      offset,
    });

    if (!recentReviews.length) {
      throw new ApiError('No reviews found', ErrorCodes.NOT_FOUND.statusCode);
    }

    cache.set(cacheKey, recentReviews);
    logger.info(`Cached recent reviews for page ${page}`);

    res.status(200).json(recentReviews);
  } catch (error) {
    next(error);
  }
};


export const getMyReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError('Unauthorized: No user ID found', ErrorCodes.UNAUTHORIZED.statusCode);
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const cacheKey = `my_reviews_user_${userId}_page_${page}_limit_${limit}`;

    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      logger.info(`Serving my reviews from cache for user ${userId}, page ${page}`);
      return res.status(200).json(cachedData);
    }

    const myReviews = await ReviewPost.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    if (!myReviews.length) {
      throw new ApiError('No reviews found for this user', ErrorCodes.NOT_FOUND.statusCode);
    }

    cache.set(cacheKey, myReviews);
    logger.info(`Cached my reviews for user ${userId}, page ${page}`);

    res.status(200).json(myReviews);
  } catch (error) {
    next(error);
  }
};



export const deleteReviewById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const reviewId = parseInt(req.params.id, 10);

    if (!userId) {
      throw new ApiError('Unauthorized: No user ID found', ErrorCodes.UNAUTHORIZED.statusCode);
    }

    if (isNaN(reviewId)) {
      throw new ApiError('Invalid review ID', ErrorCodes.BAD_REQUEST.statusCode);
    }
    const review = await ReviewPost.findOne({ where: { id: reviewId, userId } });

    if (!review) {
      throw new ApiError('Review not found or unauthorized', ErrorCodes.NOT_FOUND.statusCode);
    }
    await ReviewPost.destroy({ where: { id: reviewId } });


    const userCachePrefix = `my_reviews_user_${userId}_page_`;
    cache.keys().forEach(key => {
      if (key.startsWith(userCachePrefix)) {
        cache.del(key);
      }
    });

    cache.keys().forEach(key => {
      if (key.startsWith('top_reviews') || key.startsWith('recent_reviews')) {
        cache.del(key);
      }
    });

    logger.info(`Deleted review ${reviewId} for user ${userId} and cleared related caches`);

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};