import { Test, TestingModule } from '@nestjs/testing';
import { CarsService } from './cars.service';
import StateService from '../state.service';
import exp from 'constants';
import { Car } from 'src/types/car';
import { CarsModule } from './cars.module';

describe('CarsService', () => {
  let service: CarsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarsService, StateService],
    }).compile();

    service = module.get<CarsService>(CarsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Car creation', () => {

    it('Should correctly create car with valid data', async () => {

      const creationData = { maker: 'BMW', model: 'X5' }
      const createdCar = await service.addCar(creationData);

      expect(createdCar.maker).toBe(creationData.maker);
      expect(createdCar.model).toBe(creationData.model);
      expect(createdCar.id).toMatch(/^C[0-9]+$/)

      const carList = await service.fetchCars()
      expect(carList.findIndex((c) => c.id === createdCar.id)).toBeGreaterThanOrEqual(0);

    })

    it('Should not create car with insufficient data', () => {
      const creationData = { maker: 'BMW' } as Omit<Car, 'id'>
      const creator = service.addCar(creationData);

      expect(creator).rejects.toThrow()
    })

    it('Should not create car with null values', () => {
      const creationData = { maker: null, model: 'X5' }
      const creator = service.addCar(creationData);

      expect(creator).rejects.toThrow()
    })
  })

  describe('Car deletion', () => {

    it('Can delete existing car from state', async () => {
      const creationData = { maker: 'BMW', model: 'X5' }
      const createdCar = await service.addCar(creationData);
      const carList = await service.fetchCars()

      const deleteResult = await service.deleteCar(createdCar.id);
      const carListAfterDeletion = await service.fetchCars();

      expect(carList.length).toBe(carListAfterDeletion.length + 1);
      expect(deleteResult).toBeTruthy()
      expect(carListAfterDeletion.find((c) => c.id === createdCar.id)).toBeUndefined()

    })

    it('Cannot remove car that does not exist in state', async () => {
      const creationData = { maker: 'BMW', model: 'X5' }
      const createdCar = await service.addCar(creationData);

      const deleter = service.deleteCar('X-101');
      expect(deleter).rejects.toThrow();

    })

    it('Car removal is impossible if there are unfinished bookings for this car', () => {
      // throw new Error('Not implemented!')
    })

  })

  describe('Car updating', () => {

    it('Can update details of a car', async () => {
      const creationData = { maker: 'BMW', model: 'X5' }
      const createdCar = await service.addCar(creationData);

      const updateData = { id: createdCar.id, model: 'X6' }
      const updatedCar = await service.updateCar(updateData);

      expect(updatedCar.maker).toBe(createdCar.maker);
      expect(updatedCar.model).toBe(updateData.model);

      const cars = await service.fetchCars();
      console.log(cars, updatedCar);

      const isCarInState = cars.some((c) => c.id === updatedCar.id && c.maker === updatedCar.maker && c.model === updatedCar.model)

      expect(isCarInState).toBeTruthy()

    })


    it('Can not update car that does not exist', () => {
      const updData = { id: 'X-101', maker: 'None' }
      const updater = service.updateCar(updData);

      expect(updater).rejects.toThrow();
    })

    it('Can not update car without or nullish id', () => {
      const updData = { model: 'X6', maker: 'None' } as Car & { id: string };
      const updater = service.updateCar(updData);

      expect(updater).rejects.toThrow();
    })
  })




});
