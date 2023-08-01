import httpStatusCodes from 'http-status-codes'
import { Types } from 'mongoose'

import CustomerModel from 'models/Customer'
import customerError from 'errors/customer'
import { connectToDatabase } from 'utils/connectToDatabase'
import { handleError } from 'utils/handleError'
import redis from 'utils/redis'

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const cached = await redis.get(`customer:${req.query.customerId}`)

      if (cached) {
        res.status(httpStatusCodes.OK).send({
          message: 'Customer record has been retrieved successfully.',
          data: cached,
        })
        return
      }
    }

    // early catch invalid customer ids
    if (!Types.ObjectId.isValid(req.query.customerId)) {
      throw customerError.INVALID_CUSTOMER_ID(req.query.customerId)
    }

    console.time('connectToDatabase')
    await connectToDatabase()
    console.timeEnd('connectToDatabase')

    // early catch customer is exist or not database
    console.time('exists')
    const customer = await CustomerModel.exists({ _id: req.query.customerId })
    console.timeEnd('exists')

    if (!customer) {
      throw customerError.CUSTOMER_NOT_FOUND(req.query.customerId)
    }
  } catch (err) {
    handleError(res, err)
    return
  }

  switch (req.method) {
    case 'GET': {
      try {
        // console.time('redis.get customer:id')
        // const cached = await redis.get(`customer:${req.query.customerId}`)
        // console.timeEnd('redis.get customer:id')

        // if (cached) {
        //   res.status(httpStatusCodes.OK).send({
        //     message: 'Customer record has been retrieved successfully.',
        //     data: cached,
        //   })
        //   return
        // }

        console.time('findById')
        const customer = await CustomerModel.findById(req.query.customerId)
        console.timeEnd('findById')

        console.time('redis.set customer:id')
        await redis.set(
          `customer:${req.query.customerId}`,
          JSON.stringify(customer),
          { ex: 2 * 60 }
        )
        console.timeEnd('redis.set customer:id')

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

        await redis.set(
          `customer:${req.query.customerId}`,
          JSON.stringify(customer),
          { ex: 2 * 60 }
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

        await redis.del(`customer:${req.query.customerId}`)

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
      res.setHeader('Allow', ['GET', 'PATCH', 'DELETE'])
      res
        .status(httpStatusCodes.METHOD_NOT_ALLOWED)
        .end(`Method ${req.method} Not Allowed`)
    }
  }
}
