import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { CarsService } from '../cars/cars.service';
import { HttpException } from '@nestjs/common';
import StoreModule from '../store/store.module';

describe('BookingsController', () => {
  let controller: BookingsController;
  let carService: CarsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      imports: [StoreModule],
      providers: [BookingsService, CarsService]
    }).compile();

    controller = module.get<BookingsController>(BookingsController);
    carService = module.get<CarsService>(CarsService);
    
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should return list of bookings', async () => {
    const result = await controller.fetchBookings();
    expect(Array.isArray(result)).toBeTruthy();
  })

  it('Should create valid booking', async () => {
    const car = await carService.addCar({ maker: 'BMW', 'model': 'X6'})
    const booking = await controller.createBooking(
      new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
      new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
    )

    expect(booking).toBeDefined();
    expect(booking.car.id).toBe(car.id);

  })

  it('Should throw on attempt to create booking without car', async () => {
    const booker = controller.createBooking(
      new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
      new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
    )

    expect(booker).rejects.toThrow(HttpException)
  })

  it('Should throw on violation of timing policy',async  () => {
    const car = await carService.addCar({ maker: 'BMW', 'model': 'X6'})
    const booker = controller.createBooking(
      new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
    )

    expect(booker).rejects.toThrow(HttpException)
  })

});
