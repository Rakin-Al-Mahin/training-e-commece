/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { Types } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { getRequestUser } from '../../../helpers/getRequestUser';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IReview } from './review.interface';
import { ReviewService } from './review.service';

const createReview = catchAsync(async (req: Request, res: Response) => {
  const user = getRequestUser(req as any);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }

  const { productId, comment } = req.body;

  const reviewData: Partial<IReview> = {
    user: new Types.ObjectId(user.userId), // Convert string to ObjectId
    product: new Types.ObjectId(productId), // Ensure productId is also ObjectId
    comment,
  };

  const result = await ReviewService.createReview(reviewData as IReview);

  sendResponse<IReview>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Review created successfully',
    data: result,
  });
});

const getProductReviews = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const result = await ReviewService.getReviewsByProduct(productId);

  sendResponse<IReview[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reviews retrieved successfully',
    data: result,
  });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const user = getRequestUser(req as any);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }
  const { reviewId } = req.params;
  const { comment } = req.body;
  const result = await ReviewService.updateReview(
    reviewId,
    user.userId,
    comment
  );

  sendResponse<IReview | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review updated successfully',
    data: result,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const user = getRequestUser(req as any);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }
  const { reviewId } = req.params;
  const result = await ReviewService.deleteReview(reviewId, user.userId);

  sendResponse<IReview | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review deleted successfully',
    data: result,
  });
});

export const ReviewController = {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
};
