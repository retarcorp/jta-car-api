import { Module } from "@nestjs/common";
import StoreService from "./store.service";
import { InternalStoreService } from "./internal/InternalStoreService.service";

@Module({
    providers: [{ provide: StoreService, useClass: InternalStoreService }],
    exports: [StoreService]

})
export default class StoreModule {}