import { getMongoRepository, MongoRepository } from 'typeorm';
import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotifcatioDTO from '@modules/notifications/dtos/ICreateNotifcatioDTO';

class NotificationsRepository implements INotificationsRepository {
    private ormRepository: MongoRepository<Notification>;

    constructor() {
        this.ormRepository = getMongoRepository(Notification, 'mongo');
    }

    public async create({
        content,
        recipient_id,
    }: ICreateNotifcatioDTO): Promise<Notification> {
        const notification = this.ormRepository.create({
            content,
            recipient_id,
        });
        await this.ormRepository.save(notification);
        return notification;
    }
}

export default NotificationsRepository;
