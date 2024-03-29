import httpStatusCodes from 'http-status-codes'

import CustomerModel from 'models/Customer'
import { connectToDatabase } from 'utils/connectToDatabase'
import { handleError } from 'utils/handleError'
// import redis from 'utils/redis'

export default async function handler(req, res) {
  // if (req.method === 'GET') {
  //   const cached = await redis.get('customers:all')

  //   if (cached) {
  //     res.setHeader(
  //       'Cache-Control',
  //       'public, max-age=60, s-maxage=60, stale-while-revalidate'
  //     )
  //     res.status(httpStatusCodes.OK).json({
  //       message: 'Customers record successfully retrieved.',
  //       data: cached,
  //     })
  //     return
  //   }
  // }

  await connectToDatabase()

  switch (req.method) {
    case 'GET': {
      try {
        const customers = await CustomerModel.find()

        // await redis.set('customer:all', JSON.stringify(customers), {
        //   ex: 2 * 60,
        // })

        // res.setHeader(
        //   'Cache-Control',
        //   'public, max-age=60, s-maxage=60, stale-while-revalidate'
        // )
        res.status(httpStatusCodes.OK).json({
          message: 'Customers record successfully retrieved.',
          data: customers,
        })
      } catch (err) {
        handleError(res, err)
        return
      }

      break
    }

    case 'POST': {
      try {
        const customer = await new CustomerModel(req.body).save()

        // await redis.del(`customer:${customer._id}`)

        res.status(httpStatusCodes.CREATED).json({
          message: 'Customer has been created successfully.',
          data: customer,
        })
      } catch (err) {
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
