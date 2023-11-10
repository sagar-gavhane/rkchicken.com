import fetch from 'node-fetch'
import queryString from 'query-string'
import * as Sentry from '@sentry/nextjs'
import httpStatusCodes from 'http-status-codes'

import { handleError } from 'utils/handleError'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const user = process.env.BULK_SMS_GATEWAY_USER
    const password = process.env.BULK_SMS_GATEWAY_PASSWORD

    const url = queryString.stringifyUrl(
      {
        url: 'https://login.bulksmsgateway.in/userbalance.php',
        query: { user, password, type: 3 },
      },
      { encode: false }
    )

    try {
      const response = await fetch(url).then((response) => response.json())

      res.status(httpStatusCodes.OK).json({
        message: 'SMS balance retrieved successfully.',
        data: response,
      })
    } catch (err) {
      console.error(err)
      Sentry.captureException(err, { level: 'error' })
      handleError(res, err)
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res
      .status(httpStatusCodes.METHOD_NOT_ALLOWED)
      .end(`Method ${req.method} Not Allowed`)
  }
}
