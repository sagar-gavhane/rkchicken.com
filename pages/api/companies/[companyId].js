import httpStatusCodes from 'http-status-codes'
import { Types } from 'mongoose'

import CompanyModel from 'models/Company'
import companyError from 'errors/company'
import { connectToDatabase } from 'utils/connectToDatabase'
import { handleError } from 'utils/handleError'

export default async function handler(req, res) {
  try {
    // early catch invalid ids
    if (!Types.ObjectId.isValid(req.query.companyId)) {
      throw companyError.INVALID_COMPANY_ID(req.query.companyId)
    }

    await connectToDatabase()

    // early catch is exist or not database
    const company = await CompanyModel.exists({ _id: req.query.companyId })

    if (!company) {
      throw companyError.COMPANY_NOT_FOUND(req.query.companyId)
    }
  } catch (err) {
    handleError(res, err)
    return
  }

  switch (req.method) {
    case 'GET': {
      try {
        const company = await CompanyModel.findById(req.query.companyId).lean()

        res.status(httpStatusCodes.OK).send({
          message: 'Company record has been retrieved successfully.',
          data: company,
        })
      } catch (err) {
        handleError(res, err)
      }

      break
    }

    case 'PATCH': {
      try {
        const company = await CompanyModel.findByIdAndUpdate(
          req.query.companyId,
          req.body,
          {
            new: true,
            upsert: false,
            runValidators: true,
            lean: true,
          }
        )

        res.status(httpStatusCodes.OK).send({
          message: 'Company record has been updated successfully.',
          data: company,
        })
      } catch (err) {
        handleError(res, err)
      }

      break
    }

    case 'DELETE': {
      try {
        await CompanyModel.findByIdAndRemove(req.query.companyId)

        res.status(httpStatusCodes.NO_CONTENT).send({
          message: 'Company record has been deleted successfully.',
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
