/* eslint-disable no-console */
import { inject, injectable } from 'tsyringe';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import { getDate, getDaysInMonth, isAfter } from 'date-fns';

interface IRequest {
    provider_id: string;
    month: number;
    year: number;
}

type IResponse = Array<{
    day: number;
    available: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,
    ) {}

    public async execute({
        provider_id,
        year,
        month,
    }: IRequest): Promise<IResponse> {
        const appointments = await this.appointmentsRepository.findAllInMothfromProvider(
            {
                provider_id,
                year,
                month,
            },
        );

        // pega quantidade de dias no mês
        const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

        // monta um vetor de 1,2,3,4,5...dia fim do mês
        const eachDayArray = Array.from(
            { length: numberOfDaysInMonth },
            (_, index) => index + 1,
        );

        // retorna para cada dia, o dia e se ele está disponivel
        // a disponibilidade é avalida vendo se o provider tem 10 agendamentos, pois se sim, significa q todos os horarios estão lotados
        // além disso, compara com o dia de hoje, pois eles tem q ser indisponivel, pois já passou
        const availability = eachDayArray.map(day => {
            const compareDate = new Date(year, month - 1, day, 23, 59, 59);

            const appointmentsInDay = appointments.filter(appointment => {
                return getDate(appointment.date) === day;
            });
            return {
                day,
                available:
                    isAfter(compareDate, new Date()) &&
                    appointmentsInDay.length < 10,
            };
        });

        return availability;
    }
}

export default ListProviderMonthAvailabilityService;
