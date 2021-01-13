import { container } from 'tsyringe';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import EtherealMailProvider from '@shared/container/providers/MailProvider/implementantions/EtherealMailProvider';
import SESMailProvider from '@shared/container/providers/MailProvider/implementantions/SESMailProvider';
import mailConfig from '@config/mail';

const provider = {
    ethereal: container.resolve(EtherealMailProvider),
    ses: container.resolve(SESMailProvider),
};

container.registerInstance<IMailProvider>(
    'MailProvider',
    provider[mailConfig.driver],
);
