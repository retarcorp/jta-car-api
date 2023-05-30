import { Injectable } from '@nestjs/common';
import StateService from '../state.service';
import { Car } from '../types/car';

@Injectable()
export class CarsService {
    constructor(
        private readonly stateService: StateService
    ) { }

    async fetchCars(): Promise<Car[]> {
        const cars = this.stateService.getState().cars as Car[];
        return cars;
    }

    async addCar(data: Omit<Car, 'id'>): Promise<Car | null> {

        if (!data.maker || !data.model) {
            throw new Error('Insufficient data provided for creating car!')
        }

        const number = this.stateService.getState().lastCarNumber;
        const id = `C${number}`; // TODO can overlap existing bookings for removed cars
        const car = { id, maker: data.maker, model: data.model };

        await this.stateService.mutate((o) => ({
            ...o,
            lastCarNumber: o.lastCarNumber + 1,
            cars: o.cars.concat([car])
        }))
        const stateCar = this.stateService.getState().cars.find((c) => c.id === car.id);
        return stateCar;

    }

    async deleteCar(id: string): Promise<boolean> {
        const stateCar = this.stateService.getState().cars.find((c) => c.id === id);
        if (!stateCar) {
            throw new Error('Car not found!');
        }

        await this.stateService.mutate((o) => ({
            ...o,
            bookings: o.bookings.filter(b => b.car.id !== id),
            cars: o.cars.filter(c => c.id !== id)
        }))

        return !this.stateService.getState().cars.some((c) => c.id === id);
    }

    async updateCar(data: Partial<Car> & { id: string }): Promise<Car> {

        const updData = {
            ...(data.maker ? { maker: data.maker } : {}),
            ...(data.model ? { model: data.model } : {}),
        }
        const stateCar = this.stateService.getState().cars.find((c) => c.id === data.id);
        if (!stateCar) {
            throw new Error('Car not found!');
        }

        const newCar = { ...stateCar, ...updData } as Car;

        await this.stateService.mutate((o) => {
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
