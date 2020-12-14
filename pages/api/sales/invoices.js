import httpStatusCodes from 'http-status-codes'
import { Types } from 'mongoose'

import CustomerModel from 'models/Customer'
import InvoiceModel from 'models/Invoice'
import customerError from 'errors/customer'
import { connectToDatabase } from 'utils/connectToDatabase'
import { handleError } from 'utils/handleError'
import { sendInvoice } from 'utils/sendInvoice'

export default async function handler(req, res) {
  try {
    // early catch invalid customer ids
    if (!Types.ObjectId.isValid(req.body.customerId)) {
      throw customerError.INVALID_CUSTOMER_ID(req.body.customerId)
    }

    await connectToDatabase()

    // early catch customer is exist or not database
    const customer = await CustomerModel.exists({ _id: req.body.customerId })

    if (!customer) {
      throw customerError.CUSTOMER_NOT_FOUND(req.body.customerId)
    }
  } catch (err) {
    handleError(res, err)
    return
  }

  switch (req.method) {
    case 'POST': {
      try {
        const invoice = await InvoiceModel(req.body).save()

        const customer = await CustomerModel.findByIdAndUpdate(
          req.body.customerId,
          {
            outstandingAmount: req.body.remainingBalance,
          },
          {
            new: true,
            upsert: false,
            runValidators: true,
          }
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
      res.setHeader('Allow', ['POST'])
      res
        .status(httpStatusCodes.METHOD_NOT_ALLOWED)
        .end(`Method ${req.method} Not Allowed`)
    }
  }
}
