import { Schema, model } from 'mongoose';
import { ENUM_ORDER_STATUS } from '../../../enums/order';
import { IOrder } from './order.interface';

const orderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
});

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: Object.values(ENUM_ORDER_STATUS),
      default: ENUM_ORDER_STATUS.PENDING,
    },
    shippingAddress: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Order = model<IOrder>('Order', orderSchema);
