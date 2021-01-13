import { hash, compare } from 'bcryptjs';
import IHashProvider from '../models/IHashProvider';

class BCryptHashProviders implements IHashProvider {
    public async generateHash(payload: string): Promise<string> {
        return hash(payload, 8); // dado um parametro conhecido 8 criptografa igualmente
    }

    public async compareHash(
        payload: string,
        hashed: string,
    ): Promise<boolean> {
        return compare(payload, hashed);
    }
}

export default BCryptHashProviders;
