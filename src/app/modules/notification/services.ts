import cron from 'node-cron';
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

// delete notification after 30 day

cron.schedule('0 0 0 * * *', async () => {
   const thirtyDays = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
   await Notification.deleteMany({ status: 'read', createdAt: thirtyDays });
   console.log('Delete read notification');
});

export const NotificationServices = { getAllNotification, updateNotification };
