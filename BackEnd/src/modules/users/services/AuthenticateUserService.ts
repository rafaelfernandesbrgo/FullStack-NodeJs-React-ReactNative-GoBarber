import { sign } from 'jsonwebtoken';
import User from '@modules/users/infra/typeorm/entities/User';
import AuthConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import IUsersRepositories from '@modules/users/repositories/IUsersRepositories';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import { inject, injectable } from 'tsyringe';

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: User;
    token: string;
}

@injectable()
class AuthenticateUserService {
    constructor(
        @inject('UsersRepositories')
        private usersRepository: IUsersRepositories,

        @inject('HashProvider')
        private HashProvider: IHashProvider,
    ) {}

    public async execute({ email, password }: IRequest): Promise<IResponse> {
        // valida as credenciais

        // 1-confere se tem email
        const user = await this.usersRepository.findByEmail(email);
        if (!user) {
            throw new AppError('Incorret email/password combination.', 401);
        }

        // 2-confere se senha daquele email -  user.password(senha criptografada)  e password(senha n criptografada)
        const passwordMatched = await this.HashProvider.compareHash(
            password,
            user.password,
        );
        if (!passwordMatched) {
            throw new AppError('Incorret email/password combination.', 401);
        }

        // gerando token JWT
        const { secret, expiresIn } = AuthConfig.jwt;
        const token = sign({}, secret, {
            subject: user.id,
            expiresIn,
        });

        return {
            user,
            token,
        };
    }
}

export default AuthenticateUserService;
