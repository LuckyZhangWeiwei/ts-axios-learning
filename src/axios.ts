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