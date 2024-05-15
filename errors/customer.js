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

  CustomerDeletionError = (customerId) => {
    return createError(
      httpStatusCodes.INTERNAL_SERVER_ERROR,
      `Encountered an issue during the customer deletion process for customer ID: ${customerId}`,
      { code: 'CUSTOMER_DELETION_ERROR' }
    )
  }

  CustomerCreationError = (customer) => {
    return createError(
      httpStatusCodes.INTERNAL_SERVER_ERROR,
      `Encountered an issue during the customer creation process for customer: ${JSON.stringify(
        customer
      )}`,
      { code: 'CUSTOMER_CREATION_ERROR' }
    )
  }
}

export default new CustomerError()
