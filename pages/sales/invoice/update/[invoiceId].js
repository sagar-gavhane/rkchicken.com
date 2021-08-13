import React from 'react'
import Error from 'next/error'
import { Spin } from 'antd'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'

import SalesInvoiceForm from 'components/SalesInvoiceForm'
import salesService from 'services/sales'

export default function SalesInvoiceUpdatePage() {
  const router = useRouter()

  const { data, isLoading, error } = useQuery(
    ['/sales/invoice/', { invoiceId: router.query.invoiceId }],
    (_, { invoiceId }) => salesService.invoice.get(invoiceId),
    {
      enabled: typeof router.query.invoiceId !== 'undefined',
    }
  )

  if (isLoading) {
    return (
      <div
        style={{
          display: 'grid',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Spin />
      </div>
    )
  }

  if (error) {
    return <Error statusCode={500} title={error} />
  }

  return <SalesInvoiceForm actionType='EDIT_INVOICE' invoice={data} />
}

export const getServerSideProps = withPageAuthRequired()
