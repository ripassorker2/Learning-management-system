import { INotification } from './interface';
import { Notification } from './model';

const getAllNotification = async (): Promise<INotification[] | null> => {
   return await Notification.find().sort({ createdAt: -1 });
};
const updateNotification = async (
   id: string
): Promise<INotification[] | null> => {
   await Notification.findByIdAndUpdate(id, { status: 'read' }, { new: true });
   return await Notification.find().sort({ createdAt: -1 });
};

export const NotificationServices = { getAllNotification, updateNotification };
