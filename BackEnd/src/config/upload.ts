import multer, { StorageEngine } from 'multer';
import path from 'path';
import crypto from 'crypto';

const tempFolder = path.resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
    driver: 's3' | 'disk';

    tempFolder: string;
    uploadsFolder: string;

    multer: {
        storage: StorageEngine;
    };

    config: {
        disk: Record<string, never>;
        aws: {
            bucket: string;
        };
    };
}

export default {
    driver: process.env.STORAGE_DRIVER,

    tempFolder,
    uploadsFolder: path.resolve(tempFolder, 'upload'),

    multer: {
        storage: multer.diskStorage({
            destination: tempFolder,
            filename(request, file, callback) {
                const fileHash = crypto.randomBytes(10).toString('hex');
                const filename = `${fileHash}-${file.originalname}`;
                return callback(null, filename);
            },
        }),
    },

    config: {
        disk: {},
        aws: {
            bucket: 'nome do buket cadastrado na aws',
        },
    },
} as IUploadConfig;
