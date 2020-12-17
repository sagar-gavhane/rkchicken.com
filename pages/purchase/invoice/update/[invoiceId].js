import React from 'react'
import Error from 'next/error'
import { Spin } from 'antd'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'

import PurchaseInvoiceForm from 'components/PurchaseInvoiceForm'
import purchaseService from 'services/purchases'

export default function SalesInvoiceUpdatePage() {
  const router = useRouter()

  const { data, isLoading, error } = useQuery(
    ['/purchase/invoice/', { invoiceId: router.query.invoiceId }],
    (_, { invoiceId }) => purchaseService.invoice.get(invoiceId),
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

  return <PurchaseInvoiceForm actionType='EDIT_INVOICE' invoice={data} />
}
