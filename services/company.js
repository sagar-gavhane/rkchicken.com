import Axios from 'utils/axiosInstance'

class Company {
  async get() {
    const response = await Axios.get('/companies')
    return response.data.data
  }

  async create(payload) {
    const response = await Axios.post(`/companies`, payload)
    return response.data.data
  }

  async update(companyId, payload) {
    const response = await Axios.patch(`/companies/${companyId}`, payload)
    return response.data.data
  }

  async delete(companyId) {
    const response = await Axios.delete(`/companies/${companyId}`)
    return response.data.data
  }
}

export default new Company()
