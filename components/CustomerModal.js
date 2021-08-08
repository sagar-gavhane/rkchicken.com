import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Input, message } from 'antd'

import validationRules from 'config/validationRules'
import customerService from 'services/customers'
import queryCache from 'utils/queryCache'

const CustomerModal = (props) => {
  const [form] = Form.useForm()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const defaultFormValues = {
    name: '',
    mobileNumber: '',
    alternativeMobileNumber: '',
    outstandingAmount: 0,
    discountRate: 10,
  }

  useEffect(() => {
    if (props.modalType === 'EDIT_CUSTOMER_MODAL') {
      form.setFieldsValue(props.customer)
    } else {
      form.setFieldsValue(defaultFormValues)
    }
  }, [props.customer])

  return (
    <Modal
      title={
        props.modalType === 'EDIT_CUSTOMER_MODAL'
          ? 'Edit customer'
          : 'New customer'
      }
      centered
      visible={props.visible}
      cancelButtonProps={{ disabled: isSubmitting }}
      onCancel={props.onCancel}
      okText='Submit'
      okButtonProps={{ disabled: isSubmitting }}
      onOk={() => {
        form
          .validateFields()
          .then(async (values) => {
            setIsSubmitting(true)

            if (props.modalType === 'EDIT_CUSTOMER_MODAL') {
              await customerService.update(props.customer._id, values)
              message.success('Customer has been updated successfully.')
            } else {
              await customerService.create(values)
              message.success('Customer has been created successfully.')
            }

            queryCache.invalidateQueries(['/customers'])
            form.resetFields()
            props.onCancel()
          })
          .catch((err) => {
            message.error(err.message)
          })
          .finally(() => setIsSubmitting(false))
      }}
    >
      <Form
        name='customer-form'
        id='customer-form'
        layout='vertical'
        form={form}
        requiredMark={false}
      >
        <Form.Item
          label='Customer name'
          name='name'
          rules={validationRules.customerName}
        >
          <Input autoFocus />
        </Form.Item>
        <Form.Item
          label='Mobile number'
          name='mobileNumber'
          rules={validationRules.mobileNumber}
        >
          <Input type='number' />
        </Form.Item>
        <Form.Item
          label='Alternative mobile number'
          name='alternativeMobileNumber'
          rules={validationRules.alternativeMobileNumber}
        >
          <Input type='number' />
        </Form.Item>
        <Form.Item
          label='Outstanding amount'
          name='outstandingAmount'
          rules={validationRules.outstandingAmount}
        >
          <Input type='number' prefix={<span>Rs.</span>} />
        </Form.Item>
        <Form.Item
          label='Discount rate'
          name='discountRate'
          rules={validationRules.discountRate}
        >
          <Input
            type='number'
            prefix={<span>Rs.</span>}
            defaultValue={10}
            min={0}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

CustomerModal.defaultProps = {
  modalType: 'EDIT_CUSTOMER_MODAL',
  visible: false,
  customer: {},
  onCancel: () => {},
}

CustomerModal.propTypes = {
  modalType: PropTypes.oneOf(['EDIT_CUSTOMER_MODAL', 'CREATE_CUSTOMER_MODAL'])
    .isRequired,
  visible: PropTypes.bool.isRequired,
  customer: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
}

export default CustomerModal
