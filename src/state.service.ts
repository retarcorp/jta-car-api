import { Injectable } from "@nestjs/common";

class SharedStore {
    public state: any;
    private initialState = {
        cars: [],
        bookings: []
    }

    constructor() {
        this.flushState();
    }

    flushState() {
        this.state = JSON.parse(JSON.stringify(this.initialState))
    }

    private static self = null;
    public static getInstance() {
        if (!SharedStore.self) {
            SharedStore.self = new SharedStore();
        }
        return SharedStore.self;
    }
}

@Injectable()
export default class StateService {
    
    private store: SharedStore = null;
    constructor() {
        this.store = SharedStore.getInstance();
    }

    getState(): any {
        return JSON.parse(JSON.stringify({...this.store.state}));
    }

    async mutate(mutator: (oldState: any) => any) {
        this.store.state = await mutator(this.getState());
    }

    restoreDefaultState() {
        this.store.flushState();
    }
}