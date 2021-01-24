export type Method = 'get' | 'GET' 
| 'delete' | 'DELETE'
| 'post' | 'POST'
| 'put' | 'PUT'
| 'patch' | 'PATCH'
| 'head' | 'HEAD' 
| 'options' | 'OPTIONS'

export interface AxiosRequestConfig {
  url?: string
  method?: Method
  data?: any
  params?: any,
  headers?: any,
  responseType?: XMLHttpRequestResponseType,
  timeout?: number
}

export interface AxiosResponse<T=any> {
  data: T,
  status: number,
  statusText: string,
  headers: any,
  config: AxiosRequestConfig,
  request: any
}

export interface AxiosPromise<T=any> extends Promise<AxiosResponse<T>> {

}

export interface AxiosError extends Error {
  isAxiosError: boolean,
  config: AxiosRequestConfig,
  code?: string | null,
  request?: any,
  response?: AxiosResponse
}

export interface Axios {
  request<T=any>(config: AxiosRequestConfig): AxiosPromise<T>

  interceptors: {
    request: AxiosIntercepterManager<AxiosRequestConfig>
    response: AxiosIntercepterManager<AxiosResponse>
  },

  get<T=any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  post<T=any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  put<T=any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  patch<T=any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  delete<T=any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  head<T=any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  options<T=any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosInstance extends Axios {
  <T=any>(config: AxiosRequestConfig): AxiosPromise<T>
  <T=any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}

// intercepter
export interface AxiosIntercepterManager<T> {
  use(resolved: ResolvedFn<T>, reject?: RejectedFn): number
  eject(id: number): void
}

export interface ResolvedFn<T> {
  (val: T): T | Promise<T>
}

export interface RejectedFn {
  (error: any): any
}