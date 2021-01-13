import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUsersRepositories from '@modules/users/repositories/IUsersRepositories';
import { inject, injectable } from 'tsyringe';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
    name: string;
    email: string;
    password: string;
}

@injectable()
class CreateUserService {
    constructor(
        @inject('UsersRepositories')
        private usersRepository: IUsersRepositories,

        @inject('HashProvider')
        private HashProvider: IHashProvider,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) {}

    public async execute({ name, email, password }: IRequest): Promise<User> {
        // confere se n tem email repetido
        const checkUserExists = await this.usersRepository.findByEmail(email);
        if (checkUserExists) {
            throw new AppError('Email address already used.');
        }

        const hashedPassword = await this.HashProvider.generateHash(password);

        const user = await this.usersRepository.create({
            name,
            email,
            password: hashedPassword,
        });
        await this.cacheProvider.invalidatePrefix('provider-list');
        return user;
    }
}

export default CreateUserService;
