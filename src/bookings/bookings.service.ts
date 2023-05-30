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
            const isOverlap = (b.start.getTime() >= start.getTime()) && (b.end.getTime() <= end.getTime())

            return startIntersects || endIntersects || isOverlap;
        });
    }

    async createBooking(start: Date, end: Date): Promise<Booking | null> {
        try {
            TimingPolicy.validate(start, end)
        } catch (e) {
            throw e;
        }

        const cars = this.stateService.getState().cars;
        const allBookings = this.stateService.getState().bookings.map(b => ({
            car: b.car,
            start: new Date(b.start),
            end: new Date(b.end)
        }));
        
        const freeCar = cars.find((c) => {
            const bookings = allBookings.filter(({ car }) => car.id === c.id)
            const hasIntersections = this.hasIntersections(bookings, start, end);

            return !hasIntersections;
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