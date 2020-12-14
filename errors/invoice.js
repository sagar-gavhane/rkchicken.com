import httpStatusCodes from 'http-status-codes'
import createError from 'http-errors'

class InvoiceError {
  INVOICE_NOT_FOUND = (invoiceId) => {
    return createError(
      httpStatusCodes.NOT_FOUND,
      `There is no invoice exists with this invoice id: ${invoiceId}`,
      {
        code: 'INVOICE_NOT_FOUND',
      }
    )
  }

  INVALID_INVOICE_ID = (invoiceId) => {
    return createError(
      httpStatusCodes.BAD_GATEWAY,
      `We received invalid invoice id: ${invoiceId}`,
      {
        code: 'INVALID_INVOICE_ID',
      }
    )
  }
}

export default new InvoiceError()
