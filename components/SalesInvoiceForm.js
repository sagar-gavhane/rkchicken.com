import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import moment from 'moment'
import {
  Row,
  Col,
  Space,
  Typography,
  Form,
  Input,
  InputNumber,
  Button,
  Breadcrumb,
  Select,
  message,
  DatePicker,
} from 'antd'
import { useQuery, useQueryCache } from 'react-query'
import { useRouter } from 'next/router'

import AppLayout from 'components/AppLayout'
import salesService from 'services/sales'
import { getCustomersService } from 'services/customers'

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
}

const initialFormData = {
  invoiceDate: moment(),
  chickenRate: 0,
  birdsNumber: 0,
  weight: 1,
  discountRate: 0,
  currentBillAmount: 0,
  outstandingAmount: 0,
  totalAmount: 0,
  paidAmount: 0,
  remainingBalance: 0,
}

function SalesInvoiceForm(props) {
  const router = useRouter()

  const [formData, setFormData] = useState(() => {
    return typeof props.invoice !== 'undefined'
      ? props.invoice
      : initialFormData
  })

  const [selectedCustomer, setSelectedCustomer] = useState(() => {
    return typeof props.invoice !== 'undefined' ? props.invoice.customer : {}
  })

  const { data: customers } = useQuery(['/customers'], () =>
    getCustomersService()
  )

  const cache = useQueryCache()

  const handleChange = (_, option) => {
    if (!option) {
      setSelectedCustomer({})
    } else {
      const [customer] = customers.filter((c) => c._id === option._id)
      setSelectedCustomer(customer)
    }
  }

  const recalculateAmounts = (formData) => {
    const chickenPrice = formData.chickenRate - formData.discountRate
    const currentBillAmount = formData.weight * chickenPrice
    const totalAmount = currentBillAmount + formData.outstandingAmount
    const remainingBalance = totalAmount - formData.paidAmount

    setFormData({
      ...formData,
      currentBillAmount,
      totalAmount,
      remainingBalance,
    })
  }

  const validateForm = (formData) => {
    if (Object.keys(selectedCustomer).length === 0) {
      return false
    }

    if (formData.totalAmount === 0) {
      return false
    }

    if (!formData.invoiceDate) {
      return false
    }

    return true
  }

  useEffect(() => {
    if (Object.keys(selectedCustomer).length > 0 && formData.chickenRate) {
      const currentBillAmount =
        formData.weight * formData.chickenRate - selectedCustomer.discountRate
      const totalAmount = currentBillAmount + selectedCustomer.outstandingAmount
      const remainingBalance = totalAmount - formData.paidAmount

      setFormData({
        ...formData,
        discountRate: selectedCustomer.discountRate,
        outstandingAmount: selectedCustomer.outstandingAmount,
        currentBillAmount,
        totalAmount,
        remainingBalance,
      })
    }
  }, [selectedCustomer])

  const handleSubmit = async () => {
    const isFormValid = validateForm(formData)

    if (!isFormValid) {
      message.error('Please enter valid input.')
      return
    }

    if (props.actionType === 'EDIT_INVOICE') {
      await salesService.invoice.update(props.invoice._id, {
        ...formData,
        customerId: selectedCustomer._id,
        outstandingAmount: selectedCustomer.outstandingAmount,
      })
      message.success('Sales invoice has been updated.')
      cache.invalidateQueries(['/customers'])
      cache.invalidateQueries(['/sales/invoice'])
      cache.invalidateQueries([
        '/sales/invoice/',
        { invoiceId: props.invoice._id },
      ])

      router.push('/sales')
    } else {
      await salesService.invoice.create({
        ...formData,
        customerId: selectedCustomer._id,
        outstandingAmount: selectedCustomer.outstandingAmount,
      })
      message.success('Sales invoice has been created.')
      cache.invalidateQueries(['/customers'])
      cache.invalidateQueries(['/sales/invoice'])

      router.push('/sales')
    }
  }

  return (
    <AppLayout>
      <Breadcrumb style={{ margin: '1rem 0' }}>
        <Breadcrumb.Item>
          <Link href='/sales'>
            <Typography.Link>Sales</Typography.Link>
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          {props.actionType === 'EDIT_INVOICE'
            ? 'Edit sales invoice'
            : 'New sales invoice'}
        </Breadcrumb.Item>
      </Breadcrumb>
      <Row>
        <Col span={24}>
          <Row justify='center'>
            <Col>
              <Space direction='vertical' align='center'>
                <Typography.Title level={3}>RK Trading</Typography.Title>
                <Typography.Text>Shivajiwadi, Moshi</Typography.Text>
                <Typography.Text>Mobile Number: +91 7744824824</Typography.Text>
                <Typography.Text>Proprietor: Riyaz Khan</Typography.Text>
              </Space>
            </Col>
            <Col></Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12}>
          <Form
            name='new-sales-invoice-form'
            {...layout}
            layout='horizontal'
            style={{ marginTop: '2rem' }}
          >
            <Form.Item
              label='Customer name'
              rules={[
                {
                  required: 'Please select customer.',
                },
              ]}
            >
              <Select
                showSearch
                placeholder='Select a customer'
                value={selectedCustomer.name}
                onChange={handleChange}
                allowClear
              >
                {Array.isArray(customers) &&
                  customers.map((customer) => (
                    <Select.Option
                      key={customer._id}
                      _id={customer._id}
                      value={customer.name}
                    >
                      {customer.name}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item label='Invoice date'>
              <DatePicker
                value={
                  typeof formData.invoiceDate === 'string'
                    ? moment(formData.invoiceDate)
                    : formData.invoiceDate
                }
                onChange={(invoiceDate) =>
                  setFormData({ ...formData, invoiceDate })
                }
              />
            </Form.Item>
            <Form.Item label='Chicken rate'>
              <InputNumber
                type='number'
                min={0}
                value={formData.chickenRate}
                onChange={(chickenRate) => {
                  const nextFormData = { ...formData, chickenRate }
                  setFormData(nextFormData)
                  recalculateAmounts(nextFormData)
                }}
              />
            </Form.Item>
            <Form.Item label='Birds number'>
              <InputNumber
                type='number'
                min={0}
                value={formData.birdsNumber}
                onChange={(birdsNumber) =>
                  setFormData({ ...formData, birdsNumber })
                }
              />
            </Form.Item>
            <Form.Item label='Weight (kg)'>
              <InputNumber
                min={0}
                value={formData.weight}
                onChange={(weight) => {
                  const nextFormData = { ...formData, weight }
                  setFormData(nextFormData)
                  recalculateAmounts(nextFormData)
                }}
              />
            </Form.Item>
            <Form.Item label='Customer discount rate'>
              <InputNumber
                min={0}
                value={formData.discountRate}
                formatter={(value) => `₹${value}`}
                parser={(value) => value.replace('₹', '')}
                onChange={async (discountRate) => {
                  const nextFormData = { ...formData, discountRate }
                  setFormData(nextFormData)
                  recalculateAmounts(nextFormData)
                }}
              />
            </Form.Item>
            <Form.Item label='Current bill amount'>
              <Input
                value={formData.currentBillAmount}
                onChange={(e) => {
                  const currentBillAmount = +e.target.value
                  const nextFormData = { ...formData, currentBillAmount }
                  console.log('[nextFormData]', nextFormData)
                  setFormData(nextFormData)
                  recalculateAmounts(nextFormData)
                }}
                disabled
              />
            </Form.Item>
            <Form.Item label='Previous amount'>
              <Input
                value={formData.outstandingAmount}
                onChange={(outstandingAmount) =>
                  setFormData({ ...formData, outstandingAmount })
                }
                disabled
              />
            </Form.Item>
            <Form.Item label='Total amount'>
              <Input
                value={formData.totalAmount}
                onChange={(totalAmount) =>
                  setFormData({ ...formData, totalAmount })
                }
                disabled
              />
            </Form.Item>
            <Form.Item label='Paid amount'>
              <Input
                value={formData.paidAmount}
                onChange={(e) => {
                  const paidAmount = +e.target.value
                  const remainingBalance = formData.totalAmount - paidAmount
                  const nextFormData = {
                    ...formData,
                    paidAmount,
                    remainingBalance,
                  }

                  setFormData(nextFormData)
                  recalculateAmounts(nextFormData)
                }}
              />
            </Form.Item>
            <Form.Item label='Remaining balance'>
              <Input
                value={formData.remainingBalance}
                onChange={(remainingBalance) => {
                  console.log('[remainingBalance++]', remainingBalance)
                  setFormData({ ...formData, remainingBalance })
                }}
                disabled
              />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button
                type='primary'
                form='new-sales-invoice-form'
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </AppLayout>
  )
}

SalesInvoiceForm.propTypes = {
  actionType: 'CREATE_INVOICE',
}

SalesInvoiceForm.propTypes = {
  invoice: PropTypes.object.isRequired,
  actionType: PropTypes.oneOf(['CREATE_INVOICE', 'EDIT_INVOICE']).isRequired,
}

export default SalesInvoiceForm
