import { container } from 'tsyringe';

import IMailTemplateProviders from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProviders';
import HandlebarsMailTemplateProviders from '@shared/container/providers/MailTemplateProvider/implementations/HandlebarsMailTemplateProviders';

const providers = {
    handlebars: HandlebarsMailTemplateProviders,
};

container.registerSingleton<IMailTemplateProviders>(
    'MailTemplateProviders',
    providers.handlebars,
);
