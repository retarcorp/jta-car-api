import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import StateService from '../state.service';
import { Booking } from '../types/booking';
import TimingPolicy from '../utils/TimingPolicy';

@Injectable()
export class BookingsService {

    constructor(
        private readonly stateService: StateService
    ) {}

    async createBooking(start: Date, end: Date): Promise<Booking | null> {
        try {
            TimingPolicy.validate(start, end)
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
        }
        
        throw new Error('Not implemented!')
    }

    async getBookings(): Promise<Booking[]> {
        return this.stateService.getState().bookings
    }
}
