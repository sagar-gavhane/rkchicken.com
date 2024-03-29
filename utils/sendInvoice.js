import format from 'date-fns/format'

import { sendMessage } from 'utils/sendMessage'

const baseUrl = process.env.NEXT_PUBLIC_URL

export async function sendInvoice(customer, invoice) {
  const mobile = [customer.mobileNumber]

  const message = [
    `Rk Chicken Center`,
    `Shivajivadi, Moshi`,
    `Date: ${format(new Date(invoice.invoiceDate), 'dd/MM/yyyy')}`,
    `Bill details: ${baseUrl}/s/${invoice.shortKey} `,
    `Rktraders`,
  ].join('\n')

  if (customer.alternativeMobileNumber) {
    mobile.push(customer.alternativeMobileNumber)
  }

  await sendMessage({ message, mobile })
}
