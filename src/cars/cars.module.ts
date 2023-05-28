import { Module } from '@nestjs/common';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';
import StateService from 'src/state.service';

@Module({
  controllers: [CarsController],
  providers: [CarsService, StateService]
})
export class CarsModule {}
