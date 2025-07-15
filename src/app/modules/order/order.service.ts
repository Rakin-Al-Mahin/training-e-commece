import httpStatus from 'http-status';
import { ENUM_ORDER_STATUS } from '../../../enums/order';
import { ENUM_USER_ROLE } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { Cart } from '../cart/cart.model';
import { Product } from '../product/product.model';
import { IOrder, IOrderItem } from './order.interface';
import { Order } from './order.model';

const createOrder = async (
  userId: string,
  shippingAddress: string,
  paymentMethod: string
): Promise<IOrder> => {
  // 1. Get user's cart
  const cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart || cart.items.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cart is empty');
  }

  // 2. Calculate total and verify stock
  let totalAmount = 0;
  const orderItems: IOrderItem[] = [];

  for (const item of cart.items) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }

    if (product.stock < item.quantity) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Insufficient stock for ${product.name}`
      );
    }

    totalAmount += product.price * item.quantity;
    orderItems.push({
      product: item.product,
      quantity: item.quantity,
      price: product.price,
    });
  }

  // 3. Update product stocks and clear cart
  await Promise.all([
    ...orderItems.map(item =>
      Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      })
    ),
    Cart.findOneAndUpdate({ user: userId }, { items: [] }, { new: true }),
  ]);

  // 4. Create order
  const order = await Order.create({
    user: userId,
    items: orderItems,
    totalAmount,
    shippingAddress,
    paymentMethod,
    status: ENUM_ORDER_STATUS.PENDING,
    paymentStatus: paymentMethod === 'COD' ? false : true, // Assuming online payments are immediately successful
  });

  return order;
};

const getOrderHistory = async (userId: string): Promise<IOrder[]> => {
  return Order.find({ user: userId }).populate('items.product');
};

const updateOrder = async (
  orderId: string,
  updateData: Partial<IOrder>,
  userRole: string,
  userId?: string
): Promise<IOrder | null> => {
  // 1. Find the order
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }

  // 2. Authorization and validation based on user role
  if (userRole === ENUM_USER_ROLE.ADMIN) {
    // Admin can update any field except user and items
    const { ...adminUpdates } = updateData;
    updateData = adminUpdates;
  } else {
    // Customer can only update their own orders
    if (order.user.toString() !== userId) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'You can only update your own orders'
      );
    }

    // Customers can only update specific fields
    const allowedCustomerUpdates: (keyof IOrder)[] = [
      'shippingAddress',
      'status',
    ];
    const invalidUpdates = Object.keys(updateData).filter(
      field => !allowedCustomerUpdates.includes(field as keyof IOrder)
    );

    if (invalidUpdates.length > 0) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        `You can only update: ${allowedCustomerUpdates.join(', ')}`
      );
    }

    // Customers can only cancel orders
    if (
      updateData.status &&
      updateData.status !== ENUM_ORDER_STATUS.CANCELLED
    ) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You can only cancel orders');
    }

    // Customers can only cancel pending orders
    if (
      updateData.status === ENUM_ORDER_STATUS.CANCELLED &&
      order.status !== ENUM_ORDER_STATUS.PENDING
    ) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'You can only cancel pending orders'
      );
    }
  }

  // 3. Handle status transitions
  if (updateData.status) {
    const validTransitions: Record<ENUM_ORDER_STATUS, ENUM_ORDER_STATUS[]> = {
      [ENUM_ORDER_STATUS.PENDING]: [
        ENUM_ORDER_STATUS.PROCESSING,
        ENUM_ORDER_STATUS.CANCELLED,
      ],
      [ENUM_ORDER_STATUS.PROCESSING]: [
        ENUM_ORDER_STATUS.SHIPPED,
        ENUM_ORDER_STATUS.CANCELLED,
      ],
      [ENUM_ORDER_STATUS.SHIPPED]: [ENUM_ORDER_STATUS.DELIVERED],
      [ENUM_ORDER_STATUS.DELIVERED]: [],
      [ENUM_ORDER_STATUS.CANCELLED]: [],
    };

    if (!validTransitions[order.status].includes(updateData.status)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Invalid status transition from ${order.status} to ${updateData.status}`
      );
    }

    // Restore stock if cancelled
    if (updateData.status === ENUM_ORDER_STATUS.CANCELLED) {
      await restoreProductStock(order.items);
    }
  }

  // 4. Update the order
  const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, {
    new: true,
  }).populate('items.product user');

  return updatedOrder;
};

// Helper function to restore product stock when order is cancelled
const restoreProductStock = async (items: IOrderItem[]) => {
  const bulkOps = items.map(item => ({
    updateOne: {
      filter: { _id: item.product },
      update: { $inc: { stock: item.quantity } },
    },
  }));

  await Product.bulkWrite(bulkOps);
};

export const OrderService = {
  createOrder,
  getOrderHistory,
  updateOrder,
};
