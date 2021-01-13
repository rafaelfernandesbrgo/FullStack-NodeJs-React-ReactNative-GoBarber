import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import IUsersRepositories from '@modules/users/repositories/IUsersRepositories';

interface IRequest {
    user_id: string;
}
@injectable()
class ShowProfileService {
    constructor(
        @inject('UsersRepositories')
        private usersRepository: IUsersRepositories,
    ) {}

    public async execute({ user_id }: IRequest): Promise<User> {
        const user = await this.usersRepository.findById(user_id);

        if (!user) {
            throw new AppError('User not found');
        }
        return user;
    }
}

export default ShowProfileService;
