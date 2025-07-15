import { z } from 'zod';

const createProductZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }),
    description: z.string({
      required_error: 'Description is required',
    }),
    price: z
      .union([
        z
          .number({
            required_error: 'Price is required',
          })
          .min(0, 'Price must be positive'),
        z
          .string()
          .regex(/^\d*\.?\d+$/, 'Invalid price')
          .transform(Number),
      ])
      .refine(val => val >= 0, 'Price must be positive'),
    stock: z
      .union([
        z
          .number({
            required_error: 'Stock is required',
          })
          .min(0, 'Stock must be positive'),
        z.string().regex(/^\d+$/, 'Invalid stock').transform(Number),
      ])
      .refine(val => val >= 0, 'Stock must be positive'),
    image: z.string().url('Invalid image URL').optional(),
  }),
});

const updateProductZodSchema = z.object({
  body: z
    .object({
      name: z.string().min(1, 'Name cannot be empty').optional(),
      description: z.string().min(1, 'Description cannot be empty').optional(),
      price: z.union([
        z.number().min(0, 'Price must be positive').optional(),
        z
          .string()
          .regex(/^\d*\.?\d+$/, 'Invalid price')
          .transform(Number)
          .optional(),
      ]),
      stock: z.union([
        z.number().min(0, 'Stock must be positive').optional(),
        z.string().regex(/^\d+$/, 'Invalid stock').transform(Number).optional(),
      ]),
      image: z
        .string()
        .url('Invalid image URL')
        .optional()
        .or(z.literal('').transform(() => undefined)),
      removeImage: z.boolean().optional(),
    })
    .refine(
      data => {
        if (data.image && data.removeImage) {
          return false;
        }
        return true;
      },
      {
        message: 'Cannot provide both image URL and removeImage flag',
        path: ['image'],
      }
    ),
});

export const ProductValidation = {
  createProductZodSchema,
  updateProductZodSchema,
};
