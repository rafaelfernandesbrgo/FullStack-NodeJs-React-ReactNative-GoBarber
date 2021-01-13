import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthProvidersDTO from '@modules/appointments/dtos/IFindAllInMonthProvidersDTO';
import IFindAllInDayProvidersDTO from '@modules/appointments/dtos/IFindAllInDayProvidersDTO ';

export default interface IAppointmentsRepository {
    create(data: ICreateAppointmentDTO): Promise<Appointment>;
    findByDate(
        date: Date,
        provider_id: string,
    ): Promise<Appointment | undefined>;
    findAllInMothfromProvider(
        data: IFindAllInMonthProvidersDTO,
    ): Promise<Appointment[]>;
    findAllInDayProvider(
        data: IFindAllInDayProvidersDTO,
    ): Promise<Appointment[]>;
}
