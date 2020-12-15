import React, { useEffect, useState } from 'react'
import { Row, Col } from 'antd'
import { ClockCircleOutlined, CalendarOutlined } from '@ant-design/icons'

export default function Clock() {
  const [time, setTime] = useState(new Date().toLocaleTimeString())

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
      </Col>
    </Row>
  )
}
