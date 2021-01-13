import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUsersRepositories from '@modules/users/repositories/IUsersRepositories';
import { inject, injectable } from 'tsyringe';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

interface IRequest {
    user_id: string;
    avatarFilename: string;
}
@injectable()
class UpdateUserAvartarService {
    constructor(
        @inject('UsersRepositories')
        private usersRepository: IUsersRepositories,

        @inject('StorageProvider')
        private StorageProvider: IStorageProvider,
    ) {}

    public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
        // garante q existe o usuario
        const user = await this.usersRepository.findById(user_id);
        if (!user) {
            throw new AppError(
                'Only authenticated users can change avatar.',
                401,
            );
        }

        // se o usuario já tiver o avatar, apaga o arquivo
        if (user.avatar) {
            await this.StorageProvider.deleteFile(user.avatar);
        }

        // salva o avatar
        const filename = await this.StorageProvider.saveFile(avatarFilename);

        // atualiza avatar
        user.avatar = filename;
        await this.usersRepository.save(user);

        return user;
    }
}

export default UpdateUserAvartarService;
