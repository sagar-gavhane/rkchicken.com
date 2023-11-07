import httpStatusCodes from 'http-status-codes'
import isNumber from 'lodash.isnumber'
import mongoose, { Types } from 'mongoose'

import CustomerModel from 'models/Customer'
import InvoiceModel from 'models/Invoice'
import customerError from 'errors/customer'
import { connectToDatabase } from 'utils/connectToDatabase'
import { handleError } from 'utils/handleError'
import { sendInvoice } from 'utils/sendInvoice'
import { customer as customerLookup } from 'aggregation-pipelines/lookups'
import { invoice as invoiceProjection } from 'aggregation-pipelines/projections'
import { invoiceFilter } from 'aggregation-pipelines/matches'
// import redis from 'utils/redis'
import { generateShortKey } from 'utils/generateShortKey'

export default async function handler(req, res) {
  await connectToDatabase()

  switch (req.method) {
    case 'GET': {
      try {
        const offset = isNumber(+req.query.offset) ? +req.query.offset : 0
        const limit = isNumber(+req.query.limit) ? +req.query.limit : 10

        const pipeline = [
          customerLookup,
          invoiceFilter(req.query),
          { $skip: offset },
          { $limit: limit },
          { $sort: { invoiceDate: 1 } },
          invoiceProjection,
        ].filter(Boolean)

        const [{ total } = {}] = await InvoiceModel.aggregate(
          [
            customerLookup,
            invoiceFilter(req.query),
            { $count: 'total' },
          ].filter(Boolean)
        )

        const invoices = await InvoiceModel.aggregate(pipeline)

        res.status(httpStatusCodes.OK).json({
          data: { invoices, total },
          message: 'Invoice has been successfully retrieved.',
        })
      } catch (err) {
        handleError(res, err)
        return
      }

      break
    }

    case 'POST': {
      const session = await mongoose.startSession()
      session.startTransaction()

      try {
        const customerId = req.body.customerId

        if (!Types.ObjectId.isValid(customerId)) {
          throw customerError.INVALID_CUSTOMER_ID(customerId)
        }

        const customerExists = await CustomerModel.exists({ _id: customerId })

        if (!customerExists) {
          throw customerError.CUSTOMER_NOT_FOUND(customerId)
        }

        const shortKey = generateShortKey()

        req.body.shortKey = shortKey

        const invoice = await InvoiceModel(req.body).save({ session })

        const customer = await CustomerModel.findByIdAndUpdate(
          customerId,
          { outstandingAmount: req.body.remainingBalance },
          { new: true, upsert: false, runValidators: true, session }
        )

        await sendInvoice(customer, invoice)

        // await Promise.allSettled([
        //   redis.del(`invoice:${invoice._id}`),
        //   redis.del(`customer:${customer._id}`),
        // ])

        await session.commitTransaction()
        await session.endSession()

        res.status(httpStatusCodes.OK).json({
          data: invoice,
          message: 'Invoice has been successfully created.',
        })
      } catch (err) {
        await session.abortTransaction()
        await session.endSession()
        handleError(res, err)
        return
      }

      break
    }

    default: {
      res.setHeader('Allow', ['GET', 'POST'])
      res
        .status(httpStatusCodes.METHOD_NOT_ALLOWED)
        .end(`Method ${req.method} Not Allowed`)
    }
  }
}
