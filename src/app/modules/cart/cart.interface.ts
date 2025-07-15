import { Types } from 'mongoose';

export type ICartItem = {
  product: Types.ObjectId;
  quantity: number;
};

export type ICart = {
  user: Types.ObjectId;
  items: ICartItem[];
};
