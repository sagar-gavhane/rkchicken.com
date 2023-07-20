import React, { useContext } from 'react'
import { Form, Input, Button, Row, Col, Typography, message } from 'antd'
import { LockOutlined, MailOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'
import { useMutation } from 'react-query'

import authService from 'services/auth'
import validationRules from 'config/validationRules'
import AuthContext from 'context/AuthContext'

const IndexPage = () => {
  const router = useRouter()
  const [loginMutation] = useMutation(authService.login)
  const [user, setUser] = useContext(AuthContext)

  const onFinish = async (values) => {
    loginMutation(values, {
      onSuccess: async () => {
        const authPayload = { ...values, signedIn: true }
        setUser(authPayload)
        message.success(`You've successfully logged into system.`)
        router.push('/customer')
      },
      onError: (err) => {
        if (err.response) {
          const code = err.response.data?.code
          if (code === 'AUTH_MISMATCHED') {
            message.error('Email and password mis-matched')
          }
        } else {
          message.error(err.message)
        }
      },
    })
  }

  if (user && user.signedIn) {
    router.push('/customer')

    return null
  }

  return (
    <Row
      type='flex'
      align='middle'
      justify='center'
      style={{ height: '100vh' }}
    >
      <Col xs={20} sm={12} md={8} lg={6}>
        <Typography.Title level={2}>Sign In</Typography.Title>
        <Form
          name='login'
          layout='vertical'
          initialValues={{ email: '', password: '' }}
          autoCapitalize='false'
          autoComplete='true'
          autoCorrect='true'
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item label='Email' name='email' rules={validationRules.email}>
            <Input type='email' prefix={<MailOutlined />} />
          </Form.Item>
          <Form.Item
            label='Password'
            name='password'
            rules={validationRules.password}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit' block>
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  )
}

export default IndexPage
