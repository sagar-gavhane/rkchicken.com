import format from 'date-fns/format'

import { sendMessage } from 'utils/sendMessage'

export function sendInvoice(customer, invoice) {
  const mobile = [customer.mobileNumber]

  const message = [
    `Rktraders`,
    `Invoice no: ${invoice.invoiceId}`,
    `Date: ${format(new Date(invoice.invoiceDate), 'dd/MM/yyyy')}`,
    `Chicken Rate: ${invoice.chickenRate}`,
    `Birds nos: ${invoice.birdsNumber}`,
    `Weight: ${invoice.weight}`,
    `Current Bill Amount: ${invoice.currentBillAmount}`,
    `Previous bill amount: ${invoice.outstandingAmount}`,
    `Paid bill amount: ${invoice.paidAmount}`,
    `Remaining bill amount: ${invoice.remainingBalance}`,
  ].join('\n')

  if (customer.alternativeMobileNumber) {
    mobile.push(customer.alternativeMobileNumber)
  }

  sendMessage({ message, mobile })
}
