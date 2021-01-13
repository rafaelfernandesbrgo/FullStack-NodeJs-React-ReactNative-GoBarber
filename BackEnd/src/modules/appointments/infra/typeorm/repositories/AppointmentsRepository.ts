import { getRepository, Repository, Raw } from 'typeorm';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthProvidersDTO from '@modules/appointments/dtos/IFindAllInMonthProvidersDTO';
import IFindAllInDayProvidersDTO from '@modules/appointments/dtos/IFindAllInDayProvidersDTO ';

class AppointmentsRepository implements IAppointmentsRepository {
    private ormRepository: Repository<Appointment>;

    constructor() {
        this.ormRepository = getRepository(Appointment);
    }

    public async findAllInMothfromProvider({
        provider_id,
        month,
        year,
    }: IFindAllInMonthProvidersDTO): Promise<Appointment[]> {
        // primeiro converte para string
        // depois, se n tiver 2 digitos, coloca no inicio o 0
        const parsedMonth = String(month).padStart(2, '0');

        // filtra conforme as condiçoes
        const appointments = this.ormRepository.find({
            where: {
                provider_id,
                // para provider_id = provider_id
                date: Raw(
                    dateFieldName =>
                        `to_char(${dateFieldName}, 'MM-YYYY')= '${parsedMonth}-${year}'`,
                    // monta uma querry para o campo date
                    // to chart função do postgres q pega um texto e extrai dele conforme o parametro MM-YYYY
                    // n pode usar diretamente e sim o datefieldName, pois o postgress muda os nomes do campo com id
                ),
            },
        });
        return appointments;
    }

    public async findAllInDayProvider({
        provider_id,
        day,
        month,
        year,
    }: IFindAllInDayProvidersDTO): Promise<Appointment[]> {
        const parsedDay = String(day).padStart(2, '0');
        const parsedMonth = String(month).padStart(2, '0');

        const appointments = this.ormRepository.find({
            where: {
                provider_id,
                date: Raw(
                    dateFieldName =>
                        `to_char(${dateFieldName}, 'DD-MM-YYYY')= '${parsedDay}-${parsedMonth}-${year}'`,
                ),
            },
            relations: ['user'],
        });
        return appointments;
    }

    public async findByDate(
        date: Date,
        provider_id: string,
    ): Promise<Appointment | undefined> {
        const findAppointment = await this.ormRepository.findOne({
            where: { date, provider_id },
        });
        return findAppointment;
    }

    public async create({
        provider_id,
        date,
        user_id,
    }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = this.ormRepository.create({
            provider_id,
            user_id,
            date,
        });
        await this.ormRepository.save(appointment);
        return appointment;
    }
}

export default AppointmentsRepository;
