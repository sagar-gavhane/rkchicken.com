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
import getSMSBalanceTextColor from 'utils/getSMSBalanceTextColor'

const timeStringOption = {
  hour12: true,
  hour: '2-digit',
  minute: '2-digit',
}

export default function Clock() {
  const [time, setTime] = useState(
    new Date().toLocaleTimeString('en-IN', timeStringOption)
  )

  const { data: smsBalance, isSuccess } = useQuery(['/sms-balance'], () =>
    smsService.getBalance()
  )

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-IN', timeStringOption))
    }, 1000 * 60)

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
            |{' '}
            <span className={getSMSBalanceTextColor(smsBalance)}>
              <MessageOutlined /> SMS Balance: {smsBalance}
            </span>
          </>
        )}
      </Col>
    </Row>
  )
}
