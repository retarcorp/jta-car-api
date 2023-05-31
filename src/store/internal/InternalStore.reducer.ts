import { MutationType } from "../mutations";
import { IReducer } from "../store.service";
import { addCar, deleteCar, updateCar } from "./cars.mutations";

export default class InternalStoreReducer implements IReducer {

    reduce(type: MutationType, payload: any): (oldState: any) => any {
        switch (type) {
            case MutationType.CREATE_CAR:
                return addCar(payload)

            case MutationType.DELETE_CAR:
                return deleteCar(payload);

            case MutationType.UPDATE_CAR:
                return updateCar(payload);

        }

        return null;
    }
}