import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import fs from 'fs';
import path from 'path';
import uploadConfig from '@config/upload';
import aws, { S3 } from 'aws-sdk';
import mime from 'mime';

class S3StorageProvider implements IStorageProvider {
    private client: S3;

    constructor() {
        this.client = new aws.S3({
            region: 'regiao Da Credencial',
        });
    }

    public async saveFile(file: string): Promise<string> {
        const originPath = path.resolve(uploadConfig.tempFolder, file);

        const ContentType = mime.getType(originPath);

        if (!ContentType) {
            throw new AppError('File not found');
        }

        const fileContet = await fs.promises.readFile(originPath);

        await this.client
            .putObject({
                Bucket: uploadConfig.config.aws.bucket,
                Key: file,
                ACL: 'public-read',
                Body: fileContet,
                ContentType,
            })
            .promise();

        await fs.promises.unlink(originPath);

        return file;
    }

    public async deleteFile(file: string): Promise<void> {
        await this.client
            .deleteObject({
                Bucket: uploadConfig.config.aws.bucket,
                Key: file,
            })
            .promise();
    }
}
export default S3StorageProvider;
