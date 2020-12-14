import httpStatusCodes from 'http-status-codes'
import { Error } from 'mongoose'

export function handleError(res, err) {
  if (err instanceof Error.ValidationError) {
    let message = {}

    Object.keys(err.errors).map((key) => {
      const properties = err.errors[key].properties
      message[key] = properties.message
    })

    res.status(httpStatusCodes.UNPROCESSABLE_ENTITY).json({
      message,
      code: 'ValidationError',
    })
  } else {
    res.status(err.status ?? httpStatusCodes.UNPROCESSABLE_ENTITY).json({
      message: err.message,
      code: err.code ?? 'UNPROCESSABLE_ENTITY',
    })
  }
}
