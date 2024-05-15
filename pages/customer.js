import React, { useState } from 'react'
import moment from 'moment'
import round from 'lodash.round'
import { Button, Table, Space, Typography, Popconfirm, message } from 'antd'
import {
  UserAddOutlined,
  FilePdfOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { useQuery, useQueryCache } from 'react-query'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { captureException } from '@sentry/nextjs'
import { PatternFormat, NumericFormat } from 'react-number-format'
import formatRelative from 'date-fns/formatRelative'

import AppLayout from 'components/AppLayout'
import CustomerModal from 'components/CustomerModal'
import GlobalNumericFormat from 'components/GlobalNumericFormat'
import customerService from 'services/customers'
import customerError from 'errors/customer'
import capitalize from 'utils/capitalize'

export default function CustomerPage() {
  const [showCustomerModal, setShowCustomerModal] = useState(false)
  const [modalType, setModalType] = useState('CREATE_CUSTOMER_MODAL')
  const [selectedCustomer, setSelectedCustomer] = useState({})

  const cache = useQueryCache()
  const router = useRouter()

  const { data, isLoading } = useQuery(['/customers'], () =>
    customerService.get()
  )

  const handleDeleteCustomer = async (customerID) => {
    try {
      await customerService.delete(customerID)
      message.success('Customer deleted successfully.')
      cache.invalidateQueries(['/customers'])
    } catch (err) {
      const customerDeletionError =
        customerError.CustomerDeletionError(customerID)

      message.error(customerDeletionError.message)

      captureException(customerDeletionError, {
        level: 'error',
        extra: {
          errorMessage: err.message,
          stackTrace: err.stack,
        },
      })
    }
  }

  const columns = [
    {
      title: '#',
      dataIndex: 'customerId',
      key: 'customerId',
      align: 'center',
    },
    {
      title: 'Customer name',
      dataIndex: 'name',
      key: 'name',
      render: (_, _customer) => {
        return (
          <Link href={`/customer/${_customer._id}`}>
            <a>{_customer.name}</a>
          </Link>
        )
      },
    },
    {
      title: 'Mobile number',
      dataIndex: 'mobileNumber',
      key: 'mobileNumber',
      render: (_, _customer) => {
        return (
          <Typography.Link href={`tel:${_customer.mobileNumber}`}>
            <PatternFormat
              value={_customer.mobileNumber}
              format='+91 ##### #####'
              displayType='text'
            />
          </Typography.Link>
        )
      },
    },
    {
      title: 'Alternative mobile number',
      dataIndex: 'alternativeMobileNumber',
      key: 'alternativeMobileNumber',
      render: (_, _customer) => {
        return (
          <Typography.Link href={`tel:${_customer.alternativeMobileNumber}`}>
            <PatternFormat
              value={_customer.alternativeMobileNumber}
              format='+91 ##### #####'
              displayType='text'
            />
          </Typography.Link>
        )
      },
    },
    {
      title: 'Discount rate',
      dataIndex: 'discountRate',
      key: 'discountRate',
      render: (value) => <GlobalNumericFormat value={value} />,
    },
    {
      title: 'Outstanding amount',
      dataIndex: 'outstandingAmount',
      key: 'outstandingAmount',
      render: (value) => <GlobalNumericFormat value={value} />,
    },
    {
      title: 'Created at',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_, _customer) => {
        return capitalize(
          formatRelative(new Date(_customer.createdAt), new Date())
        )
      },
    },
    {
      title: 'Updated at',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (_, _customer) => {
        return capitalize(
          formatRelative(new Date(_customer.updatedAt), new Date(), {})
        )
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size='middle'>
          <Typography.Link
            onClick={() => {
              setShowCustomerModal(true)
              setSelectedCustomer(record)
              setModalType('EDIT_CUSTOMER_MODAL')
            }}
          >
            <EditOutlined />
          </Typography.Link>
          <Popconfirm
            title='Are you sure to delete this customer?'
            onConfirm={() => handleDeleteCustomer(record._id)}
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
      <CustomerModal
        visible={showCustomerModal}
        modalType={modalType}
        customer={selectedCustomer}
        onCancel={() => {
          setSelectedCustomer({})
          setShowCustomerModal(false)
          setModalType('')
        }}
      />
      <Space style={{ marginBottom: '1rem' }}>
        <Button
          type='primary'
          icon={<UserAddOutlined />}
          onClick={() => {
            setShowCustomerModal(true)
            setModalType('CREATE_CUSTOMER_MODAL')
          }}
        >
          New customer
        </Button>
        <Button
          type='default'
          icon={<FilePdfOutlined />}
          onClick={() => router.push('/customer/report')}
        >
          Report
        </Button>
      </Space>
      <Table
        scroll={{ x: true }}
        rowKey={(row) => row._id}
        loading={isLoading}
        columns={columns}
        dataSource={data}
        bordered
        title={() => <Typography.Title level={4}>Customers</Typography.Title>}
      />
    </AppLayout>
  )
}
