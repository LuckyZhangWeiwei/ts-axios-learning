// import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types'
// import { buildURL } from './helpers/url'
// import { transfromRequest, transfromResponse } from './helpers/data'
// import { processHeaders } from './helpers/headers'
// import xhr from './core/xhr'

// function axios(config: AxiosRequestConfig): AxiosPromise {
  
//   processConfig(config)

//   return xhr(config).then(res => {
//       return transformResponseData(res)
//   })
// }

// function processConfig(config: AxiosRequestConfig): void {
//   config.url = transformUrl(config)
//   config.headers = transformRequestHeads(config)  // 注意与下面一行的顺序，因为下面一行会对data 进行改写（JSON.stringify）
//   config.data = transformRequestData(config)
// }

// function transformUrl(config: AxiosRequestConfig): string {
//   const { url, params } = config
//   return buildURL(url!, params)
// }

// function transformRequestData(config: AxiosRequestConfig): any {
//   const { data } = config
//   return transfromRequest(data)
// }

// function transformRequestHeads(config: AxiosRequestConfig): any {
//   const { headers = {}, data } = config
//   return processHeaders(headers, data)
// }

// function transformResponseData(res: AxiosResponse): AxiosResponse {
//   res.data = transfromResponse(res.data)
//   return res
// }

// export default axios

import { AxiosInstance } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/util'

function _creaateInstance(): AxiosInstance {
  const context = new Axios()

  // 由于request 内部会访问this ， 所以要绑定上下文
  // instance 实际上是一个函数
  const instance = Axios.prototype.request.bind(context)
  extend(instance, context)

  return instance as AxiosInstance
}

const axios = _creaateInstance()

export default axios