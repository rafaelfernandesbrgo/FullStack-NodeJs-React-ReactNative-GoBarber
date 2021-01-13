import { inject, injectable } from 'tsyringe';
import IUsersRepositories from '@modules/users/repositories/IUsersRepositories';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import AppError from '@shared/errors/AppError';
import { isAfter, addHours } from 'date-fns';

interface IRequest {
    token: string;
    password: string;
}

@injectable()
class ResetPasswordService {
    constructor(
        @inject('UsersRepositories')
        private usersRepository: IUsersRepositories,

        @inject('UsersTokensRepositoriy')
        private userTokensRepository: IUserTokensRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({ token, password }: IRequest): Promise<void> {
        const userToken = await this.userTokensRepository.findbyToken(token);

        if (!userToken) {
            throw new AppError('User token does not exists');
        }

        const user = await this.usersRepository.findById(userToken.user_id);

        if (!user) {
            throw new AppError('User does not exists');
        }

        const maxDate = addHours(userToken.created_at, 2);

        if (isAfter(Date.now(), maxDate)) {
            throw new AppError('Token expired');
        }

        user.password = await this.hashProvider.generateHash(password);
        await this.usersRepository.save(user);
    }
}

export default ResetPasswordService;
