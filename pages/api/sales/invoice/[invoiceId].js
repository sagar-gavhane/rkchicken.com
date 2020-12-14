import httpStatusCodes from 'http-status-codes'
import { Types } from 'mongoose'

import InvoiceModel from 'models/Invoice'
import invoiceError from 'errors/invoice'
import projection from 'aggregation-pipelines/invoice/projections'
import { customer as customerLookup } from 'aggregation-pipelines/invoice/lookups'
import { connectToDatabase } from 'utils/connectToDatabase'
import { handleError } from 'utils/handleError'

export default async function handler(req, res) {
  try {
    if (!Types.ObjectId.isValid(req.query.invoiceId)) {
      throw invoiceError.INVALID_INVOICE_ID(req.query.invoiceId)
    }

    await connectToDatabase()

    const invoiceExist = await InvoiceModel.exists({ _id: req.query.invoiceId })

    if (!invoiceExist) {
      throw invoiceError.INVOICE_NOT_FOUND(req.query.invoiceId)
    }
  } catch (err) {
    handleError(res, err)
    return
  }

  switch (req.method) {
    case 'GET': {
      try {
        const [invoice] = await InvoiceModel.aggregate([
          { $match: { _id: Types.ObjectId(req.query.invoiceId) } },
          customerLookup,
          projection,
        ])

        res.status(httpStatusCodes.OK).send({
          data: invoice,
          message: 'Invoice has been successfully retrieved.',
        })
      } catch (err) {
        handleError(res, err)
      }

      break
    }

    default: {
      res.setHeader('Allow', ['GET'])
      res
        .status(httpStatusCodes.METHOD_NOT_ALLOWED)
        .end(`Method ${req.method} Not Allowed`)
    }
  }
}
