import { AxiosPromise, AxiosRequestConfig, Method, Axios as IAxios, AxiosResponse, ResolvedFn, RejectedFn } from '../types'
import dispatchRequest from './dispatchRequest'
import IntercepterManager from './IntercepterManager'

interface Interceptors {
  request: IntercepterManager<AxiosRequestConfig>
  response: IntercepterManager<AxiosResponse>
}

interface PromiseChain<T> {
  resolved: ResolvedFn<T> | ((config: AxiosRequestConfig) => AxiosPromise) //dispatchRequest
  rejected?: RejectedFn
}

export default class Axios {
  private interceptors: Interceptors

  constructor() {
    this.interceptors = {
      request: new IntercepterManager<AxiosRequestConfig>(),
      response: new IntercepterManager<AxiosResponse>()
    }
  }

  request(url: any, config?: any): AxiosPromise {
    if (typeof url === 'string') {
      // 第二个重载
      if (!config) {
        config = {}
      }
      config.url = url
    } else {
      // 第一个重载
      // 实际上 url 就是config
      config = url
    }

    // interceptor chain
    const chain: PromiseChain<any>[] = [{
      resolved: dispatchRequest,
      rejected: undefined
    }]

    this.interceptors.request.forEach(interceptor => {
      chain.unshift(interceptor) // 先添加 后执行
    })

    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor) // 先添加 先执行
    })

    // 执行 chain
    let promise = Promise.resolve(config)

    while(chain.length) {
      const { resolved, rejected } = chain.shift()!
      promise = promise.then(resolved, rejected)
    }

    // return dispatchRequest(config)
    return promise
  }

  get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('get', url, config)
  }

  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('post', url, data, config)
  }

  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('put', url, data, config)
  }

  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('patch', url, data, config)
  }

  delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('delete', url, config)
  }

  head(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('head', url, config)
  }

  options(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('options', url, config)
  }

  _requestMethodWithoutData(method: Method, url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this.request(Object.assign(config || {}, {
      method,
      url
    }))
  }

  _requestMethodWithData(method: Method, url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this.request(Object.assign(config || {}, {
      method,
      url,
      data
    }))
  }
}