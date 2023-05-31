import { Test, TestingModule } from '@nestjs/testing';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';
import { HttpException } from '@nestjs/common';
import StoreModule from '../store/store.module';

describe('CarsController', () => {
  let controller: CarsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [StoreModule],
      controllers: [CarsController],
      providers: [CarsService]
    }).compile();

    controller = module.get<CarsController>(CarsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should create car', async () => {
    const mockData = { maker: 'BMW', model: 'X6'};
    const car = await controller.createCar(mockData);
    expect(car.id).toBeDefined();
    expect(car.model).toBe(mockData.model);
    expect(car.maker).toBe(mockData.maker);
  })

  it('Should return cars', async () => {
    const results = await controller.getCars();
    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBeTruthy()
  })

  it('Should update car', async () => {
    const mockData = { maker: 'BMW', model: 'X6'};
    const updData = { model: 'X7'};
    const car = await controller.createCar(mockData);

    const updCar = await controller.updateCar(car.id, updData);
    expect(updCar.id).toBe(car.id);
    expect(updCar.maker).toBe(mockData.maker);
    expect(updCar.model).toBe(updData.model);

  })

  it('Should throw on updating missing car', () => {
    const updater = controller.updateCar('X-101', {});
    expect(updater).rejects.toThrow(HttpException);
  })

  it('Should delete car', async () => {
    const mockData = { maker: 'BMW', model: 'X6'};
    const car = await controller.createCar(mockData);

    const deleteResult = await controller.deleteCar(car.id);
    expect(deleteResult.result).toBeTruthy();

    const cars = await controller.getCars();
    expect(cars.some(c => c.id === car.id)).toBeFalsy()
  })

  it('Should throw on deleting missing car', async () => {
      const deleter = controller.deleteCar('X-101');
      expect(deleter).rejects.toThrow(HttpException);
  })

});
