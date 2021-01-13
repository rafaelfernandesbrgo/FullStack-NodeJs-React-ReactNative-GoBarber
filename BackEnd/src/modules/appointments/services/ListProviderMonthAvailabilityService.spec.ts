import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
            fakeAppointmentsRepository,
        );
    });

    it('should be able to list the moth availabiltity from provider', async () => {
        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id: 'other-user',
            date: new Date(2020, 4, 20, 8, 0, 0), // 20/05/2020 - 8:00:00
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id: 'other-user',
            date: new Date(2020, 4, 20, 9, 0, 0), // 20/05/2020 - 9:00:00
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id: 'other-user',
            date: new Date(2020, 4, 20, 10, 0, 0), // 20/05/2020 - 10:00:00
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id: 'other-user',
            date: new Date(2020, 4, 20, 11, 0, 0), // 20/05/2020 - 11:00:00
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id: 'other-user',
            date: new Date(2020, 4, 20, 12, 0, 0), // 20/05/2020 - 12:00:00
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id: 'other-user',
            date: new Date(2020, 4, 20, 13, 0, 0), // 20/05/2020 - 13:00:00
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id: 'other-user',
            date: new Date(2020, 4, 20, 14, 0, 0), // 20/05/2020 - 14:00:00
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id: 'other-user',
            date: new Date(2020, 4, 20, 15, 0, 0), // 20/05/2020 - 15:00:00
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id: 'other-user',
            date: new Date(2020, 4, 20, 16, 0, 0), // 20/05/2020 - 16:00:00
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id: 'other-user',
            date: new Date(2020, 4, 20, 17, 0, 0), // 20/05/2020 - 17:00:00
        });

        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id: 'other-user',
            date: new Date(2020, 4, 21, 8, 0, 0), // 21/05/2020 - 8:00:00
        });
        const availability = await listProviderMonthAvailability.execute({
            provider_id: 'user',
            year: 2020,
            month: 5,
        });
        expect(availability).toEqual(
            expect.arrayContaining([
                { day: 19, available: true },
                { day: 20, available: false },
                { day: 21, available: true },
                { day: 22, available: true },
            ]),
        );
    });
});
