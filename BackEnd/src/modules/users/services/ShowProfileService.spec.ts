import FakeUserRepositories from '@modules/users/repositories/fakes/FakeUserRepositories';
import ShowProfileService from '@modules/users/services/ShowProfileService';
import AppError from '@shared/errors/AppError';

let fakeUserRepositories: FakeUserRepositories;
let showProfile: ShowProfileService;

describe('showProfile', () => {
    beforeEach(() => {
        fakeUserRepositories = new FakeUserRepositories();
        showProfile = new ShowProfileService(fakeUserRepositories);
    });

    it('should be able to show the profile', async () => {
        const user = await fakeUserRepositories.create({
            name: 'John Doe',
            email: 'John@John.com.br',
            password: '123456',
        });

        const profile = await showProfile.execute({
            user_id: user.id,
        });
        expect(profile.name).toBe('John Doe');
        expect(profile.email).toBe('John@John.com.br');
    });

    it('should not be able to show the profile from non-existing user', async () => {
        await expect(
            showProfile.execute({
                user_id: 'non-existing-user',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
