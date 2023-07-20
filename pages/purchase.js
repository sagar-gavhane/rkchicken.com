import React from 'react'
import moment from 'moment'
import Link from 'next/link'
import round from 'lodash.round'
import { Table, Space, Typography, Popconfirm, Button, message } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useQuery, useQueryCache } from 'react-query'
import { useRouter } from 'next/router'

import AppLayout from 'components/AppLayout'
import purchaseService from 'services/purchases'

export default function PurchasePage() {
  const router = useRouter()
  const cache = useQueryCache()

  const { data, isLoading } = useQuery(['/purchases/invoices'], () => {
    return purchaseService.invoice.list()
  })

  const handleDeleteInvoice = async (invoiceId) => {
    try {
      await purchaseService.invoice.delete(invoiceId)
      message.success('Purchase invoice deleted successfully.')
      cache.invalidateQueries(['/purchases/invoices'])
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
      title: 'Company name',
      dataIndex: ['company', 'name'],
      key: 'name',
    },
    {
      title: 'Chicken rate',
      dataIndex: 'chickenRate',
      name: 'chickenRate',
      render: (value) => `Rs.${round(value, 2)}`,
    },
    {
      title: 'Current bill amount',
      dataIndex: 'currentBillAmount',
      name: 'currentBillAmount',
      render: (value) => `Rs.${round(value, 2)}`,
    },
    {
      title: 'Paid amount',
      dataIndex: 'paidAmount',
      name: 'paidAmount',
      render: (value) => `Rs.${round(value, 2)}`,
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
          <Link href={`/purchase/invoice/update/${record._id}`} legacyBehavior>
            <Typography.Link>
              <EditOutlined />
            </Typography.Link>
          </Link>
          <Popconfirm
            title='Are you sure to delete this invoice?'
            onConfirm={() => {
              handleDeleteInvoice(record._id)
            }}
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
        style={{ marginBottom: '1rem' }}
        onClick={() => router.push('/purchase/invoice/create')}
      >
        New purchase invoice
      </Button>
      <Table
        scroll={{ x: true }}
        bordered
        loading={isLoading}
        columns={columns}
        dataSource={data}
      />
    </AppLayout>
  )
}
