import { Schema, model } from 'mongoose';
import { INotification, NotificationModel } from './interface';

const notificationSchema = new Schema<INotification, NotificationModel>(
   {
      title: {
         type: String,
         required: true,
      },
      message: {
         type: String,
         required: true,
      },

      userId: {
         type: String,
         required: true,
      },
      status: {
         type: String,
         default: 'unread',
         required: true,
      },
   },
   {
      timestamps: true,
      toJSON: {
         virtuals: true,
      },
   }
);

export const Notification = model<INotification, NotificationModel>(
   'Notification',
   notificationSchema
);
