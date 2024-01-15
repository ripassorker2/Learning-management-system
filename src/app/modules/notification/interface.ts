import { Document, Model } from 'mongoose';

export type INotification = {
   title: string;
   message: string;
   status: string;
   userId: string;
} & Document;

export type NotificationModel = Model<INotification, Record<string, unknown>>;
