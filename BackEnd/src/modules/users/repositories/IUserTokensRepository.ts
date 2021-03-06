import UserToken from '@modules/users/infra/typeorm/entities/UserToken';

export default interface IUserTokensRepository {
    generate(user_id: string): Promise<UserToken>;
    findbyToken(token: string): Promise<UserToken | undefined>;
}
