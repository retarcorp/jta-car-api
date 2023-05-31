export const createBooking = (booking) => (o) => ({
    ...o,
    bookings: o.bookings.concat([booking])
})