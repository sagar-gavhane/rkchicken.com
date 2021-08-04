import Axios from 'utils/axiosInstance'

class Sales {
  invoice = {
    list: (params) => {
      if (!params) {
        return Axios.get(`/sales/invoices`).then((r) => r.data.data)
      }

      return Axios.get(`/sales/invoices?${params}`).then((r) => r.data.data)
    },
    create: (payload) =>
      Axios.post('/sales/invoices', payload).then((r) => r.data.data),
    update: (invoiceId, payload) =>
      Axios.patch(`/sales/invoices/${invoiceId}`, payload).then(
        (r) => r.data.data
      ),
    get: (invoiceId) =>
      Axios.get(`/sales/invoices/${invoiceId}`).then((r) => r.data.data),
    delete: (invoiceId) =>
      Axios.delete(`/sales/invoices/${invoiceId}`).then((r) => r.data.data),
  }
}

export default new Sales()
