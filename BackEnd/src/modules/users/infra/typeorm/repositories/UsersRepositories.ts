import { getRepository, Not, Repository } from 'typeorm';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepositories from '@modules/users/repositories/IUsersRepositories';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

class UsersRepositories implements IUsersRepositories {
    private ormRepository: Repository<User>;

    constructor() {
        this.ormRepository = getRepository(User);
    }

    public async findAllProvider({
        except_user_id,
    }: IFindAllProvidersDTO): Promise<User[]> {
        let users: User[];

        if (except_user_id) {
            users = await this.ormRepository.find({
                where: {
                    id: Not(except_user_id),
                },
            });
        } else {
            users = await this.ormRepository.find();
        }

        return users;
    }

    public async findById(id: string): Promise<User | undefined> {
        const findUser = await this.ormRepository.findOne({
            where: { id },
        });
        return findUser;
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const findUser = await this.ormRepository.findOne({
            where: { email },
        });
        return findUser;
    }

    public async create(userData: ICreateUserDTO): Promise<User> {
        const user = this.ormRepository.create(userData);
        await this.ormRepository.save(user);
        return user;
    }

    public async save(user: User): Promise<User> {
        return this.ormRepository.save(user);
    }
}

export default UsersRepositories;
