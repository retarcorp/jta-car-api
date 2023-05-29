import { Test, TestingModule } from '@nestjs/testing';
import { BookingException, BookingsService } from './bookings.service';
import StateService from '../state.service';
import { CarsService } from '../cars/cars.service';

describe('BookingsService', () => {
  let bookingService: BookingsService;
  let carService: CarsService;

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
    const start = new Date(Date.now() + 4 * 1000 * 60 * 60) // +4 hours
    const end = new Date(start.getTime() + 1.5 * 1000 * 60 * 60) // + 5.5 hours
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

    test.todo('Should create two bookings for two different cars on the same time')
    test.todo('Should create two bookings for non-intersected time for one car')
    test.todo('Should not create booking for one car for intersected time')
  })

  describe('Booking timing policy violations check', () => {
    test.todo('Should not create booking for timing policy violations')
  })
});
