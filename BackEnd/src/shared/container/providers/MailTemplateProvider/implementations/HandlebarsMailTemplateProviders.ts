import IMailTemplateProviders from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProviders';
import IParseMailTemplateDTO from '@shared/container/providers/MailTemplateProvider/dtos/IParseMailTemplateDTO';
import handlebars from 'handlebars';
import fs from 'fs';

class HandlebarsMailTemplateProviders implements IMailTemplateProviders {
    public async parse({
        file,
        variables,
    }: IParseMailTemplateDTO): Promise<string> {
        const templateFileContent = await fs.promises.readFile(file, {
            encoding: 'utf-8',
        });
        const parseTemplate = handlebars.compile(templateFileContent);
        return parseTemplate(variables);
    }
}

export default HandlebarsMailTemplateProviders;
