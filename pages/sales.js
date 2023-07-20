import React, { useState } from 'react'
import Link from 'next/link'
import moment from 'moment'
import round from 'lodash.round'
import { Button, Table, Space, Typography, Popconfirm, message } from 'antd'
import {
  DollarOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import qs from 'query-string'
import { useQuery, useQueryCache } from 'react-query'
import { useRouter } from 'next/router'

import AppLayout from 'components/AppLayout'
import salesService from 'services/sales'
import getOffset from 'utils/getOffset'

export default function SalesPage() {
  const router = useRouter()
  const cache = useQueryCache()
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })

  const { data, isLoading } = useQuery(
    ['/sales/invoice', { pagination }],
    () => {
      const limit = pagination.pageSize
      const offset = getOffset(pagination)

      const params = qs.stringify({ limit, offset })
      return salesService.invoice.list(params)
    }
  )

  const handleDeleteInvoice = async (invoiceId) => {
    try {
      await salesService.invoice.delete(invoiceId)
      message.success('Sales invoice deleted successfully.')
      cache.invalidateQueries(['/sales/invoice'])
    } catch (err) {
      message.error(err.message)
    }
  }

  const handleTableChange = (pagination) => {
    const { current, pageSize } = pagination
    setPagination({ current, pageSize })
  }

  const columns = [
    {
      title: '#',
      dataIndex: 'invoiceId',
      key: 'invoiceId',
      fixed: 'left',
    },
    {
      title: 'Date',
      dataIndex: 'invoiceDate',
      key: 'invoiceDate',
      render: (invoiceDate, invoice) =>
        `${moment(invoiceDate ?? invoice.createdAt).format('DD/MM/YYYY')}`,
    },
    {
      title: 'Customer name',
      dataIndex: ['customer', 'name'],
      key: 'name',
    },
    {
      title: 'Birds No',
      dataIndex: ['birdsNumber'],
      key: 'birdsNumber',
    },
    {
      title: 'Weight',
      dataIndex: ['weight'],
      key: 'weight',
    },
    {
      title: 'Discount rate',
      dataIndex: 'discountRate',
      key: 'discountRate',
      render: (value) => `Rs.${round(value, 2)}`,
    },
    {
      title: 'Current bill amount',
      dataIndex: 'currentBillAmount',
      key: 'currentBillAmount',
      render: (value) => `Rs.${round(value, 2)}`,
    },
    {
      title: 'Previous balance',
      dataIndex: 'outstandingAmount',
      key: 'outstandingAmount',
      render: (value) => `Rs.${round(value, 2)}`,
    },
    {
      title: 'Total amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (value) => `Rs.${round(value, 2)}`,
    },
    {
      title: 'Paid amount',
      dataIndex: 'paidAmount',
      key: 'paidAmount',
      render: (value) => `Rs.${round(value, 2)}`,
    },
    {
      title: 'Outstanding amount',
      dataIndex: 'remainingBalance',
      key: 'remainingBalance',
      render: (value) => `Rs.${round(value, 2)}`,
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      render: (_, record) => (
        <Space size='middle'>
          <Link href={`/sales/invoice/print/${record._id}`}>
            <EyeOutlined />
          </Link>
          <Link href={`/sales/invoice/update/${record._id}`}>
            <EditOutlined />
          </Link>
          <Popconfirm
            title='Are you sure to delete this invoice?'
            onConfirm={() => handleDeleteInvoice(record._id)}
            okText='Yes'
            cancelText='No'
          >
            <Typography.Link>
              <DeleteOutlined />
            </Typography.Link>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <AppLayout>
      <Button
        type='primary'
        icon={<DollarOutlined />}
        style={{ marginBottom: '1rem' }}
        onClick={() => router.push('/sales/invoice/create')}
      >
        New sales invoice
      </Button>
      <Table
        scroll={{ x: true }}
        loading={isLoading}
        columns={columns}
        dataSource={data?.invoices}
        pagination={{
          pageSize: pagination.pageSize,
          current: pagination.current,
          ...(data?.total && { total: data.total }),
        }}
        onChange={handleTableChange}
        bordered
      />
    </AppLayout>
  )
}
