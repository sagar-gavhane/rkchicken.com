import httpStatusCodes from 'http-status-codes'

import CustomerModel from 'models/Customer'
import { connectToDatabase } from 'utils/connectToDatabase'
import { handleError } from 'utils/handleError'
import redis from 'utils/redis'

export default async function handler(req, res) {
  await connectToDatabase()

  switch (req.method) {
    case 'GET': {
      try {
        const cached = await redis.get('customers:all')

        if (cached) {
          res.status(httpStatusCodes.OK).send({
            message: 'Customers record successfully retrieved.',
            data: cached,
          })
          return
        }

        const customers = await CustomerModel.find()

        await redis.set('customer:all', JSON.stringify(customers), {
          ex: 2 * 60,
        })

        res.status(httpStatusCodes.OK).send({
          message: 'Customers record successfully retrieved.',
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

        await redis.set(`customer:${customer._id}`, JSON.stringify(customer), {
          ex: 2 * 60,
        })

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
