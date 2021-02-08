import { isDate, isPlainObject, isURLSearchParams } from './util'

function _encode(val: string): string {
  return encodeURIComponent(val)
        .replace(/%40/g, '@')
        .replace(/%3A/ig, ':')
        .replace(/%24/g, '$')
        .replace(/%2C/ig, ',')
        .replace(/%20/g, '+')
        .replace(/%5B/ig, '[')
        .replace(/%5D/ig, ']')
}

export function buildURL(
  url: string,
  params?: any,
  paramsSerializer?: (params: any) => string): string {
  
  if (!params) {
    return url
  }
  let serializedParams
  if (!!paramsSerializer) {
    serializedParams = paramsSerializer(params)
  } else if (isURLSearchParams(params)) {
    serializedParams = params.toString()
  } else {
    const parts: string[] = []
  
    Object.keys(params).forEach(key => {
      const val = params[key]
      if (val === null || val === undefined) {
        return
      }
      
      let values = []
      
      if (Array.isArray(val)) {
        values = val
        key += '[]'
      } else {
        values = [val]
      }
  
      values.forEach(val => {
        if (isDate(val)) {
          val = val.toISOString()
        } else if(isPlainObject(val)) {
          val = JSON.stringify(val)
        }
        parts.push(`${_encode(key)}=${_encode(val)}`)
      })
    })
    serializedParams = parts.join('&')
  }
  
  if (!!serializedParams) {
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      url = url.slice(0, markIndex)
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }
  return url
}

export function isURLSameOrigin(requestURL: string): boolean {
  const parsedOrigin = _resolveURL(requestURL)
  return (parsedOrigin.protocol === currentOrigin.protocol) 
          &&
          (parsedOrigin.host === currentOrigin.host) 
}

const urlParsingNode = document.createElement('a')
const currentOrigin = _resolveURL(window.location.href)

interface URLOrigin {
  protocol: string, 
  host: string
}

function _resolveURL(url: string): URLOrigin {
  urlParsingNode.setAttribute('href', url)
  const { protocol, host } = urlParsingNode
  return {
    protocol, 
    host
  }
}