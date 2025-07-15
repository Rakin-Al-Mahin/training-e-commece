import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { OrderController } from './order.controller';
import { OrderValidation } from './order.validation';

const router = express.Router();

router.post(
  '/',
  auth(ENUM_USER_ROLE.CUSTOMER),
  validateRequest(OrderValidation.createOrderZodSchema),
  OrderController.createOrder
);

router.get(
  '/history',
  auth(ENUM_USER_ROLE.CUSTOMER),
  OrderController.getOrderHistory
);

router.patch(
  '/:id',
  auth(), // Both admin and regular users can access
  validateRequest(OrderValidation.updateOrderZodSchema),
  OrderController.updateOrder
);

export const OrderRoutes = router;
