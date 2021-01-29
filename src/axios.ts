import { AxiosRequestConfig, AxiosStatic } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/util'
import defaults from './defaults'
import  mergeConfig from './core/mergeConfig'

function _createInstance(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config)

  // 由于request 内部会访问this， 所以要绑定上下文
  // instance 实际上是一个函数
  const instance = Axios.prototype.request.bind(context)
  extend(instance, context)

  return instance as AxiosStatic
}

const axios = _createInstance(defaults)

axios.create = function create(config) {
  return _createInstance(mergeConfig(defaults, config))
}

export default axios