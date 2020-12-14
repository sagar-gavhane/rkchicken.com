import httpStatusCodes from 'http-status-codes'

import CustomerModel from 'models/Customer'
import { connectToDatabase } from 'utils/connectToDatabase'
import { handleError } from 'utils/handleError'

export default async function handler(req, res) {
  await connectToDatabase()

  switch (req.method) {
    case 'GET': {
      try {
        const customers = await CustomerModel.find()

        res.status(httpStatusCodes.OK).send({
          message: 'Customers record successfully retrived.',
          data: customers,
        })
      } catch (err) {
        handleError(res, err)
      }

      break
    }

    case 'POST': {
      try {
        const customer = await new CustomerModel(req.body).save()

        res.status(httpStatusCodes.CREATED).send({
          message: 'Customer has been created successfully.',
          data: customer,
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
