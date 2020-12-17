import React, { useState } from 'react'
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
import purchaseService from 'services/purchases'
import companyService from 'services/company'

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
  currentBillAmount: 0,
  paidAmount: 0,
}

function PurchaseInvoiceForm(props) {
  const router = useRouter()

  const [formData, setFormData] = useState(() => {
    return typeof props.invoice !== 'undefined'
      ? props.invoice
      : initialFormData
  })

  const [selectedCompany, setSelectedCompany] = useState(() => {
    return typeof props.invoice !== 'undefined' ? props.invoice.company : {}
  })

  const { data: company } = useQuery(['/companies'], () => companyService.get())

  const cache = useQueryCache()

  const handleChange = (_, option) => {
    if (!option) {
      setSelectedCompany({})
    } else {
      const [company] = company.filter((c) => c._id === option._id)
      setSelectedCompany(company)
    }
  }

  const validateForm = (formData) => {
    if (Object.keys(selectedCompany).length === 0) {
      return false
    }

    if (!formData.invoiceDate) {
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    const isFormValid = validateForm(formData)

    if (!isFormValid) {
      message.error('Please enter valid input.')
      return
    }

    if (props.actionType === 'EDIT_INVOICE') {
      await purchaseService.invoice.update(props.invoice._id, {
        ...formData,
        companyId: selectedCompany._id,
      })
      message.success('Purchase invoice has been updated.')
      cache.invalidateQueries(['/companies'])
      cache.invalidateQueries(['/purchase/invoices'])
      cache.invalidateQueries([
        '/purchase/invoice/',
        { invoiceId: props.invoice._id },
      ])

      router.push('/purchase')
    } else {
      await purchaseService.invoice.create({
        ...formData,
        companyId: selectedCompany._id,
      })
      message.success('Purchase invoice has been created.')
      cache.invalidateQueries(['/companies'])
      cache.invalidateQueries(['/purchase/invoice'])

      router.push('/purchase')
    }
  }

  return (
    <AppLayout>
      <Breadcrumb style={{ margin: '1rem 0' }}>
        <Breadcrumb.Item>
          <Link href='/purchase'>
            <Typography.Link>Purchase</Typography.Link>
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          {props.actionType === 'EDIT_INVOICE'
            ? 'Edit purchase invoice'
            : 'New purchase invoice'}
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
              label='Company name'
              rules={[
                {
                  required: 'Please select company.',
                },
              ]}
            >
              <Select
                showSearch
                placeholder='Select a customer'
                value={selectedCompany.name}
                onChange={handleChange}
                allowClear
              >
                {Array.isArray(company) &&
                  company.map((company) => (
                    <Select.Option
                      key={company._id}
                      _id={company._id}
                      value={company.name}
                    >
                      {company.name}
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
                }}
              />
            </Form.Item>
            <Form.Item label='Current bill amount'>
              <Input
                value={formData.currentBillAmount}
                onChange={(e) => {
                  const currentBillAmount = +e.target.value
                  const nextFormData = { ...formData, currentBillAmount }
                  setFormData(nextFormData)
                }}
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
                }}
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

PurchaseInvoiceForm.propTypes = {
  actionType: 'CREATE_INVOICE',
}

PurchaseInvoiceForm.propTypes = {
  invoice: PropTypes.object.isRequired,
  actionType: PropTypes.oneOf(['CREATE_INVOICE', 'EDIT_INVOICE']).isRequired,
}

export default PurchaseInvoiceForm
