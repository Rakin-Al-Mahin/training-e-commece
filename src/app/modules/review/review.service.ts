import httpStatus from 'http-status';
// import { ENUM_ORDER_STATUS } from '../../../enums/order';
import ApiError from '../../../errors/ApiError';
import { Order } from '../order/order.model';
import { Product } from '../product/product.model';
import { IReview } from './review.interface';
import { Review } from './review.model';

const createReview = async (reviewData: IReview): Promise<IReview> => {
  // Check if user has purchased the product
  const hasPurchased = await Order.exists({
    user: reviewData.user,
    'items.product': reviewData.product,
    // status: ENUM_ORDER_STATUS.DELIVERED,
  });

  if (!hasPurchased) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You can only review products you have purchased'
    );
  }

  // Check if product exists
  const product = await Product.findById(reviewData.product);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  const review = await Review.create(reviewData);
  return review.populate('user', 'name');
};

const getReviewsByProduct = async (productId: string): Promise<IReview[]> => {
  const reviews = await Review.find({ product: productId })
    .populate('user', 'name')
    .sort({ createdAt: -1 });
  return reviews;
};

const updateReview = async (
  reviewId: string,
  userId: string,
  comment: string
): Promise<IReview | null> => {
  const review = await Review.findOneAndUpdate(
    { _id: reviewId, user: userId },
    { comment },
    { new: true }
  ).populate('user', 'name');

  if (!review) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Review not found or you are not authorized to update it'
    );
  }

  return review;
};

const deleteReview = async (
  reviewId: string,
  userId: string
): Promise<IReview | null> => {
  const review = await Review.findOneAndDelete({
    _id: reviewId,
    user: userId,
  }).lean(); // Add .lean() to get a plain JS object

  if (!review) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Review not found or you are not authorized to delete it'
    );
  }

  return review as IReview; // Explicitly type the returned object
};

export const ReviewService = {
  createReview,
  getReviewsByProduct,
  updateReview,
  deleteReview,
};
