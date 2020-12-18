import React from 'react'
import Link from 'next/link'
import moment from 'moment'
import round from 'lodash.round'
import { useQuery } from 'react-query'
import {
  Breadcrumb,
  Button,
  Col,
  DatePicker,
  Row,
  Select,
  Space,
  Table,
  Form,
} from 'antd'

import AppLayout from 'components/AppLayout'
import companyService from 'services/company'
import purchaseService from 'services/purchases'

export default function CompanyReportPage() {
  const [form] = Form.useForm()

  const { data: companies } = useQuery(['/companies'], function () {
    return companyService.get()
  })

  const { data: invoices, isLoading, refetch } = useQuery(
    [
      '/purchases/invoices',
      {
        companyId: form.getFieldValue('companyId'),
        dateRange: form.getFieldValue('dateRange'),
      },
    ],
    (_, { companyId, dateRange }) => {
      if (companyId && dateRange?.length > 0) {
        const [from, to] = dateRange
        const params = `?companyId=${companyId}&from=${from}&to=${to}`
        return purchaseService.invoice.list(params)
      } else {
        return purchaseService.invoice.list()
      }
    },
    {
      staleTime: 0,
    }
  )

  const columns = [
    {
      title: 'Invoice number',
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
      key: 'companyName',
    },
    {
      title: 'Current bill amount',
      dataIndex: 'currentBillAmount',
      name: 'currentBillAmount',
      render: (value) => `₹${round(value, 2)}`,
    },
    {
      title: 'Paid amount',
      dataIndex: 'paidAmount',
      name: 'paidAmount',
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
  ]

  return (
    <AppLayout>
      <Space direction='vertical'>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link href='/company'>
              <a>Company</a>
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Report</Breadcrumb.Item>
        </Breadcrumb>
        <Row>
          <Col style={{ margin: '1rem 0' }}>
            <Form
              layout='inline'
              name='company-report-form'
              requiredMark={false}
              initialValues={{ companyId: null, dateRange: [] }}
              form={form}
              onFinish={async () => {
                refetch()
              }}
            >
              <Form.Item
                label='Company name'
                name='companyId'
                rules={[
                  { required: true, message: 'Company field is required.' },
                ]}
              >
                <Select placeholder='Select company'>
                  {Array.isArray(companies) &&
                    companies.map((company) => (
                      <Select.Option key={company._id} value={company._id}>
                        {company.name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item
                label='Date range'
                name='dateRange'
                rules={[
                  {
                    required: true,
                    message: 'Date range field is required.',
                  },
                ]}
              >
                <DatePicker.RangePicker />
              </Form.Item>
              <Form.Item>
                <Button type='primary' htmlType='submit'>
                  Filter
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Space>
      <Table
        scroll={{ x: true }}
        loading={isLoading}
        columns={columns}
        dataSource={invoices}
        bordered
      />
    </AppLayout>
  )
}
