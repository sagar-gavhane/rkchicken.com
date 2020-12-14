import httpStatusCodes from 'http-status-codes'
import createError from 'http-errors'

class CustomerError {
  CUSTOMER_NOT_FOUND = (customerId) => {
    return createError(
      httpStatusCodes.NOT_FOUND,
      `There is no customer exists with this customer id: ${customerId}`,
      {
        code: 'CUSTOMER_NOT_FOUND',
      }
    )
  }

  INVALID_CUSTOMER_ID = (customerId) => {
    return createError(
      httpStatusCodes.BAD_REQUEST,
      `We received an invalid customer id: ${customerId}`,
      {
        code: 'INVALID_CUSTOMER_ID',
      }
    )
  }
}

export default new CustomerError()
