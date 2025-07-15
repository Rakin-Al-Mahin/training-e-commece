/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { getRequestUser } from '../../../helpers/getRequestUser';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IOrder } from './order.interface';
import { OrderService } from './order.service';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const user = getRequestUser(req as any);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }
  const validatedData = req.body; // Already validated by middleware

  const result = await OrderService.createOrder(
    user.userId,
    validatedData.shippingAddress,
    validatedData.paymentMethod
  );

  sendResponse<IOrder>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Order created successfully',
    data: result,
  });
});

const getOrderHistory = catchAsync(async (req: Request, res: Response) => {
  const user = getRequestUser(req as any);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }
  const result = await OrderService.getOrderHistory(user.userId);

  sendResponse<IOrder[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Orders retrieved successfully',
    data: result,
  });
});

const updateOrder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  const user = getRequestUser(req as any);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }

  const result = await OrderService.updateOrder(
    id,
    updateData,
    user.role,
    user.userId
  );

  sendResponse<IOrder>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order updated successfully',
    data: result,
  });
});

export const OrderController = {
  createOrder,
  getOrderHistory,
  updateOrder,
};
