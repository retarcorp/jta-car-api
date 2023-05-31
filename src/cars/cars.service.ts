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
        const id = `C${number}`; // TODO can overlap existing bookings for removed cars
        const car = { id, maker: data.maker, model: data.model };

        await this.storeService.execMutation(MutationType.CREATE_CAR, car);
        // await this.storeService.mutate((o) => ({
        //     ...o,
        //     lastCarNumber: o.lastCarNumber + 1,
        //     cars: o.cars.concat([car])
        // }))
        const stateCar = this.storeService.getState().cars.find((c) => c.id === car.id);
        return stateCar;

    }

    async deleteCar(id: string): Promise<boolean> {
        const stateCar = this.storeService.getState().cars.find((c) => c.id === id);
        if (!stateCar) {
            throw new Error('Car not found!');
        }

        await this.storeService.mutate((o) => ({
            ...o,
            bookings: o.bookings.filter(b => b.car.id !== id),
            cars: o.cars.filter(c => c.id !== id)
        }))

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

        const newCar = { ...stateCar, ...updData } as Car;

        // await this.storeService.mutate(Mutations.UPDATE_CAR, payload)
        await this.storeService.mutate((o) => {
            const cars = ([...o.cars] as Car[])
            cars.splice(o.cars.indexOf(stateCar), 1, newCar);
            return {
                ...o,
                cars
            }
        })

        return newCar;
    }
}
