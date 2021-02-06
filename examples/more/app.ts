import axios from '../../src/index'

// document.cookie = 'a=b'

// axios.get('/more/get').then(res => {
//   console.log("res1:", res)
// })

// axios.post('http://localhost:8088/more/server2', {}, {
//     withCredentials: true
// }).then(res => {
//     console.log("res2:", res)
// }).catch()

const instance = axios.create({
  xsrfCookieName: 'XSRF-TOKEN-D',
  xsrfHeaderName: 'X-XSRF-TOKEN-D'
})

instance.get('/more/get').then(res => {
  console.log(res)
})