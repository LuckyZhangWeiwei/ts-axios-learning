import { AxiosRequestConfig } from './types'
import { buildURL } from './helpers/url'
import { transfromRequest } from './helpers/data'
import { processHeaders } from './helpers/headers'
import xhr from './xhr'

function axios(config: AxiosRequestConfig): void {
  processConfig(config)
  xhr(config)
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformUrl(config)
  config.headers = transformRequestHeads(config)  // 注意与下面一行的顺序，因为下面一行会对data 进行改写（JSON.stringify）
  config.data = transformRequestData(config)
}

function transformUrl(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url, params)
}

function transformRequestData(config: AxiosRequestConfig): any {
  const { data } = config
  return transfromRequest(data)
}

function transformRequestHeads(config: AxiosRequestConfig): any {
  const { headers = {}, data } = config
  return processHeaders(headers, data)
}
 
export default axios