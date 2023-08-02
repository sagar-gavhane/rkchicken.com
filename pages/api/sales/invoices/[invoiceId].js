import httpStatusCodes from 'http-status-codes'
import { Types } from 'mongoose'

import InvoiceModel from 'models/Invoice'
import CustomerModel from 'models/Customer'
import invoiceError from 'errors/invoice'
import { invoice as invoiceProjection } from 'aggregation-pipelines/projections'
import { customer as customerLookup } from 'aggregation-pipelines/lookups'
import { connectToDatabase } from 'utils/connectToDatabase'
import { handleError } from 'utils/handleError'
import { sendInvoice } from 'utils/sendInvoice'
import redis from 'utils/redis'

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const cached = await redis.get(`invoice:${req.query.invoiceId}`)

      if (cached) {
        res.status(httpStatusCodes.OK).json({
          data: cached,
          message: 'Invoice has been successfully retrieved.',
        })
        return
      }
    }

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
          invoiceProjection,
        ])

        await redis.set(
          `invoice:${req.query.invoiceId}`,
          JSON.stringify(invoice),
          { ex: 2 * 60 }
        )

        res.status(httpStatusCodes.OK).json({
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
        const invoice = await InvoiceModel.findByIdAndUpdate(
          req.query.invoiceId,
          req.body,
          { new: true, runValidators: true }
        )

        const customer = await CustomerModel.findByIdAndUpdate(
          req.body.customerId,
          {
            outstandingAmount: req.body.remainingBalance,
          },
          {
            new: true,
            runValidators: true,
          }
        )

        await Promise.allSettled([
          redis.del(`invoice:${req.query.invoiceId}`),
          redis.del(`customer:${req.query.customerId}`),
        ])

        sendInvoice(customer, invoice)

        res.status(httpStatusCodes.OK).json({
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
        await InvoiceModel.findByIdAndRemove(req.query.invoiceId)

        await redis.del(`invoice:${req.query.invoiceId}`)

        res.status(httpStatusCodes.NO_CONTENT).json({})
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
