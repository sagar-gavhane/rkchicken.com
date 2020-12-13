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
          message: 'Customers records successfully retrived.',
          data: customers,
        })
      } catch (err) {
        handleError(res, err)
      } finally {
        break
      }
    }

    case 'POST': {
      try {
        const customer = await CustomerModel(req.body).save()

        res.status(httpStatusCodes.CREATED).send({
          message: 'Customer has been successfully created.',
          data: customer,
        })
      } catch (err) {
        handleError(res, err)
      } finally {
        break
      }
    }

    default: {
      res.setHeader('Allow', ['GET', 'POST'])
      res
        .status(httpStatusCodes.METHOD_NOT_ALLOWED)
        .end(`Method ${req.method} Not Allowed`)
    }
  }
}
