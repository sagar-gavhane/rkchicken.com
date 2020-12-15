import Axios from 'utils/axiosInstance'

class Auth {
  login(payload) {
    return Axios.post(`/login`, payload)
  }
}

export default new Auth()
