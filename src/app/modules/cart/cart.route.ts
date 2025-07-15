import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CartController } from './cart.controller';
import { CartValidation } from './cart.validation';

const router = express.Router();

router.post(
  '/',
  auth(ENUM_USER_ROLE.CUSTOMER),
  validateRequest(CartValidation.addToCartZodSchema),
  CartController.addToCart
);

router.get('/', auth(ENUM_USER_ROLE.CUSTOMER), CartController.getCart);

router.patch(
  '/:productId',
  auth(ENUM_USER_ROLE.CUSTOMER),
  validateRequest(CartValidation.updateCartItemZodSchema),
  CartController.updateCartItem
);

router.delete(
  '/:productId',
  auth(ENUM_USER_ROLE.CUSTOMER),
  CartController.removeFromCart
);
router.delete('/', auth(ENUM_USER_ROLE.CUSTOMER), CartController.clearCart);

export const CartRoutes = router;
