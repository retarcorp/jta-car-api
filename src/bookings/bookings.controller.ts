import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { BookingException, BookingsService } from './bookings.service';
import TimingPolicy, { TimingPolicyException } from '../utils/TimingPolicy';
import { ApiNotFoundResponse, ApiOkResponse, ApiResponse } from '@nestjs/swagger';

@Controller('bookings')
export class BookingsController {

    constructor(
        private readonly bookingService: BookingsService
    ) { }

    @ApiOkResponse({ description: 'Booking creates successfully, returns booking as a response.' })
    @ApiNotFoundResponse({ description: 'Unable to create booking - possibility not found.' })
    @ApiResponse({ status: HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE, description: 'Given timing range is not acceptable.' })
    @Post('/')
    async createBooking(
        @Body('start') startString: string,
        @Body('end') endString: string
    ) {
        const [start, end] = [startString, endString].map(d => new Date(d));

        try {
            return await this.bookingService.createBooking(start, end);

        } catch (e) {
            if (e instanceof BookingException) {
                throw new HttpException(e.message, HttpStatus.NOT_FOUND)
            }

            if (e instanceof TimingPolicyException) {
                throw new HttpException(e.message, HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE);
            }
        }

    }

    @ApiOkResponse({ description: 'List of all bookings in internal memory.' })
    @Get('/')
    async fetchBookings() {
        return await this.bookingService.getBookings();
    }
}
