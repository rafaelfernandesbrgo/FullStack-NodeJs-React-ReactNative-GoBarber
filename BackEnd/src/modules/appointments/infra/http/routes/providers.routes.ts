import { Router } from 'express';
import ensureAutheticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '@modules/appointments/infra/http/controllers/ProvidersController';
import ProviderDayAvailabityController from '@modules/appointments/infra/http/controllers/ProviderDayAvailabityController';
import ProviderMonthAvailabityController from '@modules/appointments/infra/http/controllers/ProviderMonthAvailabityController.ts';
import { celebrate, Segments, Joi } from 'celebrate';

const providersRouter = Router();
const providersController = new ProvidersController();
const providerDayAvailabityController = new ProviderDayAvailabityController();
const providerMonthAvailabityController = new ProviderMonthAvailabityController();

providersRouter.use(ensureAutheticated);
providersRouter.get('/', providersController.index);
providersRouter.get(
    '/:provider_id/month-availability',
    celebrate({
        [Segments.PARAMS]: {
            provider_id: Joi.string().uuid().required(),
        },
    }),
    providerMonthAvailabityController.index,
);
providersRouter.get(
    '/:provider_id/day-availability',
    celebrate({
        [Segments.PARAMS]: {
            provider_id: Joi.string().uuid().required(),
        },
    }),
    providerDayAvailabityController.index,
);

export default providersRouter;
