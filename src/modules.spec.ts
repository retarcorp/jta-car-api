import { AppModule } from "./app.module"

describe('Modules definition test', () => {
    it('App module and its dependants is defined', () => {
        const module = new AppModule();
        expect(module).toBeDefined()
    })
})