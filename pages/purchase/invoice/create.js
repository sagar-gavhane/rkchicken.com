import React from 'react'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'

import PurchaseInvoiceForm from 'components/PurchaseInvoiceForm'

function SalesInvoiceCreatePage() {
  return <PurchaseInvoiceForm actionType='CREATE_INVOICE' />
}

export default SalesInvoiceCreatePage

export const getServerSideProps = withPageAuthRequired()
