import { ResolvedFn, RejectedFn, AxiosIntercepterManager } from '../types'

interface Intercepter<T> {
  resolved: ResolvedFn<T>,
  rejected?: RejectedFn
}

export default class IntercepterManager<T> implements AxiosIntercepterManager<T> {
  private intercepters: Array<Intercepter<T> | null> 

  constructor() {
    this.intercepters = []
  }

  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number {
    this.intercepters.push({
      resolved,
      rejected
    })
    return this.intercepters.length - 1
  }

  eject(id: number): void {
    if (!!this.intercepters[id]) {
      this.intercepters[id] = null
    }
  }

  // 输入一个函数，此函数 接受一个拦截器，返回一个void 类型
  forEach(fn: (intercepter: Intercepter<T>) => void): void {
    this.intercepters.forEach(intercepter => {
      if (intercepter !== null) {
        fn(intercepter)
      }
    })
  }
}