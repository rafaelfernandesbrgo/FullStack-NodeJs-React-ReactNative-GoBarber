import FakeUserRepositories from '@modules/users/repositories/fakes/FakeUserRepositories';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileServices from '@modules/users/services/UpdateProfileServices';
import AppError from '@shared/errors/AppError';

let fakeUserRepositories: FakeUserRepositories;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileServices;

describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUserRepositories = new FakeUserRepositories();
        fakeHashProvider = new FakeHashProvider();
        updateProfile = new UpdateProfileServices(
            fakeUserRepositories,
            fakeHashProvider,
        );
    });

    it('should be able to update the profile', async () => {
        const user = await fakeUserRepositories.create({
            name: 'John Doe',
            email: 'John@John.com.br',
            password: '123456',
        });

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'New Name',
            email: 'new@email.com',
        });
        expect(updatedUser.name).toBe('New Name');
        expect(updatedUser.email).toBe('new@email.com');
    });

    it('should not be able to change to another user email ', async () => {
        await fakeUserRepositories.create({
            name: 'John Doe',
            email: 'John@John.com.br',
            password: '123456',
        });
        const user = await fakeUserRepositories.create({
            name: 'Another User',
            email: 'another@user.com.br',
            password: '123456',
        });
        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'Another User',
                email: 'John@John.com.br',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update the password', async () => {
        const user = await fakeUserRepositories.create({
            name: 'John Doe',
            email: 'John@John.com.br',
            password: '123456',
        });

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'John Doe',
            email: 'John@John.com.br',
            old_password: '123456',
            password: 'newPassword',
        });
        expect(updatedUser.password).toBe('newPassword');
    });

    it('should not be able to update the password without old password', async () => {
        const user = await fakeUserRepositories.create({
            name: 'John Doe',
            email: 'John@John.com.br',
            password: '123456',
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'John Doe',
                email: 'John@John.com.br',
                password: 'newPassword',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update the password with wrong password', async () => {
        const user = await fakeUserRepositories.create({
            name: 'John Doe',
            email: 'John@John.com.br',
            password: '123456',
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'John Doe',
                email: 'John@John.com.br',
                old_password: 'wrong-old-password',
                password: 'newPassword',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update the profile from non-existing user', async () => {
        await expect(
            updateProfile.execute({
                user_id: 'non-existing-user',
                name: 'John Doe',
                email: 'John@John.com.br',
                old_password: '123456',
                password: 'newPassword',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
