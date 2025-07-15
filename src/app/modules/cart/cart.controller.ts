/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { getRequestUser } from '../../../helpers/getRequestUser';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ICart } from './cart.interface';
import { CartService } from './cart.service';

const addToCart = catchAsync(async (req: Request, res: Response) => {
  const user = getRequestUser(req as any);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }
  const { productId, quantity } = req.body;
  const result = await CartService.addToCart(user?.userId, {
    product: productId,
    quantity,
  });

  sendResponse<ICart>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product added to cart successfully',
    data: result,
  });
});

const getCart = catchAsync(async (req: Request, res: Response) => {
  const user = getRequestUser(req as any);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }
  const result = await CartService.getCart(user.userId);

  sendResponse<ICart | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart retrieved successfully',
    data: result,
  });
});

const updateCartItem = catchAsync(async (req: Request, res: Response) => {
  const user = getRequestUser(req as any);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }
  const { productId } = req.params;
  const { quantity } = req.body;
  const result = await CartService.updateCartItem(
    user.userId,
    productId,
    quantity
  );

  sendResponse<ICart | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart item updated successfully',
    data: result,
  });
});

const removeFromCart = catchAsync(async (req: Request, res: Response) => {
  const user = getRequestUser(req as any);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }
  const { productId } = req.params;
  const result = await CartService.removeFromCart(user.userId, productId);

  sendResponse<ICart | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product removed from cart successfully',
    data: result,
  });
});

const clearCart = catchAsync(async (req: Request, res: Response) => {
  const user = getRequestUser(req as any);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }
  const result = await CartService.clearCart(user.userId);

  sendResponse<ICart | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart cleared successfully',
    data: result,
  });
});

export const CartController = {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
