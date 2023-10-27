import fetch from 'node-fetch'
import queryString from 'query-string'
import * as Sentry from '@sentry/nextjs'

export async function sendMessage({ message, mobile }) {
  const user = process.env.BULK_SMS_GATEWAY_USER
  const password = process.env.BULK_SMS_GATEWAY_PASSWORD
  const sender = process.env.BULK_SMS_GATEWAY_SENDER

  const url = queryString.stringifyUrl(
    {
      url: process.env.BULK_SMS_GATEWAY_URL,
      query: {
        user,
        password,
        mobile: mobile.join(','),
        message,
        sender,
        type: 3,
        template_id: '1207169778234460576',
      },
    },
    {
      encode: false,
    }
  )

  console.log('sendMessage.url', url)
  console.log('[BULK_SMS_GATEWAY_ENABLE]', process.env.BULK_SMS_GATEWAY_ENABLE)

  // if (process.env.BULK_SMS_GATEWAY_ENABLE === 'true') {
  try {
    const response = await fetch(url).then((response) => response.json())
    console.log('[response]', response)
  } catch (err) {
    console.error(err)
    Sentry.captureException(err, { level: 'error' })
  }
  // }
}
