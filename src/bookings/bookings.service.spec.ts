import { Test, TestingModule } from '@nestjs/testing';
import { BookingException, BookingsService } from './bookings.service';
import StateService from '../state.service';
import { CarsService } from '../cars/cars.service';
import TimingPolicy, { TimingPolicyException } from '../utils/TimingPolicy';

describe('BookingsService', () => {
  let bookingService: BookingsService;
  let carService: CarsService;
  const MS_HOUR = 1000 * 60 * 60;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookingsService, StateService, CarsService],
    }).compile();

    bookingService = module.get<BookingsService>(BookingsService);
    carService = module.get<CarsService>(CarsService);
  });

  it('should be defined', () => {
    expect(bookingService).toBeDefined();
    expect(carService).toBeDefined()
  });

  const getValidStartEnd = () => {
    const start = new Date(Date.now() + 4 * MS_HOUR) // +4 hours
    const end = new Date(start.getTime() + 1.5 * MS_HOUR) // + 5.5 hours
    return [start, end]
  }

  describe('Booking usecases check', () => {
    it('Should not create booking when no cars available', () => {
      const [start, end] = getValidStartEnd();
      const booker = bookingService.createBooking(start, end);

      expect(booker).rejects.toThrow(BookingException);
    });

    it('Should create valid booking for valid car', async () => {
        const car = await carService.addCar({maker: 'BMW', model: 'X6'});
        const [start, end] = getValidStartEnd();

        const booking = await bookingService.createBooking(start, end);

        expect(booking).toBeDefined();
        expect(booking.car.id).toBe(car.id);
        expect(booking.start.getTime()).toBe(start.getTime());
        expect(booking.end.getTime()).toBe(end.getTime())
    });

    it('Should create two bookings for two different cars on the same time', async () => {
      const car1 = await carService.addCar({maker: 'BMW', model: 'X5'})
      const car2 = await carService.addCar({maker: 'BMW', model: 'X6'})
      const [start, end] = getValidStartEnd();

      const booking1 = await bookingService.createBooking(start, end);
      const booking2 = await bookingService.createBooking(start, end);

      expect(booking1).toBeDefined();
      expect(booking2).toBeDefined();

      expect(booking1.car.id).not.toBe(booking2.car.id);
      expect([car1.id, car2.id]).toContain(booking1.car.id)
      expect([car1.id, car2.id]).toContain(booking2.car.id)


    })


    it('Should create two bookings for non-intersected time for one car', async () => {
      const car1 = await carService.addCar({maker: 'BMW', model: 'X5'})
      const car2 = await carService.addCar({maker: 'BMW', model: 'X6'})
      const [start, end] = getValidStartEnd();
      const startPlus = new Date(start.getTime() + 3 * MS_HOUR);
      const endPlus = new Date(end.getTime() + 3 * MS_HOUR);

      const booking1 = await bookingService.createBooking(start, end);
      const booking2 = await bookingService.createBooking(startPlus, endPlus);

      expect(booking1).toBeDefined();
      expect(booking2).toBeDefined();
      expect(booking1.car.id).toBe(booking2.car.id);
    })

    it('Should not create booking for one car for intersected time', async () => {
      const car =  await carService.addCar({maker: 'BMW', model: 'X5'})
      const [start, end] = getValidStartEnd();
      const booking1 = await bookingService.createBooking(start, end);
      const startPlus = new Date(start.getTime() + 1 * MS_HOUR);
      const endPlus = new Date(end.getTime() + 1 * MS_HOUR);

      const booker = bookingService.createBooking(startPlus, endPlus);
      expect(booker).rejects.toThrow(BookingException);
    })
  })

  describe('Booking timing policy violations check', () => {
    const createCar = async () => await carService.addCar({maker: 'BMW', model: 'X5'})
    beforeEach(async () => {
      await createCar();
    })

    it('Should not create booking starting in past', async () => {
      const start = new Date(Date.now() - 1 * MS_HOUR);
      const end = new Date(Date.now() + 1 * MS_HOUR);

      const booker = bookingService.createBooking(start, end);
      expect(booker).rejects.toThrow(TimingPolicyException);

    })

    it('Should not create booking starting in too distant future', () => {
      const start = new Date(Date.now() + (TimingPolicy.allowedStartPutOffHours + 1) * MS_HOUR);
      const end = new Date(Date.now() + (TimingPolicy.allowedStartPutOffHours + 2) * MS_HOUR);
      
      const booker = bookingService.createBooking(start, end);
      expect(booker).rejects.toThrow(TimingPolicyException);
    })

    it('Should not create booking lasting for more than allowed', () => {
      const [start] = getValidStartEnd();
      const end = new Date(start.getTime() + (TimingPolicy.allowedDurationHours + 1) * MS_HOUR);
      
      const booker = bookingService.createBooking(start, end);
      expect(booker).rejects.toThrow(TimingPolicyException);
    })

    it('Should not create booking where end is before start', () => {
      const [end, start] = getValidStartEnd();
      const booker = bookingService.createBooking(start, end);
      expect(booker).rejects.toThrow(TimingPolicyException);
    })
  })
});
