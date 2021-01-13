import IMailProviders from '@shared/container/providers/MailProvider/models/IMailProvider';
import ISendMailDTO from '@shared/container/providers/MailProvider/dtos/ISendMailDTO';

export default class FakeEmailProvider implements IMailProviders {
    private messages: ISendMailDTO[] = [];

    public async sendMail(message: ISendMailDTO): Promise<void> {
        this.messages.push(message);
    }
}
