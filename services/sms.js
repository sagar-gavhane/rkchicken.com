import get from 'lodash.get'

import Axios from 'utils/axiosInstance'

class SMS {
  async getBalance() {
    const url = `/sms-balance`
    const response = await Axios.get(url)

    return get(response, 'data.data.remainingcredits', null)
  }
}

export default new SMS()
