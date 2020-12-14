import httpStatusCodes from 'http-status-codes'
import createError from 'http-errors'

class UserError {
  AUTH_MISMATCHED = () => {
    return createError(
      httpStatusCodes.UNAUTHORIZED,
      `email and password mis-matched`,
      {
        code: 'AUTH_MISMATCHED',
      }
    )
  }
}

export default new UserError()
