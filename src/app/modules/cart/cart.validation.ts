import { z } from 'zod';

const addToCartZodSchema = z.object({
  body: z.object({
    productId: z.string({
      required_error: 'Product ID is required',
    }),
    quantity: z
      .number({
        required_error: 'Quantity is required',
      })
      .min(1),
  }),
});

const updateCartItemZodSchema = z.object({
  body: z.object({
    quantity: z
      .number({
        required_error: 'Quantity is required',
      })
      .min(1),
  }),
});

export const CartValidation = {
  addToCartZodSchema,
  updateCartItemZodSchema,
};
