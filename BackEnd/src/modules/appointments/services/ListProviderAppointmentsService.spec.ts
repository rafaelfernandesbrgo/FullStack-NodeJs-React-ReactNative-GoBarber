import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProviderAppointments: ListProviderAppointmentsService;

describe('ListProviderAppointments', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        fakeCacheProvider = new FakeCacheProvider();
        listProviderAppointments = new ListProviderAppointmentsService(
            fakeAppointmentsRepository,
            fakeCacheProvider,
        );
    });

    it('should be able to list the appointments on specfic day', async () => {
        const appointment1 = await fakeAppointmentsRepository.create({
            provider_id: 'one_user',
            user_id: 'other-user',
            date: new Date(2020, 4, 20, 14, 0, 0),
        });
        const appointment2 = await fakeAppointmentsRepository.create({
            provider_id: 'one_user',
            user_id: 'other-user',
            date: new Date(2020, 4, 20, 14, 0, 0),
        });

        const appointmens = await listProviderAppointments.execute({
            provider_id: 'one_user',
            year: 2020,
            month: 5,
            day: 20,
        });
        expect(appointmens).toEqual([appointment1, appointment2]);
    });
});
