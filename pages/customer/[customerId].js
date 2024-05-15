import { Avatar, Tabs, Typography } from 'antd'
import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import qs from 'query-string'
import { PatternFormat, NumericFormat } from 'react-number-format'

import AppLayout from 'components/AppLayout'
import GlobalNumericFormat from 'components/GlobalNumericFormat'
import customerService from 'services/customers'
import salesService from 'services/sales'
import { avatarColorCode } from 'utils/avatarColorCode'

export default function CustomerDetailPage() {
  const router = useRouter()
  const customerId = router.query.customerId

  const { data: customer, isSuccess } = useQuery(
    ['/customer/[customerId]', { customerId }],
    () => customerService.get(customerId)
  )
  const params = qs.stringify({
    customerId,
    limit: Number.MAX_SAFE_INTEGER,
    offset: 0,
  })

  const { data: salesInvoices } = useQuery({
    queryKey: ['/sales/invoice', { params }],
    queryFn: () => salesService.invoice.list(params),
  })

  if (!customer || !isSuccess) {
    return null
  }

  const avatarInitial = customer.name.charAt(0).toUpperCase()
  const avatarColor = avatarColorCode[avatarInitial]
  const avatarStyle = { backgroundColor: avatarColor, fontSize: '32px' }

  return (
    <AppLayout>
      <div className='customer-detail-header'>
        <Avatar size={64} style={avatarStyle}>
          {avatarInitial}
        </Avatar>
        <div className='customer-bio'>
          <span>Customer Name: {customer.name}</span>
          <span>
            Discount Rate: <GlobalNumericFormat value={customer.discountRate} />
          </span>
          <span>
            Mobile Number: {''}
            <Typography.Link href={`tel:${customer.mobileNumber}`}>
              <PatternFormat
                value={customer.mobileNumber}
                format='+91 ##### #####'
                displayType='text'
              />
            </Typography.Link>
          </span>
          <span>
            Outstanding Amount:{' '}
            <GlobalNumericFormat value={customer.outstandingAmount} />
          </span>
        </div>
      </div>
      <Tabs>
        <Tabs.TabPane tab='Sales Invoices'>
          <pre>{JSON.stringify(salesInvoices, null, 2)}</pre>
        </Tabs.TabPane>
      </Tabs>
    </AppLayout>
  )
}
