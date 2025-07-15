import { ICart, ICartItem } from './cart.interface';
import { Cart } from './cart.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { Product } from '../product/product.model';

const addToCart = async (
  userId: string,
  cartItem: ICartItem
): Promise<ICart> => {
  // Check if product exists
  const product = await Product.findById(cartItem.product);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  // Check if product is in stock
  if (product.stock < cartItem.quantity) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient stock available');
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    // Create new cart if it doesn't exist
    cart = await Cart.create({
      user: userId,
      items: [cartItem],
    });
  } else {
    // Check if product already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === cartItem.product.toString()
    );

    if (existingItemIndex > -1) {
      // Update quantity if product exists
      cart.items[existingItemIndex].quantity += cartItem.quantity;
    } else {
      // Add new item if product doesn't exist
      cart.items.push(cartItem);
    }

    await cart.save();
  }

  return cart.populate('items.product');
};

const getCart = async (userId: string): Promise<ICart | null> => {
  const cart = await Cart.findOne({ user: userId }).populate('items.product');
  return cart;
};

const updateCartItem = async (
  userId: string,
  productId: string,
  quantity: number
): Promise<ICart | null> => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }

  const itemIndex = cart.items.findIndex(
    item => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item not found in cart');
  }

  // Check product stock
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  if (product.stock < quantity) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient stock available');
  }

  cart.items[itemIndex].quantity = quantity;
  await cart.save();

  return cart.populate('items.product');
};

const removeFromCart = async (
  userId: string,
  productId: string
): Promise<ICart | null> => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }

  cart.items = cart.items.filter(item => item.product.toString() !== productId);
  await cart.save();

  return cart.populate('items.product');
};

const clearCart = async (userId: string): Promise<ICart | null> => {
  const cart = await Cart.findOneAndUpdate(
    { user: userId },
    { items: [] },
    { new: true }
  ).populate('items.product');

  return cart;
};

export const CartService = {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
