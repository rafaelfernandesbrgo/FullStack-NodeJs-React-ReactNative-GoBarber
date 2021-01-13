import { Router } from 'express';
import ensureAutheticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsControllers from '@modules/appointments/infra/http/controllers/AppointmentsControllers';
import ProviderAppointmentsController from '@modules/appointments/infra/http/controllers/ProviderAppointmentsController';
import { celebrate, Segments, Joi } from 'celebrate';

const appointmentsRouter = Router();
const appointmentsControllers = new AppointmentsControllers();
const providerAppointmentsController = new ProviderAppointmentsController();

appointmentsRouter.use(ensureAutheticated);

appointmentsRouter.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            provider_id: Joi.string().uuid().required(),
            date: Joi.date(),
        },
    }),
    appointmentsControllers.create,
);
appointmentsRouter.get('/me', providerAppointmentsController.index);

export default appointmentsRouter;
