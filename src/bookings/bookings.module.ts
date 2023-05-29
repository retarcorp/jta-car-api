import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import StateService from 'src/state.service';

@Module({
  controllers: [BookingsController],
  providers: [BookingsService, StateService]
})
export class BookingsModule {}
