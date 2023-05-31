import { Injectable } from "@nestjs/common";
import StoreService, { IReducer } from "../store.service";
import InternalStoreReducer from "./InternalStore.reducer";
import { MutationType } from "../mutations";

@Injectable()
export class InternalStoreService extends StoreService {
    
    private store: SharedStore = null;
    protected reducer: IReducer = null;

    constructor() {
        super();
        this.reducer = new InternalStoreReducer();
        this.store = SharedStore.getInstance();
    }

    getState(): any {
        return JSON.parse(JSON.stringify({...this.store.state}));
    }

    async execMutation(type: MutationType, payload: any) {
        const mutator = this.reducer.reduce(type, payload);
        this.mutate(mutator);
    }

    async mutate(mutator: (oldState: any) => any) {
        this.store.state = await mutator(this.getState());
    }

    restoreDefaultState() {
        this.store.flushState();
    }
}

class SharedStore {
    public state: any;
    private initialState = {
        cars: [],
        lastCarNumber: 0,
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