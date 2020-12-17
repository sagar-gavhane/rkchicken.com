import React, { useState } from 'react'
import round from 'lodash.round'
import moment from 'moment'
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
import CompanyModal from 'components/CompanyModal'
import companyService from 'services/company'

export default function CompanyPage() {
  const [showCompanyModal, setShowCompanyModal] = useState(false)
  const [modalType, setModalType] = useState('')
  const [selectedCompany, setSelectedCompany] = useState({})

  const router = useRouter()
  const cache = useQueryCache()

  const { data: companies, isLoading } = useQuery(['/companies'], () => {
    return companyService.get()
  })

  const handleDeleteCompany = async (companyId) => {
    await companyService.delete(companyId)
    message.success('Compnay has been successfully deleted.')
    cache.invalidateQueries(['/companies'])
  }

  const columns = [
    {
      title: '#',
      dataIndex: 'companyId',
      key: 'companyId',
    },
    {
      title: 'Company name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mobile number',
      dataIndex: 'mobileNumber',
      key: 'mobileNumber',
    },
    {
      title: 'Outstanding amount',
      dataIndex: 'outstandingAmount',
      key: 'outstandingAmount',
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
              setShowCompanyModal(true)
              setSelectedCompany(record)
              setModalType('EDIT_COMPANY_MODAL')
            }}
          >
            <EditOutlined />
          </Typography.Link>
          <Popconfirm
            title='Are you sure to delete this company?'
            onConfirm={() => {
              handleDeleteCompany(record._id)
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
      <CompanyModal
        visible={showCompanyModal}
        modalType={modalType}
        company={selectedCompany}
        onCancel={() => {
          setSelectedCompany({})
          setShowCompanyModal(false)
          setModalType('')
        }}
      />
      <Space style={{ marginBottom: '1rem' }}>
        <Button
          type='primary'
          icon={<UserAddOutlined />}
          onClick={() => {
            setShowCompanyModal(true)
            setModalType('CREATE_COMPANY_MODAL')
          }}
        >
          New company
        </Button>
        <Button
          type='default'
          icon={<FilePdfOutlined />}
          onClick={() => {
            router.push('/company/report')
          }}
        >
          Report
        </Button>
      </Space>
      <Table
        scroll={{ x: true }}
        loading={isLoading}
        bordered
        columns={columns}
        dataSource={companies}
      />
    </AppLayout>
  )
}
