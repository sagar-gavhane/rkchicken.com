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

import AppLayout from 'components/AppLayout'
import CustomerModal from 'components/CustomerModal'
import customerService from 'services/customers'

export default function CustomerPage() {
  const [showCustomerModal, setShowCustomerModal] = useState(false)
  const [modalType, setModalType] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState({})

  const cache = useQueryCache()
  const router = useRouter()

  const { data, isLoading } = useQuery(['/customers'], () =>
    customerService.get()
  )

  const handleDeleteCustomer = async (customerID) => {
    await customerService.delete(customerID)
    message.success('customer has been successfully deleted.')
    cache.invalidateQueries(['/customers'])
  }

  const columns = [
    {
      title: '#',
      dataIndex: 'customerId',
      key: 'customerId',
    },
    {
      title: 'Customer name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mobile number',
      dataIndex: 'mobileNumber',
      key: 'mobileNumber',
    },
    {
      title: 'Alternative mobile number',
      dataIndex: 'alternativeMobileNumber',
      key: 'alternativeMobileNumber',
    },
    {
      title: 'Discount rate',
      dataIndex: 'discountRate',
      key: 'discountRate',
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
          onClick={() => router.push('/customer-report')}
        >
          Report
        </Button>
      </Space>
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
