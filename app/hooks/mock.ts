import { Resource } from "../annotations/restful";
import { useIoC } from "./ioc";
import { Provider } from "./resource";

export function useMock<T extends Resource>(provider: Provider<T>, sub: Provider<T>) {
    const context = useIoC()
    context.define(provider, sub)
}