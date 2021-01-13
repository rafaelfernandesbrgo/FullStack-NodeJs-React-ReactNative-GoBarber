import AppError from '@shared/errors/AppError';
import FakeUserRepositories from '@modules/users/repositories/fakes/FakeUserRepositories';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateUserService from '@modules/users/services/CreateUserService';

let fakeUserRepositories: FakeUserRepositories;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let createUserService: CreateUserService;

describe('CreateUser', () => {
    beforeEach(() => {
        fakeUserRepositories = new FakeUserRepositories();
        fakeHashProvider = new FakeHashProvider();
        fakeCacheProvider = new FakeCacheProvider();

        createUserService = new CreateUserService(
            fakeUserRepositories,
            fakeHashProvider,
            fakeCacheProvider,
        );
    });

    it('should be able to create a new user', async () => {
        const user = await createUserService.execute({
            name: 'John Doe',
            email: 'John@John.com.br',
            password: '123456',
        });
        expect(user).toHaveProperty('id');
    });

    it('should be able to create a new user with same email from another', async () => {
        await createUserService.execute({
            name: 'John Doe',
            email: 'John@John.com.br',
            password: '123456',
        });
        await expect(
            createUserService.execute({
                name: 'John Doe',
                email: 'John@John.com.br',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
