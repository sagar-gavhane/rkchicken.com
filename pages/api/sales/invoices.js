import httpStatusCodes from 'http-status-codes'
import { Types } from 'mongoose'

import CustomerModel from 'models/Customer'
import InvoiceModel from 'models/Invoice'
import customerError from 'errors/customer'
import { connectToDatabase } from 'utils/connectToDatabase'
import { handleError } from 'utils/handleError'
import { sendInvoice } from 'utils/sendInvoice'
import { customer as customerLookup } from 'aggregation-pipelines/lookups'
import { invoice as invoiceProjection } from 'aggregation-pipelines/projections'

export default async function handler(req, res) {
  await connectToDatabase()

  switch (req.method) {
    case 'GET': {
      try {
        const invoices = await InvoiceModel.aggregate([
          customerLookup,
          invoiceProjection,
        ])

        res.status(httpStatusCodes.OK).send({
          data: invoices,
          message: 'Invoice has been successfully retrieved.',
        })
      } catch (err) {
        handleError(res, err)
      }

      break
    }

    case 'POST': {
      try {
        const customerId = req.body.customerId

        if (!Types.ObjectId.isValid(customerId)) {
          throw customerError.INVALID_CUSTOMER_ID(customerId)
        }

        const customerExists = await CustomerModel.exists({ _id: customerId })

        if (!customerExists) {
          throw customerError.CUSTOMER_NOT_FOUND(customerId)
        }

        const invoice = await InvoiceModel(req.body).save()

        const customer = await CustomerModel.findByIdAndUpdate(
          customerId,
          { outstandingAmount: req.body.remainingBalance },
          { new: true, upsert: false, runValidators: true }
        )

        sendInvoice(customer, invoice)

        res.status(httpStatusCodes.OK).send({
          data: invoice,
          message: 'Invoice has been successfully created.',
        })
      } catch (err) {
        handleError(res, err)
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
