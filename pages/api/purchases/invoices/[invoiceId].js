import httpStatusCodes from 'http-status-codes'
import { Types } from 'mongoose'

import PurchaseInvoiceModel from 'models/PurchaseInvoice'
import purchaseInvoiceError from 'errors/purchaseInvoice'
import { purchaseInvoice as purchaseInvoiceProjection } from 'aggregation-pipelines/projections'
import { company as companyLookup } from 'aggregation-pipelines/lookups'
import { connectToDatabase } from 'utils/connectToDatabase'
import { handleError } from 'utils/handleError'

export default async function handler(req, res) {
  try {
    if (!Types.ObjectId.isValid(req.query.invoiceId)) {
      throw purchaseInvoiceError.INVALID_INVOICE_ID(req.query.invoiceId)
    }

    await connectToDatabase()

    const invoiceExist = await PurchaseInvoiceModel.exists({
      _id: req.query.invoiceId,
    })

    if (!invoiceExist) {
      throw purchaseInvoiceError.PURCHASE_INVOICE_NOT_FOUND(req.query.invoiceId)
    }
  } catch (err) {
    handleError(res, err)
    return
  }

  switch (req.method) {
    case 'GET': {
      try {
        const [invoice] = await PurchaseInvoiceModel.aggregate([
          { $match: { _id: Types.ObjectId(req.query.invoiceId) } },
          companyLookup,
          purchaseInvoiceProjection,
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

    case 'PATCH': {
      try {
        const invoice = await PurchaseInvoiceModel.findByIdAndUpdate(
          req.query.invoiceId,
          req.body,
          { new: true, runValidators: true }
        )

        res.status(httpStatusCodes.OK).send({
          data: invoice,
          message: 'Invoice has been successfully updated.',
        })
      } catch (err) {
        handleError(res, err)
      }

      break
    }

    case 'DELETE': {
      try {
        await PurchaseInvoiceModel.findByIdAndRemove(req.query.invoiceId)

        res.status(httpStatusCodes.NO_CONTENT).send({})
      } catch (err) {
        handleError(res, err)
      }

      break
    }

    default: {
      res.setHeader('Allow', ['GET', 'PATCH', 'DELETE'])
      res
        .status(httpStatusCodes.METHOD_NOT_ALLOWED)
        .end(`Method ${req.method} Not Allowed`)
    }
  }
}
