import { Request, Response, NextFunction } from 'express';
import ReviewPost from '../models/reviewpost';
import User from '../models/user';
import { ApiError } from '../utils/errors/ApiError';
import { ErrorCodes } from '../utils/errors/ErrorCodes';
import logger from '../logger/winstonLogger';

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

    logger.info(`ReviewPost created by userId ${userId}: ${newPost.get('id')}`);

    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
};
