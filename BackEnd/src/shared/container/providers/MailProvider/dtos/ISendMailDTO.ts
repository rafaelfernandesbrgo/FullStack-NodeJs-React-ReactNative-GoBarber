import IParseMailTemplateDTO from '@shared/container/providers/MailTemplateProvider/dtos/IParseMailTemplateDTO';

interface IMailContact {
    name: string;
    email: string;
}

export default interface ISenMailDTO {
    to: IMailContact;
    from?: IMailContact;
    subject: string;
    templateData: IParseMailTemplateDTO;
}
