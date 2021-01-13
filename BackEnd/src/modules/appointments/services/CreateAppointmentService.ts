import { inject, injectable } from 'tsyringe';
import { startOfHour, isBefore, getHours, format } from 'date-fns';
import AppError from '@shared/errors/AppError';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
    provider_id: string;
    user_id: string;
    date: Date;
}

@injectable()
class CreateAppointmentService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,

        @inject('NotificationsRepository')
        private notificationsRepository: INotificationsRepository,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) {}

    public async execute({
        provider_id,
        user_id,
        date,
    }: IRequest): Promise<Appointment> {
        // coloca a hora inicial
        const appointmentDate = startOfHour(date);

        // n pode agendar para horarios passados
        if (isBefore(appointmentDate, Date.now())) {
            throw new AppError(
                'You can not create an appointment on a past date.',
            );
        }
        // n pode agendar consigo msm
        if (provider_id === user_id) {
            throw new AppError(
                'You can not create an appointment with yourself.',
            );
        }

        // n pode agendar antes das 7am nem depois das 5pm
        if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
            throw new AppError(
                'You can only create an appointment between 8am and 5pm.',
            );
        }

        // ve se já reservada
        const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
            appointmentDate,
            provider_id,
        );
        if (findAppointmentInSameDate) {
            throw new AppError('this appointment is alread booked.');
        }

        // chama para criar
        const appointment = await this.appointmentsRepository.create({
            provider_id,
            user_id,
            date: appointmentDate,
        });

        const dateFormatted = format(
            appointmentDate,
            "dd/MM/yyyy 'às' HH:mm'h'",
        );

        await this.notificationsRepository.create({
            recipient_id: provider_id,
            content: `Novo agendamento para dia ${dateFormatted}`,
        });

        const cacheKey = `provider-appointments:${provider_id}:${format(
            appointmentDate,
            'yyyy-M-d',
        )}`;

        await this.cacheProvider.invalidate(cacheKey);

        return appointment;
    }
}

export default CreateAppointmentService;
