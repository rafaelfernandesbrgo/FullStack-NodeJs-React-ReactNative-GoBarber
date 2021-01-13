import AppError from '@shared/errors/AppError';
import FakeUserRepositories from '@modules/users/repositories/fakes/FakeUserRepositories';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import CreateUserService from '@modules/users/services/CreateUserService';

let fakeUserRepositories: FakeUserRepositories;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let authenticateUserService: AuthenticateUserService;
let createUserService: CreateUserService;

describe('AuthenticateUser', () => {
    beforeEach(() => {
        fakeUserRepositories = new FakeUserRepositories();
        fakeHashProvider = new FakeHashProvider();
        fakeCacheProvider = new FakeCacheProvider();

        authenticateUserService = new AuthenticateUserService(
            fakeUserRepositories,
            fakeHashProvider,
        );
        createUserService = new CreateUserService(
            fakeUserRepositories,
            fakeHashProvider,
            fakeCacheProvider,
        );
    });

    it('should be able to create a new user', async () => {
        const user = await createUserService.execute({
            name: 'John Doe',
            email: 'John@jo.com',
            password: '123456',
        });

        const response = await authenticateUserService.execute({
            email: 'John@jo.com',
            password: '123456',
        });
        expect(response).toHaveProperty('token');
        expect(response.user).toEqual(user);
    });

    it('should not be able to authenticate with non existing user', async () => {
        await expect(
            authenticateUserService.execute({
                email: 'John@jo.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to authenticate with a wrong password', async () => {
        await createUserService.execute({
            name: 'John Doe',
            email: 'John@jo.com',
            password: '123456',
        });

        await expect(
            authenticateUserService.execute({
                email: 'John@jo.com',
                password: 'wrong-password',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
