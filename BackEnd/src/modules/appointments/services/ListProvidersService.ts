import { inject, injectable } from 'tsyringe';
import IUsersRepositories from '@modules/users/repositories/IUsersRepositories';
import User from '@modules/users/infra/typeorm/entities/User';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

// está em appointments e n em user, pois sao os usuarios q serão agendados
// se por exemplo, eu fosse aproveitar user, dava para qq aplicação pois generico
// agora listar seria aqui, pois especifico dessa

// além disso, será mostrado todos os user, menos o q está acessando
// assim, n é todos

interface IRequest {
    user_id: string;
}
@injectable()
class ListProvidersService {
    constructor(
        @inject('UsersRepositories')
        private usersRepository: IUsersRepositories,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) {}

    public async execute({ user_id }: IRequest): Promise<User[]> {
        let users = await this.cacheProvider.recovery<User[]>(
            `provider-list:${user_id}`,
        );
        if (!users) {
            users = await this.usersRepository.findAllProvider({
                except_user_id: user_id,
            });
            await this.cacheProvider.save(`provider-list:${user_id}`, users);
        }

        return users;
    }
}

export default ListProvidersService;
