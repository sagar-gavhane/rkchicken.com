import format from 'date-fns/format'

import { sendMessage } from 'utils/sendMessage'

export function sendInvoice(customer, invoice) {
  const mobile = [customer.mobileNumber]
  const message = [
    `Rk Traders, Moshi`,
    `Invoice no: ${invoice.invoiceId}`,
    `Date: ${format(new Date(invoice.invoiceDate), 'dd/MM/yyyy')}`,
    `Chicken rate: ${invoice.chickenRate}`,
    `Birds nos: ${invoice.birdsNumber}`,
    `Weight: ${invoice.weight}`,
    `Current bill amount: ${invoice.currentBillAmount}`,
    `Previous bill amount: ${invoice.outstandingAmount}`,
    `Paid bill amount: ${invoice.paidAmount}`,
    `Remaining bill amount: ${invoice.remainingBalance}`,
  ].join('\n')

  if (customer.alternativeMobileNumber) {
    mobile.push(customer.alternativeMobileNumber)
  }

  sendMessage({ message, mobile })
}
