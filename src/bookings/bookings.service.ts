import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import StateService from '../state.service';
import { Booking } from '../types/booking';
import TimingPolicy from '../utils/TimingPolicy';

@Injectable()
export class BookingsService {

    constructor(
        private readonly stateService: StateService
    ) { }

    private hasIntersections(bookings: Booking[], start: Date, end: Date) {
        return bookings.some((b: Booking) => {
            const inInterval = (dp: Date) => (b.start.getTime() < dp.getTime()) && (b.end.getTime() > dp.getTime());
            const startIntersects = inInterval(start)
            const endIntersects = inInterval(end);

            return startIntersects || endIntersects;
        });
    }

    async createBooking(start: Date, end: Date): Promise<Booking | null> {
        try {
            TimingPolicy.validate(start, end)
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
        }

        const cars = this.stateService.getState().cars;
        const allBookings = this.stateService.getState().bookings;

        const freeCar = cars.find((c) => {
            const bookings = allBookings.filter(({ car }) => car.id === c.id)
            return !this.hasIntersections(bookings, start, end);
        })

        if (!freeCar) {
            throw new BookingException('No cars available for booking!');
        }

        const booking: Booking = {
            car: freeCar,
            start,
            end
        }

        await this.stateService.mutate((o) => ({
            ...o,
            bookings: o.bookings.concat([booking])
        }));

        return booking;
    }

    async getBookings(): Promise<Booking[]> {
        return this.stateService.getState().bookings
    }
}

export class BookingException extends Error { }