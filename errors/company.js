import httpStatusCodes from 'http-status-codes'
import createError from 'http-errors'

class CompanyError {
  COMPANY_NOT_FOUND(companyId) {
    return createError(
      httpStatusCodes.NOT_FOUND,
      `There is no company exists with this company id: ${companyId}`,
      {
        code: 'COMPANY_NOT_FOUND',
      }
    )
  }

  INVALID_COMPANY_ID(companyId) {
    return createError(
      httpStatusCodes.BAD_REQUEST,
      `We received an invalid company id: ${companyId}`,
      {
        code: 'INVALID_COMPANY_ID',
      }
    )
  }
}

export default new CompanyError()
