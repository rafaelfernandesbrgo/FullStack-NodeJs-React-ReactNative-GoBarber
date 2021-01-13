import FakeUserRepositories from '@modules/users/repositories/fakes/FakeUserRepositories';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import AppError from '@shared/errors/AppError';

let fakeUserRepositories: FakeUserRepositories;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
    beforeEach(() => {
        fakeUserRepositories = new FakeUserRepositories();
        fakeStorageProvider = new FakeStorageProvider();
        updateUserAvatar = new UpdateUserAvatarService(
            fakeUserRepositories,
            fakeStorageProvider,
        );
    });

    it('should be able to create a new user', async () => {
        const user = await fakeUserRepositories.create({
            name: 'John Doe',
            email: 'John@John.com.br',
            password: '123456',
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatarFake.jpg',
        });
        expect(user.avatar).toBe('avatarFake.jpg');
    });

    it('should not be able to update avatar from non existing user', async () => {
        await expect(
            updateUserAvatar.execute({
                user_id: 'non-existing-user',
                avatarFilename: 'avatarFake.jpg',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to delete old avatar when updating new one', async () => {
        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

        const user = await fakeUserRepositories.create({
            name: 'John Doe',
            email: 'John@John.com.br',
            password: '123456',
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatarFakeOld.jpg',
        });
        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatarFakeNew.jpg',
        });
        expect(deleteFile).toHaveBeenCalledWith('avatarFakeOld.jpg');
        expect(user.avatar).toBe('avatarFakeNew.jpg');
    });
});
