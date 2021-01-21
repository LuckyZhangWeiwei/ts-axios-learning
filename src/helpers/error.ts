import { AxiosRequestConfig, AxiosResponse } from '../types'

class AxiosError extends Error {
  isAxiosError: boolean
  config: AxiosRequestConfig
  code?: string | null
  request?: any
  response?: AxiosResponse

  constructor(
    message: string,
    config: AxiosRequestConfig,
    code?: string | null,
    request?: any,
    response?: AxiosResponse
  ) {
    super(message)

    this.config = config
    this.code = code
    this.request = request
    this.response = response
    this.isAxiosError = true

    // 解决ts 继承原生类的一个坑
    Object.setPrototypeOf(this, AxiosError.prototype)
  }
}

export function createError(message: string,
    config: AxiosRequestConfig,
    code?: string | null,
    request?: any,
    response?: AxiosResponse): AxiosError {
    const error = new AxiosError(message, config, code, request, response)
    return error
}