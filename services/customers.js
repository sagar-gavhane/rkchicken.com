import Axios from 'utils/axiosInstance'

class Customer {
  get() {
    return Axios.get('/customers').then((response) => response.data.data)
  }

  create(payload) {
    return Axios.post('/customers', payload).then(
      (response) => response.data.data
    )
  }

  update(customerID, payload) {
    return Axios.patch(`/customers/${customerID}`, payload)
  }

  delete(customerID, payload) {
    return Axios.delete(`/customers/${customerID}`, payload)
  }
}

export default new Customer()
