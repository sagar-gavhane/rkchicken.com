class Extract {
  constructor() {
    this.data = function (response) {
      return response.data?.data
    }
  }
}

export default new Extract()
