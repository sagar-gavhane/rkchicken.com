import React from 'react'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'

import SalesInvoiceForm from 'components/SalesInvoiceForm'

function SalesInvoiceCreatePage() {
  return <SalesInvoiceForm actionType='CREATE_INVOICE' />
}

export default SalesInvoiceCreatePage

export const getServerSideProps = withPageAuthRequired()
