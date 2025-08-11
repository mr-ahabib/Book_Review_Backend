import { Request, Response, NextFunction } from 'express';
import Vote from '../models/vote';
import ReviewPost from '../models/reviewpost';
import { ApiError } from '../utils/errors/ApiError';
import { ErrorCodes } from '../utils/errors/ErrorCodes';

interface AuthRequest extends Request {
  user?: { id: number };
}

export const voteOnReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id; // From auth middleware
    const { reviewId } = req.params;
    const { voteType } = req.body; // 'upvote' or 'downvote'

    if (!userId) {
      throw new ApiError('Unauthorized', ErrorCodes.UNAUTHORIZED.statusCode);
    }

    if (!['upvote', 'downvote'].includes(voteType)) {
      throw new ApiError('Invalid vote type', ErrorCodes.BAD_REQUEST.statusCode);
    }

    // Ensure review exists
    const review = await ReviewPost.findByPk(reviewId);
    if (!review) {
      throw new ApiError('Review not found', ErrorCodes.NOT_FOUND.statusCode);
    }

    // Check if vote already exists
    const existingVote = await Vote.findOne({
      where: { userId, reviewId },
    });

    if (!existingVote) {
      // First-time vote
      await Vote.create({
        userId,
        reviewId: Number(reviewId),
        voteType,
      });
      return res.status(201).json({ message: `Successfully ${voteType}d` });
    }

    if (existingVote.voteType === voteType) {
      // Same vote type clicked again → remove vote
      await existingVote.destroy();
      return res.status(200).json({ message: 'Vote removed' });
    }

    // Different vote → update
    existingVote.voteType = voteType;
    await existingVote.save();

    return res.status(200).json({ message: `Vote changed to ${voteType}` });

  } catch (error) {
    next(error);
  }
};




export const countVotesByReviewId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reviewId = parseInt(req.params.reviewId, 10);

    if (!reviewId || isNaN(reviewId)) {
      throw new ApiError('Invalid review ID', ErrorCodes.BAD_REQUEST.statusCode);
    }

    // Check review exists
    const review = await ReviewPost.findByPk(reviewId);
    if (!review) {
      throw new ApiError('Review not found', ErrorCodes.NOT_FOUND.statusCode);
    }

    // Count upvotes
    const upvotes = await Vote.count({
      where: { reviewId, voteType: 'upvote' }
    });

    // Count downvotes
    const downvotes = await Vote.count({
      where: { reviewId, voteType: 'downvote' }
    });

    res.status(200).json({
      message: 'Vote counts retrieved successfully',
      reviewId,
      upvotes,
      downvotes,
    });

  } catch (error) {
    next(error);
  }
};