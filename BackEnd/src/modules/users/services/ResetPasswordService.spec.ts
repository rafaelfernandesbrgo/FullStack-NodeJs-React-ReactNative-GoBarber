import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import FakeUserRepositories from '@modules/users/repositories/fakes/FakeUserRepositories';
import ResetPasswordService from '@modules/users/services/ResetPasswordService';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';

let fakeUserRepositories: FakeUserRepositories;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPassword: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('ResetPassword', () => {
    beforeEach(() => {
        fakeUserRepositories = new FakeUserRepositories();
        fakeUserTokensRepository = new FakeUserTokensRepository();
        fakeHashProvider = new FakeHashProvider();

        resetPassword = new ResetPasswordService(
            fakeUserRepositories,
            fakeUserTokensRepository,
            fakeHashProvider,
        );
    });

    it('should be able to reset the password', async () => {
        const user = await fakeUserRepositories.create({
            name: 'John Doe',
            email: 'john@jonh.com',
            password: '123456',
        });

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

        const { token } = await fakeUserTokensRepository.generate(user.id);
        await resetPassword.execute({
            password: 'new-password',
            token,
        });
        const userUpdated = await fakeUserRepositories.findById(user.id);
        expect(generateHash).toHaveBeenCalledWith('new-password');
        expect(userUpdated?.password).toBe('new-password');
    });

    it('should not be able to reset the password with non-existing token', async () => {
        await expect(
            resetPassword.execute({
                password: '123456',
                token: 'non-existing-token',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset the password with non-existing user', async () => {
        const { token } = await fakeUserTokensRepository.generate(
            'non-existing-user',
        );
        await expect(
            resetPassword.execute({
                password: '123456',
                token,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset the password if passed more than 2 hours', async () => {
        const user = await fakeUserRepositories.create({
            name: 'John Doe',
            email: 'john@jonh.com',
            password: '123456',
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const customDate = new Date();
            return customDate.setHours(customDate.getHours() + 3);
        });

        await expect(
            resetPassword.execute({
                password: 'new-password',
                token,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
