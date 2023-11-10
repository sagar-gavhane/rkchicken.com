import React, { useEffect, useState } from 'react'
import { Row, Col } from 'antd'
import {
  ClockCircleOutlined,
  CalendarOutlined,
  MessageOutlined,
} from '@ant-design/icons'
import { useQuery } from 'react-query'
import isNumber from 'lodash.isnumber'

import smsService from 'services/sms'

export default function Clock() {
  const [time, setTime] = useState(new Date().toLocaleTimeString())

  const { data: smsBalance, isSuccess } = useQuery(['/sms-balance'], () =>
    smsService.getBalance()
  )

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <Row>
      <Col span={24}>
        <CalendarOutlined /> Date: {new Date().toLocaleDateString('en-GB')} |{' '}
        <ClockCircleOutlined /> Time: {time}
        {isSuccess && isNumber(+smsBalance) && (
          <>
            {' '}
            | <MessageOutlined /> SMS Balance: {smsBalance}
          </>
        )}
      </Col>
    </Row>
  )
}
