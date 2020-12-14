import httpStatusCodes from 'http-status-codes'
import { Types } from 'mongoose'

import CustomerModel from 'models/Customer'
import customerError from 'errors/customer'
import { connectToDatabase } from 'utils/connectToDatabase'
import { handleError } from 'utils/handleError'

export default async function handler(req, res) {
  try {
    // early catch invalid customer ids
    if (!Types.ObjectId.isValid(req.query.customerId)) {
      throw customerError.INVALID_CUSTOMER_ID(req.query.customerId)
    }

    // early catch customer is exist or not database
    const customer = await CustomerModel.exists({ _id: req.query.customerId })

    if (!customer) {
      throw customerError.CUSTOMER_NOT_FOUND(req.query.customerId)
    }
  } catch (err) {
    handleError(res, err)
    return
  }

  await connectToDatabase()

  switch (req.method) {
    case 'GET': {
      try {
        const customer = await CustomerModel.findById(req.query.customerId)

        res.status(httpStatusCodes.OK).send({
          message: 'Customer record has been retrieved successfully.',
          data: customer,
        })
      } catch (err) {
        handleError(res, err)
      }

      break
    }

    case 'PATCH': {
      try {
        const customer = await CustomerModel.findByIdAndUpdate(
          req.query.customerId,
          req.body,
          {
            new: true,
            upsert: false,
            runValidators: true,
          }
        )

        res.status(httpStatusCodes.OK).send({
          message: 'Customer record has been updated successfully.',
          data: customer,
        })
      } catch (err) {
        handleError(res, err)
      }

      break
    }

    case 'DELETE': {
      try {
        await CustomerModel.findByIdAndRemove(req.query.customerId)

        res.status(httpStatusCodes.NO_CONTENT).send({
          message: 'Customer record has been deleted successfully.',
          data: {},
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
