import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'
import { isURLSameOrigin } from '../helpers/url'
import { isFormData } from '../helpers/util'
import cookie from '../helpers/cookie'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {

  return new Promise((resolve, reject) => {
    const { 
      data = null,
      url,
      method = 'get',
      headers, 
      responseType, 
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress
    } = config

    const request = new XMLHttpRequest()
  
    request.open(method.toUpperCase(), url!, true)

    _configRequest()

    _addEvents()

    _processHeaders()

    _processCancel() 
  
    request.send(data)

    function _configRequest(): void {
      if (!!responseType) {
        request.responseType = responseType
      }
  
      if (!!timeout) {
        request.timeout = timeout
      }
  
      // 跨域请求时，通过设置这个属性，来使请求带上所要请求的域下的cookie
      if (!!withCredentials) {
        request.withCredentials = withCredentials;
      }
    }

    function _addEvents(): void {
      request.onreadystatechange = function handleLoad() {
        if (request.readyState !== 4) {
          // 4 为正确接受的状态 下载操作已完成
          return
        }
  
        if (request.status === 0) {
          // 网络错误、超时错误
          return
        }
  
        const responseHeaders = request.getAllResponseHeaders()
        const responseData = responseType !== 'text' ? request.response : request.responseText
  
        const response: AxiosResponse = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: parseHeaders(responseHeaders),
          config,
          request
        }
        _handleResponse(response)
      }
      // 网络错误
      request.onerror = function handleError() {
        const error = createError('network error', config, null, request)
        reject(error)
      }

      // 超时错误
      request.ontimeout = function handleTimeout() {
        const error = createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request)
        reject(error)
      }

      if (!!onDownloadProgress) {
        request.onprogress = onDownloadProgress
      }

      if (!!onUploadProgress) {
        request.upload.onprogress = onUploadProgress
      }
    }

    function _processHeaders(): void {
      if (isFormData(data)) {
        delete headers['Content-Type']
      }
  
      if ((withCredentials || isURLSameOrigin(url!)) && !!xsrfCookieName) {
        const xsrValue = cookie.read(xsrfCookieName)
        if (!!xsrValue && !!xsrfHeaderName) {
          headers[xsrfHeaderName] = xsrValue
        }
      }
    
      Object.keys(headers).forEach(name => {
        if (data === null && name.toLocaleLowerCase() === 'content-type') {
          delete headers[name]
        } else {
          request.setRequestHeader(name, headers[name])
        }
      })
    }

    function _processCancel(): void {
      if (!!cancelToken) {
        cancelToken.promise.then(reason => {
          request.abort()
          reject(reason)
        })
      }
    }

    function _handleResponse(response: AxiosResponse): void {
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else {
        const error = createError(`Request failed with status code: ${response.status}`, config, null, request, response)
        reject(error)
      }
    }
  })
}