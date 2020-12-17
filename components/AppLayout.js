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

import Clock from 'components/Clock'
import AuthContext from 'context/AuthContext'

const { Header, Content, Footer, Sider } = Layout

export default function AppLayout(props) {
  const [user] = useContext(AuthContext)
  const router = useRouter()

  const selectedKeys = {
    '/customer': '1',
    '/customer-report': '1',
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
      <Sider breakpoint='md' collapsedWidth='0'>
        <Link href='/customer'>
          <a className='logo'>RKChicken</a>
        </Link>
        <Menu
          theme='dark'
          mode='inline'
          defaultSelectedKeys={[selectedKeys[router.pathname]]}
        >
          <Menu.Item key='1' icon={<UserOutlined />}>
            <Link href='/customer'>
              <a>Customer</a>
            </Link>
          </Menu.Item>
          <Menu.Item key='2' icon={<BankOutlined />}>
            <Link href='/company'>
              <a>Company</a>
            </Link>
          </Menu.Item>
          <Menu.Item key='3' icon={<DollarOutlined />}>
            <Link href='/sales'>
              <a>Sales</a>
            </Link>
          </Menu.Item>
          <Menu.Item key='4' icon={<ScanOutlined />}>
            <Link href='/purchase'>
              <a>Purchase</a>
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header className='site-layout-header'>
          <Clock />
          <Link href='/logout'>
            <a className='logout-outlined-wrapper'>
              <LogoutOutlined style={{ color: 'ButtonText' }} />
            </a>
          </Link>
        </Header>
        <Content style={{ margin: '1.5rem 1.5rem 0' }}>
          <div className='site-layout'>{props.children}</div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          RKChicken ©2020 Created by Atul Software
        </Footer>
      </Layout>
    </Layout>
  )
}

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
}
