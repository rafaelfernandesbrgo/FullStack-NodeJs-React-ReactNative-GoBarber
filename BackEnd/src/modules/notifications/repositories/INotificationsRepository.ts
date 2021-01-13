import ICreateNotifcatioDTO from '@modules/notifications/dtos/ICreateNotifcatioDTO';
import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';

export default interface INotificationsRepository {
    create(data: ICreateNotifcatioDTO): Promise<Notification>;
}
