interface IMailConfig {
    driver: 'ethereal' | 'ses';

    defaults: {
        from: {
            email: string;
            name: string;
        };
    };
}

export default {
    driver: process.env.MAIL_DRIVER || 'ethereal', // se n especificar, poe essa

    defaults: {
        from: {
            email: 'emaildapessoacomdominio@dominio.com.br',
            name: 'nomedaepessoa',
        },
    },
} as IMailConfig;
