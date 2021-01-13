import { container } from 'tsyringe';
import uploadConfig from '@config/upload';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import DiskStorageProviders from '@shared/container/providers/StorageProvider/implementations/DiskStorageProviders';
import S3StorageProvider from '@shared/container/providers/StorageProvider/implementations/S3StorageProvider';

const providers = {
    disk: DiskStorageProviders,
    s3: S3StorageProvider,
};

container.registerSingleton<IStorageProvider>(
    'StorageProvider',
    providers[uploadConfig.driver],
);
