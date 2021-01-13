import IMailProviders from '@shared/container/providers/MailProvider/models/IMailProvider';
import ISendMailDTO from '@shared/container/providers/MailProvider/dtos/ISendMailDTO';
import IMailTemplateProviders from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProviders';
import { inject, injectable } from 'tsyringe';
import nodemailer, { Transporter } from 'nodemailer';
import aws from 'aws-sdk';
import mailConfig from '@config/mail';

@injectable()
export default class SESMailProvider implements IMailProviders {
    private client: Transporter;

    constructor(
        @inject('MailTemplateProviders')
        private mailTemplateProvider: IMailTemplateProviders,
    ) {
        this.client = nodemailer.createTransport({
            SES: new aws.SES({
                apiVersion: '2010-12-01',
                region: 'credenciaAWS',
            }),
        });
    }

    public async sendMail({
        to,
        from,
        subject,
        templateData,
    }: ISendMailDTO): Promise<void> {
        const { name, email } = mailConfig.defaults.from;

        await this.client.sendMail({
            from: {
                name: from?.name || name,
                address: from?.email || email,
            },
            to: {
                name: to.name,
                address: to.email,
            },
            subject,
            html: await this.mailTemplateProvider.parse(templateData),
        });
    }
}
