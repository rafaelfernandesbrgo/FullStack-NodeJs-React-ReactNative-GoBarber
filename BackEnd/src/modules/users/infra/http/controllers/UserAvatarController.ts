import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateUserAvartarService from '@modules/users/services/UpdateUserAvatarService';
import { classToClass } from 'class-transformer';

export default class UserAvatarController {
    public async update(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const updateUserAvartar = container.resolve(UpdateUserAvartarService);
        const user = await updateUserAvartar.execute({
            user_id: request.user.id,
            avatarFilename: request.file.filename,
        });
        return response.json(classToClass(user));
    }
}
