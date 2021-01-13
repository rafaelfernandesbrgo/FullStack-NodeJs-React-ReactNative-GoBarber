import IMailTemplateProviders from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProviders';

class FakeMailTemplateProvider implements IMailTemplateProviders {
    public async parse(): Promise<string> {
        return 'Mail Content';
    }
}

export default FakeMailTemplateProvider;
