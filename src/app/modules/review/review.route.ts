import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewController } from './review.controller';
import { ReviewValidation } from './review.validation';

const router = express.Router();

router.post(
  '/',
  auth(ENUM_USER_ROLE.CUSTOMER),
  validateRequest(ReviewValidation.createReviewZodSchema),
  ReviewController.createReview
);

router.get('/product/:productId', ReviewController.getProductReviews);

router.patch(
  '/:reviewId',
  auth(ENUM_USER_ROLE.CUSTOMER),
  validateRequest(ReviewValidation.updateReviewZodSchema),
  ReviewController.updateReview
);

router.delete(
  '/:reviewId',
  auth(ENUM_USER_ROLE.CUSTOMER),
  ReviewController.deleteReview
);

export const ReviewRoutes = router;
