import AppError from '@shared/errors/AppError';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import FakeUserRepositories from '@modules/users/repositories/fakes/FakeUserRepositories';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';

let fakeUserRepositories: FakeUserRepositories;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
    beforeEach(() => {
        fakeUserRepositories = new FakeUserRepositories();
        fakeMailProvider = new FakeMailProvider();
        fakeUserTokensRepository = new FakeUserTokensRepository();

        sendForgotPasswordEmail = new SendForgotPasswordEmailService(
            fakeUserRepositories,
            fakeMailProvider,
            fakeUserTokensRepository,
        );
    });

    it('should be able to recover the password using the email', async () => {
        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

        await fakeUserRepositories.create({
            name: 'John Doe',
            email: 'john@jonh.com',
            password: '123456',
        });
        await sendForgotPasswordEmail.execute({
            email: 'john@jonh.com',
        });
        expect(sendMail).toHaveBeenCalled();
    });

    it('should not be able to recover a non-existing user password', async () => {
        await expect(
            sendForgotPasswordEmail.execute({
                email: 'john@jonh.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should generate a forgot password token', async () => {
        const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

        const user = await fakeUserRepositories.create({
            name: 'John Doe',
            email: 'john@jonh.com',
            password: '123456',
        });
        await sendForgotPasswordEmail.execute({
            email: 'john@jonh.com',
        });

        await expect(generateToken).toHaveBeenCalledWith(user.id);
    });
});
