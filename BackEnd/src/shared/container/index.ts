import { container } from 'tsyringe';
import '@modules/users/providers';
import '@shared/container/providers';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

import IUsersRepositories from '@modules/users/repositories/IUsersRepositories';
import UsersRepositories from '@modules/users/infra/typeorm/repositories/UsersRepositories';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UsersTokensRepositoriy from '@modules/users/infra/typeorm/repositories/UsersTokensRepositoriy';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import NotificationsRepository from '@modules/notifications/infra/typeorm/repositories/NotificationsRepository';

container.registerSingleton<IUsersRepositories>(
    'UsersRepositories',
    UsersRepositories,
);

container.registerSingleton<IAppointmentsRepository>(
    'AppointmentsRepository',
    AppointmentsRepository,
);

container.registerSingleton<IUserTokensRepository>(
    'UsersTokensRepositoriy',
    UsersTokensRepositoriy,
);

container.registerSingleton<INotificationsRepository>(
    'NotificationsRepository',
    NotificationsRepository,
);
