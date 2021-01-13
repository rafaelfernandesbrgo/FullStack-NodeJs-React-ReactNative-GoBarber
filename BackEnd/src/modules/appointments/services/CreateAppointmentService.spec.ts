import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import AppError from '@shared/errors/AppError';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        fakeNotificationsRepository = new FakeNotificationsRepository();
        fakeCacheProvider = new FakeCacheProvider();
        createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository,
            fakeNotificationsRepository,
            fakeCacheProvider,
        );
    });

    it('should be able to create a new appointment', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });
        const appoitment = await createAppointment.execute({
            date: new Date(2020, 4, 10, 13),
            user_id: '123123122',
            provider_id: '123123123',
        });
        expect(appoitment).toHaveProperty('id');
        expect(appoitment.provider_id).toBe('123123123');
    });

    it('shouldnot  be able to create two appointments on the same time', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });
        const appointmentDate = new Date(2020, 4, 10, 13); // 13:00 do 05/10/2020
        await createAppointment.execute({
            date: appointmentDate,
            user_id: '123123122',
            provider_id: '123123123',
        });
        await expect(
            createAppointment.execute({
                date: appointmentDate,
                user_id: '123123122',
                provider_id: '123123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment on a past date', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(
            createAppointment.execute({
                date: new Date(2020, 4, 10, 11),
                user_id: '123123122',
                provider_id: '123123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointments with same user as provider', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(
            createAppointment.execute({
                date: new Date(2020, 4, 10, 13),
                user_id: '123123123',
                provider_id: '123123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointments befor 8am and after 5pm', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(
            createAppointment.execute({
                date: new Date(2020, 4, 11, 7),
                user_id: '123123122',
                provider_id: '123123123',
            }),
        ).rejects.toBeInstanceOf(AppError);

        await expect(
            createAppointment.execute({
                date: new Date(2020, 4, 11, 18),
                user_id: '123123122',
                provider_id: '123123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
