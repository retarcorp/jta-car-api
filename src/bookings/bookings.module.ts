import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import StoreModule from '../store/store.module';

@Module({
  controllers: [BookingsController],
  providers: [BookingsService],
  imports: [StoreModule],
})
export class BookingsModule {}
