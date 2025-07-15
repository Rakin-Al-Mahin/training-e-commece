import { z } from 'zod';

const createReviewZodSchema = z.object({
  body: z.object({
    productId: z.string({
      required_error: 'Product ID is required',
    }),
    comment: z.string({
      required_error: 'Comment is required',
    }),
  }),
});

const updateReviewZodSchema = z.object({
  body: z.object({
    comment: z.string({
      required_error: 'Comment is required',
    }),
  }),
});

export const ReviewValidation = {
  createReviewZodSchema,
  updateReviewZodSchema,
};
