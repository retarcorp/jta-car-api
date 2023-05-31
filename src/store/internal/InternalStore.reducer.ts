import { MutationType } from "../mutations";
import { IReducer } from "../store.service";
import { createBooking } from "./booking.mutations";
import { addCar, deleteCar, updateCar } from "./cars.mutations";

export default class InternalStoreReducer implements IReducer {

    reduce(type: MutationType, payload: any): (oldState: any) => Promise<any> {
        switch (type) {
            case MutationType.CREATE_CAR:
                return addCar(payload)

            case MutationType.DELETE_CAR:
                return deleteCar(payload);

            case MutationType.UPDATE_CAR:
                return updateCar(payload);

            case MutationType.CREATE_BOOKING:
                return createBooking(payload);

        }

        throw new Error('Mutation type not found!');
    }
}