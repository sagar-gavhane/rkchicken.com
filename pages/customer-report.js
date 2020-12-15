import React from 'react'
import Link from 'next/link'
import moment from 'moment'
import {
  Breadcrumb,
  Col,
  Row,
  Table,
  Form,
  Select,
  DatePicker,
  Button,
  Space,
  Typography,
} from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import { useQuery } from 'react-query'

import AppLayout from 'components/AppLayout'
import salesService from 'services/sales'
import { getCustomersService } from 'services/customers'

export default function CustomerReportPage() {
  const [form] = Form.useForm()

  const { data: customers } = useQuery(['/customers'], () =>
    getCustomersService()
  )
  const { data: invoices, isLoading, refetch } = useQuery(
    [
      '/sales/invoice',
      {
        customerId: form.getFieldValue('customerId'),
        dateRange: form.getFieldValue('dateRange'),
      },
    ],
    (_, { customerId, dateRange }) => {
      if (customerId && dateRange?.length > 0) {
        const [from, to] = dateRange
        const params = `?customerId=${customerId}&from=${from}&to=${to}`
        return salesService.invoice.list(params)
      } else {
        return salesService.invoice.list()
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
      title: 'Customer name',
      dataIndex: ['customer', 'name'],
      key: 'customerName',
    },
    {
      title: 'Bill amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (value) => `₹${value}`,
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
          <Link href={`/sales/invoice/print/${record._id}`}>
            <Typography.Link>
              <EyeOutlined />
            </Typography.Link>
          </Link>
        </Space>
      ),
    },
  ]

  return (
    <AppLayout>
      <Space direction='vertical'>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link href='/customer'>
              <a>Customer</a>
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Report</Breadcrumb.Item>
        </Breadcrumb>
        <Row>
          <Col style={{ margin: '1rem 0' }}>
            <Form
              layout='inline'
              name='customer-report-form'
              requiredMark={false}
              initialValues={{ customerId: null, dateRange: [] }}
              form={form}
              onFinish={async () => {
                refetch()
              }}
            >
              <Form.Item
                label='Customer name'
                name='customerId'
                rules={[
                  { required: true, message: 'Customer field is required.' },
                ]}
              >
                <Select placeholder='Select customer'>
                  {Array.isArray(customers) &&
                    customers.map((customer) => (
                      <Select.Option key={customer._id} value={customer._id}>
                        {customer.name}
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
