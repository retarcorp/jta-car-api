import { Module } from '@nestjs/common';
import { CarsModule } from './cars/cars.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [CarsModule, BookingsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
