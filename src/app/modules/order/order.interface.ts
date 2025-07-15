import { Document, Types } from 'mongoose';
import { ENUM_ORDER_STATUS } from '../../../enums/order';

export type IOrderItem = {
  product: Types.ObjectId;
  quantity: number;
  price: number;
};

export type IOrder = {
  user: Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  status: ENUM_ORDER_STATUS;
  shippingAddress: string;
  paymentMethod: string;
  paymentStatus: boolean;
} & Document;
