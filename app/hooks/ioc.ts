import { createContext, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

// 组件的构造函数定义
export interface Func<I, O> {
    (props: I, context?: Context): O;
    componentId?: string
    displayName?: string | undefined;
    originFunction?: Func<I, O>
}

// IoC容器的接口定义
export interface Container<V> {
    /**
     * 将组件注册到IoC容器中
     * @param key 组件ID
     * @param val 组件构造函数
     */
    register(key: string, val: V): void
    /**
     * 从IoC容器获取组件的构造函数
     * @param key 组件ID
     */
    get(key: string): V
}

// IoC容器的具体实现
function IoCContainer(): Container<Func<any, any>> {
    let storage = new Map<string,any>()
    return {
        register: function(key, val) {
            storage.set(key, val)
        },
        get: function(key: string): Func<any, any> {
            return storage.get(key)
        }
    }
}

// IoC容器的上下文接口定义
export interface Context {
    /**
     * 定义组件：将组件注册到IoC容器，如果参数subType不为空就组件的原始构造函数替换为subType
     * @param component 组件
     * @param subType 组件构造函数的子类型，可以为空
     */
    define<I, O>(component: Func<I,O>, subType?: Func<I,O>): Func<I,O>
    /**
     * 从IoC容器中，根据componentId获取原始构造函数
     * @param component 组件
     * @param props 父组件传递过来的IoC容器上下文
     */
    inject<I, O>(component: Func<I,O>): Func<I,O>
}

// 创建新的IoCContext实例，
// 通过define函数将组件注册到IoCContext
// 然后再通过inject函数将注册的组件注入到其他组件中
export function NewIoCContext(parent?: Context): Context {
    const container = IoCContainer()
    return {
        define: function<I, O>(component: Func<I,O>, subType?: Func<I,O>) {
            if (!component.componentId) {
                // 这里使用唯一的uuid代替原本的类型信息
                component.componentId = uuidv4()
            }
            if (subType) {
                // 如果参数subType不为空就将IoC容器中的componentId对应的原始构造函数替换为subType
                const componentId = component.componentId
                subType.originFunction = component
                componentId && container.register(componentId, subType)
            }
            return subType ?? component
        },
        inject: function<I, O>(component: Func<I,O>): Func<I,O> {
            const componentId = component.componentId
            if (componentId) {
                // 如果父级IoC容器为空，或者不存在componentId对应的构造函数，则尝试在当前的IoC容器中获取
                let originFunction: Func<I,O> = container.get(componentId)
                if (!originFunction) {
                    // 如果父级IoC上下文不为空，就直接从父级IoC上下文中返回
                    if (parent) {
                        return parent.inject(component)
                    }
                    // 如果父级或当前IoC容器找不到componentId对应的构造函数，则直接返回originFunction
                    originFunction = component.originFunction ?? component
                }
                return originFunction
            }
            // 如果componentId为空，就直接返回component
            return component
        }
    }
}

// 通过React useContext在组件树传递ioc context
export const IoCContext = createContext<Context>(NewIoCContext())

// 从父级组件中获取ioc context
export const useIoC = function(): Context {
    return useContext(IoCContext)
}