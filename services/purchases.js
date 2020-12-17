import Axios from 'utils/axiosInstance'
import extract from 'utils/extract'

class Purchase {
  constructor() {
    this.invoice = {
      create: (payload) => {
        return Axios.post(`/purchases/invoices`, payload).then(extract.data)
      },
      get: (invoiceId) => {
        return Axios.get(`/purchases/invoices/${invoiceId}`).then(extract.data)
      },
      list: function (params) {
        if (!params) {
          return Axios.get(`/purchases/invoices`).then(extract.data)
        }

        const endpoint = `/purchases/invoices${params}`
        return Axios.get(endpoint).then(extract.data)
      },
      update: (invoiceId, payload) => {
        const endpoint = `/purchases/invoices/${invoiceId}`
        return Axios.patch(endpoint, payload).then(extract.data)
      },
      delete: (invoiceId) => {
        const endpoint = `/purchases/invoices/${invoiceId}`
        return Axios.delete(endpoint).then(extract.data)
      },
    }
  }
}

export default new Purchase()
