import { isPlainObject, deepMerge } from "../helpers/util";
import { AxiosRequestConfig } from "../types";

const strategy = Object.create(null)

const strategyKeysFromVal2 = ['url', 'params', 'data']

strategyKeysFromVal2.forEach(key => {
  strategy[key] = fromVal2Strategy
})

const strateKeysDeepMerge = ['headers']

strateKeysDeepMerge.forEach(key => {
  strategy[key] = deepMergeStrategy
})

function defaultStrategy(val1: any, val2: any):any {
  return typeof val2 !== undefined ? val2 : val1
}

function fromVal2Strategy(val1: any, val2: any):any {
  if (typeof val2 !== undefined) {
    return val2
  }
}

function deepMergeStrategy(val1: any, val2: any):any {
  if (isPlainObject(val2)) {
    return deepMerge(val1, val2)
  } else if (typeof val2 !== undefined) {
    // val2有值，但不是一个对象
    return val2
  } else if (isPlainObject(val1)) {
    // val2 没有值
    return deepMerge(val1)
  } else if (typeof val1 !== undefined) {
    // val1有值，但不是一个对象
    return val1
  }
}

export default function mergeConfig (
        config1: AxiosRequestConfig, 
        config2?: AxiosRequestConfig): AxiosRequestConfig {
  if (!config2) {
    config2 = {}
  }
  const config = Object.create(null)

  for (let key in config2) {
    _mergeField(key)
  }

  for (let key in config1) {
    if (!config2[key]) {
      // config1 有，config2 没有
      _mergeField(key)
    }
  }

  function _mergeField(key: string): void {
    const strat = strategy[key] || defaultStrategy
    config[key] = strat(config1[key], config2![key])
  }

  console.log('config:', config)

  return config
}