export default abstract class StoreService {
    abstract getState(): any;
    abstract mutate(mutator: (any) => any): Promise<any>
    abstract restoreDefaultState(): void;
}

export type Mutation = (oldState: any) => () => any;