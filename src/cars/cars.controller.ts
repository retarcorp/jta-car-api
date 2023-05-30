import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req } from '@nestjs/common';
import { Car } from 'src/types/car';
import { CarsService } from './cars.service';
import { Request } from 'express';
import { request } from 'http';
import { ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';

@Controller('cars')
export class CarsController {

    constructor(
        private readonly carService: CarsService
    ) { }

    @ApiOkResponse({ description: 'Array of cars stored in internal memory', })
    @Get('/')
    async getCars(): Promise<Car[]> {
        return await this.carService.fetchCars()
    }

    @ApiOkResponse({ description: 'Deletion went successfully.' })
    @ApiNotFoundResponse({ description: 'Requested car not found.' })
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
    @ApiOkResponse({ description: 'Car created successfully, returns new car as response. ' })
    async createCar(@Body() body: Omit<Car, 'id'>): Promise<Car> {
        const { maker, model } = body;
        return await this.carService.addCar({ maker, model });
    }

    @ApiOkResponse({ description: 'Car updated successfully, returns updated car as a response.' })
    @ApiNotFoundResponse({ description: 'Requested car not found.' })
    @Put('/:id')
    async updateCar(@Param('id') carId: string, @Body() body: Partial<Car>): Promise<Car> {
        try {
            return await this.carService.updateCar({ ...body, id: carId });
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.NOT_FOUND);
        }
    }
}
