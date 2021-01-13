import { container } from 'tsyringe';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import BCryptHashProviders from '@modules/users/providers/HashProvider/implementations/BCryptHashProviders';

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProviders);
