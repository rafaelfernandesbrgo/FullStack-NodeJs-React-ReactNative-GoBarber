import IParseMailTemplateDTO from '@shared/container/providers/MailTemplateProvider/dtos/IParseMailTemplateDTO';

export default interface IMailTemplateProviders {
    parse(data: IParseMailTemplateDTO): Promise<string>;
}
