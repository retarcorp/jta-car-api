import { Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req } from '@nestjs/common';
import { Car } from 'src/types/car';
import { CarsService } from './cars.service';
import { Request } from 'express';
import { request } from 'http';

@Controller('cars')
export class CarsController {

    constructor(
        private readonly carService: CarsService
    ) { }

    @Get('/')
    async getCars(): Promise<Car[]> {
        return await this.carService.fetchCars()
    }

    @Delete('/:id')
    async deleteCar(@Param('id') carId: string): Promise<{ result: boolean }> {
        try {
            const result = await this.carService.deleteCar(carId);
            return { result };
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.NOT_FOUND);
        }
    }

    @Post('/')
    async createCar(@Req() request: Request): Promise<Car> {
        const body = request.body;
        const { maker, model } = body;
        return await this.carService.addCar({ maker, model });
    }

    @Put('/:id')
    async updateCar(@Param('id') carId: string, @Req() request: Request): Promise<Car> {
        const body = request.body;
        try {
            return await this.carService.updateCar({ ...body, id: carId });
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.NOT_FOUND);
        }
    }
}
