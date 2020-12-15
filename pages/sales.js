import React from 'react'
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
import { useQuery, useQueryCache } from 'react-query'
import { useRouter } from 'next/router'

import AppLayout from 'components/AppLayout'
import salesService from 'services/sales'

export default function SalesPage() {
  const router = useRouter()
  const cache = useQueryCache()

  const { data, isLoading } = useQuery(['/sales/invoice'], () =>
    salesService.invoice.list()
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

  const columns = [
    {
      title: '#',
      dataIndex: 'invoiceId',
      key: 'invoiceId',
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
      title: 'Mobile number',
      dataIndex: ['customer', 'mobileNumber'],
      key: 'mobileNumber',
    },
    {
      title: 'Discount rate',
      dataIndex: 'discountRate',
      key: 'discountRate',
      render: (value) => `₹${round(value, 2)}`,
    },
    {
      title: 'Outstanding amount',
      dataIndex: 'remainingBalance',
      key: 'remainingBalance',
      render: (value) => `₹${round(value, 2)}`,
    },
    {
      title: 'Created at',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => `${moment(createdAt).fromNow()}`,
    },
    {
      title: 'Updated at',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (updatedAt) => `${moment(updatedAt).fromNow()}`,
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size='middle'>
          <Link href={`/sales/invoice/print/${record._id}`}>
            <Typography.Link>
              <EyeOutlined />
            </Typography.Link>
          </Link>
          <Link href={`/sales/invoice/update/${record._id}`}>
            <Typography.Link>
              <EditOutlined />
            </Typography.Link>
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
        dataSource={data}
        bordered
      />
    </AppLayout>
  )
}
