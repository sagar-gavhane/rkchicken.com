import httpStatusCodes from 'http-status-codes'

import UserModel from 'models/User'
import userError from 'errors/user'
import { connectToDatabase } from 'utils/connectToDatabase'
import { handleError } from 'utils/handleError'

export default async function handler(req, res) {
  await connectToDatabase()

  switch (req.method) {
    case 'POST': {
      try {
        const { email, password } = req.body
        const userExists = await UserModel.exists({ email, password })

        if (!userExists) {
          throw userError.AUTH_MISMATCHED()
        }

        res.status(httpStatusCodes.OK).json({
          message: 'User has been successfully logged in.',
          data: {},
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
