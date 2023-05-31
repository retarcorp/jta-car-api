import { MutationType } from "./mutations";

export default abstract class StoreService {
    abstract getState(): any;
    abstract execMutation(type: MutationType, payload: any): Promise<any>
    abstract restoreDefaultState(): void;
    protected abstract reducer: IReducer;
}

export interface IReducer {
    reduce(type: MutationType, payload: any): (oldState: any) => Promise<any>
}
