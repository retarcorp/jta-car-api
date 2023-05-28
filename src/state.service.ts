import { Injectable } from "@nestjs/common";

@Injectable()
export default class StateService {
    
    private state: any;

    constructor() {
        this.state = {
            cars: [],
            bookings: []
        }
    }


    getState(): any {
        return JSON.parse(JSON.stringify({...this.state}));
    }

    async mutate(mutator: (oldState: any) => any) {
        this.state = await mutator(this.getState());
    }

}