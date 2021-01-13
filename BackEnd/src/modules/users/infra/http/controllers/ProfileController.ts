import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateProfileServices from '@modules/users/services/UpdateProfileServices';
import ShowProfileService from '@modules/users/services/ShowProfileService';
import { classToClass } from 'class-transformer';

// n foi colocado no userControler pq lá pode ter um metodo update para qualquer usuario, tipo em uma administrador do sistema
// aqui é o update de usuarios logados

export default class ProfileController {
    public async show(request: Request, response: Response): Promise<Response> {
        const user_id = request.user.id;
        const showProfile = container.resolve(ShowProfileService);
        const user = await showProfile.execute({
            user_id,
        });
        return response.json(classToClass(user));
    }

    public async update(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const user_id = request.user.id;
        const { name, email, old_password, password } = request.body;

        const updateProfile = container.resolve(UpdateProfileServices);

        const user = await updateProfile.execute({
            user_id,
            name,
            email,
            old_password,
            password,
        });
        return response.json(classToClass(user));
    }
}
