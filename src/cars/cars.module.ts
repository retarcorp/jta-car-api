import { Module } from '@nestjs/common';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';
import StoreModule from '../store/store.module';

@Module({
  imports: [StoreModule],
  controllers: [CarsController],
  providers: [CarsService]
})
export class CarsModule { }
