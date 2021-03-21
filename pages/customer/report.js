import React from 'react'
import Link from 'next/link'
import moment from 'moment'
import round from 'lodash.round'
import sumBy from 'lodash.sumby'
import papaparse from 'papaparse'
import {
  Col,
  Row,
  Table,
  Form,
  Select,
  DatePicker,
  Button,
  Space,
  Typography,
  message,
} from 'antd'
import { EyeOutlined, ExportOutlined } from '@ant-design/icons'
import { useQuery } from 'react-query'

import AppLayout from 'components/AppLayout'
import salesService from 'services/sales'
import customerService from 'services/customers'

function calculateSummary(invoices) {
  const paidAmount = round(
    sumBy(invoices, (invoice) => invoice.paidAmount),
    2
  )

  const totalCurrentBillAmount = round(
    sumBy(invoices, (page) => page.currentBillAmount)
  )

  return {
    paidAmount,
    totalCurrentBillAmount,
  }
}

export default function CustomerReportPage() {
  const [form] = Form.useForm()

  const { data: customers } = useQuery(['/customers'], () =>
    customerService.get()
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

  const exportCSV = () => {
    try {
      const { paidAmount, totalCurrentBillAmount } = calculateSummary(invoices)

      let csvContent = papaparse.unparse(
        invoices.map((invoice) => {
          return {
            'Invoice number': invoice.invoiceId,
            Date: `${moment(invoice.invoiceDate).format('DD/MM/YYYY')}`,
            'Customer name': invoice.customer.name,
            'Birds No': invoice.birdsNumber,
            Weight: invoice.weight,
            'Discount rate': invoice.discountRate,
            'Current bill amount': invoice.currentBillAmount,
            'Previous balance': invoice.outstandingAmount,
            'Total amount': invoice.totalAmount,
            'Paid amount': invoice.paidAmount,
            'Outstanding amount': invoice.remainingBalance,
          }
        })
      )
      csvContent += `\nTotal,,,,,,${totalCurrentBillAmount},,,${paidAmount},,`

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)

      let link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `sheet-${moment().unix()}.csv`)
      link.click()
    } catch (err) {
      message.error(err.message)
    }
  }

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
      title: 'Birds No',
      dataIndex: 'birdsNumber',
      key: 'birdsNumber',
    },
    {
      title: 'Weight',
      dataIndex: 'weight',
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
                <Select.Option value='ALL_CUSTOMER'>
                  All Customers
                </Select.Option>
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
      <Button
        style={{ marginBottom: '1rem' }}
        icon={<ExportOutlined />}
        onClick={exportCSV}
        disabled={!form.getFieldValue('customerId')}
      >
        Export CSV
      </Button>
      <Table
        scroll={{ x: true }}
        loading={isLoading}
        columns={columns}
        dataSource={invoices}
        bordered
        pagination={!form.getFieldValue('customerId')}
        summary={(record) => {
          const { paidAmount, totalCurrentBillAmount } = calculateSummary(
            record
          )

          return (
            <Table.Summary.Row style={{ backgroundColor: '#f5f5f5' }}>
              <Table.Summary.Cell colSpan={6}>Total</Table.Summary.Cell>
              <Table.Summary.Cell>
                <Typography.Text>Rs.{totalCurrentBillAmount}</Typography.Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell colSpan={2}>
                <Typography.Text></Typography.Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Typography.Text>Rs.{paidAmount}</Typography.Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell colSpan={2}>
                <Typography.Text></Typography.Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )
        }}
      />
    </AppLayout>
  )
}
