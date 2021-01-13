import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import { uuid } from 'uuidv4';
import { getDate, getMonth, getYear, isEqual } from 'date-fns';
import IFindAllInMonthProvidersDTO from '@modules/appointments/dtos/IFindAllInMonthProvidersDTO';
import IFindAllInDayProvidersDTO from '@modules/appointments/dtos/IFindAllInDayProvidersDTO ';

class AppointmentsRepository implements IAppointmentsRepository {
    private appointments: Appointment[] = [];

    public async findAllInDayProvider({
        provider_id,
        day,
        month,
        year,
    }: IFindAllInDayProvidersDTO): Promise<Appointment[]> {
        const findAppointment = this.appointments.filter(
            appointment =>
                appointment.provider_id === provider_id &&
                getDate(appointment.date) === day && // month do js começa em 0, assim soma +1
                getMonth(appointment.date) + 1 === month && // month do js começa em 0, assim soma +1
                getYear(appointment.date) === year,
        );
        return findAppointment;
    }

    public async findAllInMothfromProvider({
        provider_id,
        month,
        year,
    }: IFindAllInMonthProvidersDTO): Promise<Appointment[]> {
        const findAppointment = this.appointments.filter(
            appointment =>
                appointment.provider_id === provider_id &&
                getMonth(appointment.date) + 1 === month && // month do js começa em 0, assim soma +1
                getYear(appointment.date) === year,
        );
        return findAppointment;
    }

    public async findByDate(
        date: Date,
        provider_id: string,
    ): Promise<Appointment | undefined> {
        const findAppointment = this.appointments.find(
            appointment =>
                isEqual(appointment.date, date) &&
                appointment.provider_id === provider_id,
        );
        return findAppointment;
    }

    public async create({
        provider_id,
        user_id,
        date,
    }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = new Appointment();
        appointment.id = uuid();
        appointment.date = date;
        appointment.provider_id = provider_id;
        appointment.user_id = user_id;
        this.appointments.push(appointment);
        return appointment;
    }
}

export default AppointmentsRepository;
