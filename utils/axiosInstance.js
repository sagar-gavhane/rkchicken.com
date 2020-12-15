import axios from 'axios'
import nProgress from 'nprogress'

const instance = axios.create({ baseURL: '/api' })

// nProgress configuration
nProgress.configure({ minimum: 0.1, easing: 'ease', speed: 500 })

instance.interceptors.request.use(
  (config) => {
    nProgress.start()
    return config
  },
  (error) => {
    nProgress.start()
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => {
    nProgress.done()
    return response
  },
  (error) => {
    nProgress.done()
    return Promise.reject(error)
  }
)

export default instance
