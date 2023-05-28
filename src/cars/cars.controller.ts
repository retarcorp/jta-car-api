import { Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { Car } from 'src/types/car';
import { CarsService } from './cars.service';
import { Request } from 'express';
import { request } from 'http';

@Controller('cars')
export class CarsController {

    constructor(
        private readonly carService: CarsService
    ) {}

    @Get('/')
    async getCars(): Promise<Car[]> {
        return await this.carService.fetchCars()
    }

    @Delete('/:id')
    async deleteCar(@Param('id') carId: string): Promise<boolean> {
        return await this.carService.deleteCar(carId);
    }

    @Post('/')
    async createCar(@Req() request: Request): Promise<Car> {
        const body = request.body;
        return await this.carService.addCar(body);        
    }

    @Put('/:id')
    async updateCar(@Param('id') carId: string, @Req() request: Request): Promise<Car> {
        const body = request.body;
        return await this.carService.updateCar({ id: carId, ...body});
    }
}
