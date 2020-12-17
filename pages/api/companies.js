import httpStatusCodes from 'http-status-codes'

import CompanyModel from 'models/Company'
import { connectToDatabase } from 'utils/connectToDatabase'
import { handleError } from 'utils/handleError'

export default async function handler(req, res) {
  await connectToDatabase()

  switch (req.method) {
    case 'GET': {
      try {
        const companies = await CompanyModel.find().lean()

        res.status(httpStatusCodes.OK).send({
          message: 'Companies record successfully retrieved.',
          data: companies,
        })
      } catch (err) {
        handleError(res, err)
      }

      break
    }

    case 'POST': {
      try {
        const company = await new CompanyModel(req.body).save()

        res.status(httpStatusCodes.CREATED).send({
          message: 'Company has been created successfully.',
          data: company,
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
