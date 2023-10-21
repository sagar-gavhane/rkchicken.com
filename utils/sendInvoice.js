import format from 'date-fns/format'

import { sendMessage } from 'utils/sendMessage'

export function sendInvoice(customer, invoice) {
  const mobile = [customer.mobileNumber]

  const message = [
    `Rk Chicken Center`,
    `Shivajivadi, Moshi`,
    `Date: ${format(new Date(invoice.invoiceDate), 'dd/MM/yyyy')}`,
    `Bill details: https://rkchichen.com/s/${invoice.shortKey}`,
  ].join('\n')

  if (customer.alternativeMobileNumber) {
    mobile.push(customer.alternativeMobileNumber)
  }

  sendMessage({ message, mobile })
}
