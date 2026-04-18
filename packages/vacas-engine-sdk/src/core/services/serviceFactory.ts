export class ServiceFactory {
    static register(name: string, factory: () => any): void { }
    static get(name: string): any { return null }
}
