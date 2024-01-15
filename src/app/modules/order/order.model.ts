import { Schema, model } from 'mongoose';
import { IOrder, OrderModel } from './order.interface';

const orderSchema = new Schema<IOrder, OrderModel>(
   {
      courseId: {
         type: String,
         required: true,
      },
      userEmail: {
         type: String,
         required: true,
      },
      peyment_info: {
         type: Object,
         // required: true,
      },
   },
   {
      timestamps: true,
      toJSON: {
         virtuals: true,
      },
   }
);

export const Order = model<IOrder, OrderModel>('Order', orderSchema);
