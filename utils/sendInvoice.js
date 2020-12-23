import format from 'date-fns/format'

import { sendMessage } from 'utils/sendMessage'

export function sendInvoice(customer, invoice) {
  const mobile = [customer.mobileNumber]
  const message = [
    `Invoice no: ${invoice.invoiceId}`,
    `Date: ${format(new Date(invoice.createdAt), 'dd/MM/yyyy')}`,
    `Chicken rate: ${invoice.chickenRate}`,
    `Weight: ${invoice.weight}`,
    `Current bill amount: ${invoice.currentBillAmount}`,
    `Previous bill amount: ${invoice.outstandingAmount}`,
    `Remaing bill amount: ${invoice.remainingBalance}`,
    `Paid bill amount: ${invoice.paidAmount}`,
  ].join('\n')

  if (customer.alternativeMobileNumber) {
    mobile.push(customer.alternativeMobileNumber)
  }

  sendMessage({ message, mobile })
}
