import httpStatusCodes from 'http-status-codes'

import InvoiceModel from 'models/Invoice'
import { connectToDatabase } from 'utils/connectToDatabase'
import { handleError } from 'utils/handleError'

export default async function handler(req, res) {
  await connectToDatabase()

  switch (req.method) {
    case 'GET': {
      try {
        const shortKey = req.query.shortKey
        const baseUrl = process.env.NEXT_PUBLIC_URL

        const invoice = await InvoiceModel.findOne({ shortKey })

        if (!invoice) {
          res.redirect(
            httpStatusCodes.PERMANENT_REDIRECT,
            `${baseUrl}/page-not-found`
          )
          return
        }

        const redirectTo = `http://${baseUrl}/sales/invoice/print/${invoice.get(
          '_id'
        )}`
        console.log('[redirectTo]', redirectTo)

        res.redirect(httpStatusCodes.PERMANENT_REDIRECT, redirectTo)
      } catch (err) {
        handleError(res, err)
      }

      break
    }

    default: {
      res.setHeader('Allow', ['GET'])
      res
        .status(httpStatusCodes.METHOD_NOT_ALLOWED)
        .end(`Method ${req.method} Not Allowed`)
    }
  }
}
