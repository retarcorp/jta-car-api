import { Injectable } from '@nestjs/common';
import { Car } from '../types/car';
import StoreService from '../store/store.service';
import { MutationType } from '../store/mutations';

@Injectable()
export class CarsService {
    constructor(
        private readonly storeService: StoreService
    ) { }

    async fetchCars(): Promise<Car[]> {
        const cars = this.storeService.getState().cars as Car[];
        return cars;
    }

    async addCar(data: Omit<Car, 'id'>): Promise<Car | null> {

        if (!data.maker || !data.model) {
            throw new Error('Insufficient data provided for creating car!')
        }

        const number = this.storeService.getState().lastCarNumber;
        const id = `C${number}`;
        const car = { id, maker: data.maker, model: data.model };

        await this.storeService.execMutation(MutationType.CREATE_CAR, car);
        const stateCar = this.storeService.getState().cars.find((c) => c.id === car.id);
        return stateCar;

    }

    async deleteCar(id: string): Promise<boolean> {
        const stateCar = this.storeService.getState().cars.find((c) => c.id === id);
        if (!stateCar) {
            throw new Error('Car not found!');
        }

        await this.storeService.execMutation(MutationType.DELETE_CAR, id);
        return !this.storeService.getState().cars.some((c) => c.id === id);
    }

    async updateCar(data: Partial<Car> & { id: string }): Promise<Car> {

        const updData = {
            ...(data.maker ? { maker: data.maker } : {}),
            ...(data.model ? { model: data.model } : {}),
        }
        const stateCar = this.storeService.getState().cars.find((c) => c.id === data.id);
        if (!stateCar) {
            throw new Error('Car not found!');
        }

        await this.storeService.execMutation(MutationType.UPDATE_CAR, { id: data.id, data: updData})
        const newCar = this.storeService.getState().cars.find((c) => c.id === data.id);
        return newCar;
    }
}
