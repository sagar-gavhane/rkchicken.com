import Axios from 'utils/axiosInstance'

export const getCustomersService = (params) => {
  if (params) {
    return Axios.get(`/customers/${params}`).then(
      (response) => response.data.data
    )
  }

  return Axios.get('/customers').then((response) => response.data.data)
}

export const createCustomerService = (payload) =>
  Axios.post('/customers', payload).then((response) => response.data.data)

export const updateCustomerService = (customerID, payload) =>
  Axios.patch(`/customers/${customerID}`, payload)

export const deleteCustomerService = (customerID, payload) =>
  Axios.delete(`/customers/${customerID}`, payload)
