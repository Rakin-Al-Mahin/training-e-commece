import { z } from 'zod';
import { ENUM_ORDER_STATUS, ENUM_PAYMENT_METHOD } from '../../../enums/order';

// Order Item Schema
// const orderItemSchema = z.object({
//   product: z.string().min(1, 'Product ID is required'),
//   quantity: z.number().min(1, 'Quantity must be at least 1'),
//   price: z.number().min(0, 'Price must be positive'),
// });

// Create Order Schema
const createOrderZodSchema = z.object({
  body: z.object({
    shippingAddress: z
      .string({
        required_error: 'Shipping address is required',
      })
      .min(10, 'Address must be at least 10 characters'),
    paymentMethod: z.enum(
      Object.values(ENUM_PAYMENT_METHOD) as [string, ...string[]],
      {
        required_error: 'Payment method is required',
      }
    ),
    // items: z.array(orderItemSchema).min(1, 'At least one item is required'),
  }),
});

// Update Order Schema
const updateOrderZodSchema = z.object({
  body: z.object({
    status: z
      .enum(Object.values(ENUM_ORDER_STATUS) as [string, ...string[]])
      .optional(),
    paymentStatus: z.boolean().optional(),
    shippingAddress: z
      .string()
      .min(10, 'Address must be at least 10 characters')
      .optional(),
  }),
});

export const OrderValidation = {
  createOrderZodSchema,
  updateOrderZodSchema,
};
