import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { Layout, Menu } from 'antd'
import {
  UserOutlined,
  BankOutlined,
  DollarOutlined,
  ScanOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

import AuthContext from 'context/AuthContext'
import Logo from './Logo'

const Clock = dynamic(() => import('components/Clock'), { ssr: false })

const { Header, Content, Footer, Sider } = Layout

const year = new Date().getFullYear()

export default function AppLayout(props) {
  const [user] = useContext(AuthContext)
  const router = useRouter()

  const selectedKeys = {
    '/customer': '1',
    '/customer/report': '1',
    '/company': '2',
    '/company/report': '2',
    '/sales': '3',
    '/sales/invoice/create': '3',
    '/sales/invoice/update/[invoiceId]': '3',
    '/purchase/invoice/create': '4',
    '/purchase/invoice/update/[invoiceId]': '4',
    '/purchase': '4',
  }

  if (!user?.signedIn && typeof window !== 'undefined') router.push('/logout')

  return (
    <Layout id='components-layout-demo-responsive'>
      <Layout>
        <Header className='site-layout-header'>
          <Logo />
          <Clock />
          <Menu
            className='site-layout-menu'
            theme='light'
            mode='horizontal'
            defaultSelectedKeys={[selectedKeys[router.pathname]]}
          >
            <Menu.Item key='1' icon={<UserOutlined />}>
              <Link href='/customer'>Customer</Link>
            </Menu.Item>
            <Menu.Item key='3' icon={<DollarOutlined />}>
              <Link href='/sales'>Sales</Link>
            </Menu.Item>
            <Menu.Item key='5' icon={<LogoutOutlined />}>
              <Link href='/logout'>Logout</Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ margin: '1.5rem 1.5rem 0' }}>
          <div className='site-layout'>{props.children}</div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          RKChicken ©{year} Created by Atul Software
        </Footer>
      </Layout>
    </Layout>
  )
}

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
}
