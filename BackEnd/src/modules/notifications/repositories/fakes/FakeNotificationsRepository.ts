import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotifcatioDTO from '@modules/notifications/dtos/ICreateNotifcatioDTO';
import { ObjectID } from 'mongodb';

class FakeNotificationsRepository implements INotificationsRepository {
    private notifications: Notification[] = [];

    public async create({
        content,
        recipient_id,
    }: ICreateNotifcatioDTO): Promise<Notification> {
        const notification = new Notification();
        Object.assign(notification, {
            id: new ObjectID(),
            content,
            recipient_id,
        });
        this.notifications.push(notification);
        return notification;
    }
}

export default FakeNotificationsRepository;
