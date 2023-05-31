import { Car } from "src/types/car";

export const addCar = (newCar) => (o) => ({
    ...o,
    lastCarNumber: o.lastCarNumber + 1,
    cars: o.cars.concat([newCar])
})

export const deleteCar = (id) => (o) => ({
    ...o,
    bookings: o.bookings.filter(b => b.car.id !== id),
    cars: o.cars.filter(c => c.id !== id)
})

export const updateCar = ({id, data}) => (o) => {

    const cars = ([...o.cars] as Car[])
    const stateCar = cars.find((c) => c.id === id);
    const newCar = { ...stateCar, ...data } as Car;

    cars.splice(o.cars.indexOf(stateCar), 1, newCar);
    return {
        ...o,
        cars
    }
}