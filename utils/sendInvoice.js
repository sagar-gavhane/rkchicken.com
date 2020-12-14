import format from 'date-fns/format'

import { sendMessage } from 'utils/sendMessage'

export function sendInvoice(customer, invoice) {
  const mobile = [customer.mobileNumber]
  const message = `Invoice no: ${invoice.invoiceId}\nDate: ${format(
    new Date(invoice.createdAt),
    'dd/MM/yyyy'
  )}\nToday Chicken Rate: 200\nWeight: ${
    invoice.weight
  }\nCurrent Bill Amount: ${invoice.currentBillAmount}\nPrevious bill amount: ${
    invoice.outstandingAmount
  }\nRemaing bill amount: ${invoice.remainingBalance}\nPaid bill amount: ${
    invoice.paidAmount
  }
  `

  if (customer.alternativeMobileNumber) {
    mobile.push(customer.alternativeMobileNumber)
  }

  sendMessage({ message, mobile })
}
