import { Document, Model } from 'mongoose';

export type IOrder = {
   courseId: string;
   userEmail: string;
   peyment_info: object;
} & Document;

export type OrderModel = Model<IOrder, Record<string, unknown>>;
