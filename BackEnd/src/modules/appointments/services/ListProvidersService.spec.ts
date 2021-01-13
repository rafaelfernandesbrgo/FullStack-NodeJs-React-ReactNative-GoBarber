import FakeUserRepositories from '@modules/users/repositories/fakes/FakeUserRepositories';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersService from '@modules/appointments/services/ListProvidersService';

let fakeUserRepositories: FakeUserRepositories;
let fakeCacheProvider: FakeCacheProvider;
let listProviders: ListProvidersService;

describe('ListProvider', () => {
    beforeEach(() => {
        fakeUserRepositories = new FakeUserRepositories();
        fakeCacheProvider = new FakeCacheProvider();
        listProviders = new ListProvidersService(
            fakeUserRepositories,
            fakeCacheProvider,
        );
    });

    it('should be able to list de providers', async () => {
        const user1 = await fakeUserRepositories.create({
            name: 'John Doe',
            email: 'John@Doe.com.br',
            password: '123456',
        });

        const user2 = await fakeUserRepositories.create({
            name: 'John Tre',
            email: 'John@Tre.com.br',
            password: '123456',
        });

        const LoggedUser = await fakeUserRepositories.create({
            name: 'John Qua',
            email: 'John@Qua.com.br',
            password: '123456',
        });

        const providers = await listProviders.execute({
            user_id: LoggedUser.id,
        });

        expect(providers).toEqual([user1, user2]);
    });
});
