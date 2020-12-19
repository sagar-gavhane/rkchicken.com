import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Input, message } from 'antd'
import { useQueryCache } from 'react-query'

import validationRules from 'config/validationRules'
import companyService from 'services/company'

const CompanyModal = (props) => {
  const [form] = Form.useForm()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const cache = useQueryCache()

  const defaultFormValues = {
    name: '',
    mobileNumber: '',
    address: '',
    outstandingAmount: 0,
  }

  useEffect(() => {
    if (props.modalType === 'EDIT_COMPANY_MODAL') {
      form.setFieldsValue(props.company)
    } else {
      form.setFieldsValue(defaultFormValues)
    }
  }, [props.company])

  return (
    <Modal
      title={
        props.modalType === 'EDIT_COMPANY_MODAL'
          ? 'Edit company'
          : 'New company'
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

            if (props.modalType === 'EDIT_COMPANY_MODAL') {
              await companyService.update(props.company._id, values)
              message.success('Company has been updated successfully.')
            } else {
              await companyService.create(values)
              message.success('Company has been created successfully.')
            }

            cache.invalidateQueries(['/companies'])
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
        name='company-form'
        id='company-form'
        layout='vertical'
        form={form}
        requiredMark={false}
      >
        <Form.Item
          label='Company name'
          name='name'
          rules={validationRules.companyName}
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
          label='Outstanding amount'
          name='outstandingAmount'
          rules={validationRules.outstandingAmount}
        >
          <Input type='number' />
        </Form.Item>
        <Form.Item label='Address' name='address'>
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

CompanyModal.defaultProps = {
  modalType: 'EDIT_COMPANY_MODAL',
  visible: false,
  company: {},
  onCancel: () => {},
}

CompanyModal.propTypes = {
  modalType: PropTypes.oneOf(['EDIT_COMPANY_MODAL', 'CREATE_COMPANY_MODAL'])
    .isRequired,
  visible: PropTypes.bool.isRequired,
  company: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
}

export default CompanyModal
