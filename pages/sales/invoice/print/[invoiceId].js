import React from 'react'
import moment from 'moment'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { Col, Row, Space, Typography, Descriptions, Spin } from 'antd'

import salesService from 'services/sales'

const InvoicePrintPage = () => {
  const router = useRouter()

  const invoiceId = router.query.invoiceId

  const { data: invoice, isLoading } = useQuery(
    ['/sales/invoice', { invoiceId }],
    (_, { invoiceId }) => salesService.invoice.get(invoiceId),
    {
      enabled: typeof invoiceId !== 'undefined',
    }
  )

  if (!invoice || isLoading) {
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

  return (
    <div className='invoice-wrapper'>
      <Row justify='center'>
        <Col>
          <Space direction='vertical' align='center'>
            <Typography.Title level={3}>RK Trading</Typography.Title>
            <Typography.Text>Shivajiwadi, Moshi</Typography.Text>
            <Typography.Text>Mobile Number: +91 7744824824</Typography.Text>
            <Typography.Text>Proprietor: Riyaz Khan</Typography.Text>
          </Space>
        </Col>
      </Row>
      <Row style={{ margin: '0.5rem 0' }} justify='space-between'>
        <Col>Invoice No: {invoice.invoiceId}</Col>
        <Col>
          <Typography.Text>
            <Space direction='horizontal'>
              <span>Date:</span>
              <span>
                {moment(invoice.invoiceDate ?? invoice.createdAt).format(
                  'DD/MM/YYYY'
                )}
              </span>
            </Space>
          </Typography.Text>
        </Col>
      </Row>
      <Row style={{ margin: '0.5rem 0' }}>
        <Col>
          <Typography.Text>
            Customer name: {invoice.customer.name}
          </Typography.Text>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Descriptions bordered column={1} size='small'>
            <Descriptions.Item label='Birds No'>
              {invoice.birdsNumber}
            </Descriptions.Item>
            <Descriptions.Item label='Weight'>
              {invoice.weight}
            </Descriptions.Item>
            <Descriptions.Item label='Customer discount rate'>
              ₹{invoice.discountRate}
            </Descriptions.Item>
            <Descriptions.Item label='Current bill amount'>
              ₹{invoice.currentBillAmount}
            </Descriptions.Item>
            <Descriptions.Item label='Previous balance'>
              ₹{invoice.outstandingAmount}
            </Descriptions.Item>
            <Descriptions.Item label='Total amount'>
              ₹{invoice.totalAmount}
            </Descriptions.Item>
            <Descriptions.Item label='Paid amount'>
              ₹{invoice.paidAmount}
            </Descriptions.Item>
            <Descriptions.Item label='Remaining balance'>
              ₹{invoice.remainingBalance}
            </Descriptions.Item>
          </Descriptions>
          <p
            style={{
              display: 'grid',
              justifyContent: 'center',
              padding: '1rem 0',
              margin: 0,
            }}
          >
            Thank You. Visit again!!
          </p>
        </Col>
      </Row>
    </div>
  )
}

export default InvoicePrintPage
