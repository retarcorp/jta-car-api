import { Injectable } from '@nestjs/common';
import StateService from 'src/state.service';
import { Car } from 'src/types/car';

@Injectable()
export class CarsService {
    constructor(
        private readonly stateService: StateService
    ) { }

    async fetchCars(): Promise<Car[]> {
        const cars = this.stateService.getState().cars as Car[];
        return cars;
    }

    async addCar(data: Partial<Car>): Promise<Car | null> {
        const cars = await this.fetchCars();
        const id = `C${cars.length}`;
        const car = { id, maker: data.maker, model: data.model };

        this.stateService.mutate((o) => ({
            ...o,
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

        this.stateService.mutate((o) => ({
            ...o,
            cars: o.cars.filter(c => c.id !== id)
        }))

        return !this.stateService.getState().cars.some((c) => c.id === id);
    }

    async updateCar(data: Partial<Car>): Promise<Car> {

        const stateCar = this.stateService.getState().cars.find((c) => c.id === data.id);
        if (!stateCar) {
            throw new Error('Car not found!');
        }

        const newCar = { ...data } as Car;

        this.stateService.mutate((o) => {
            const cars = ([...o.cars] as Car[]).splice(o.cars.findIndex(stateCar), 1, newCar); 
            return {
                ...o,
                cars
            }
        })

        return newCar;
    }
}
