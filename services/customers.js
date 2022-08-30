import Axios from 'utils/axiosInstance'

class Customer {
  async get() {
    const response = await Axios.get('/customers')
    return response.data.data
  }

  async create(payload) {
    const response = await Axios.post('/customers', payload)
    return response.data.data
  }

  update(customerID, payload) {
    return Axios.patch(`/customers/${customerID}`, payload)
  }

  delete(customerID, payload) {
    return Axios.delete(`/customers/${customerID}`, payload)
  }
}

export default new Customer()
