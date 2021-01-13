import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import IUsersRepositories from '@modules/users/repositories/IUsersRepositories';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

interface IRequest {
    user_id: string;
    name: string;
    email: string;
    old_password?: string;
    password?: string;
}
@injectable()
class UpdateProfileServices {
    constructor(
        @inject('UsersRepositories')
        private usersRepository: IUsersRepositories,

        @inject('HashProvider')
        private HashProvider: IHashProvider,
    ) {}

    public async execute({
        user_id,
        name,
        email,
        password,
        old_password,
    }: IRequest): Promise<User> {
        const user = await this.usersRepository.findById(user_id);

        if (!user) {
            throw new AppError('User not found');
        }

        const userWithUpdatedEmail = await this.usersRepository.findByEmail(
            email,
        );

        // para n deixar q outro usuario altere para email que já em uso
        if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
            throw new AppError('E-mail already in use.');
        }

        // ser necessário informar a senha antiga
        if (password && !old_password) {
            throw new AppError(
                'You need to inform the old password to set a new.',
            );
        }

        // senha antiga tem q estar certa
        if (password && old_password) {
            const chekOldPassword = await this.HashProvider.compareHash(
                old_password,
                user.password,
            );
            if (!chekOldPassword) {
                throw new AppError('Old password does not match.');
            }

            user.password = await this.HashProvider.generateHash(password);
        }
        user.name = name;
        user.email = email;

        return this.usersRepository.save(user);
    }
}

export default UpdateProfileServices;
