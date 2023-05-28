import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CarsModule } from './cars/cars.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [CarsModule, BookingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
