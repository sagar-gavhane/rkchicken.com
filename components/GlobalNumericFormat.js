import { NumericFormat } from 'react-number-format'

export default function GlobalNumericFormat({ value, ...props }) {
  return (
    <NumericFormat
      value={value}
      thousandSeparator=','
      displayType='text'
      fixedDecimalScale={2}
      prefix='Rs.'
      thousandsGroupStyle='lakh'
      {...props}
    />
  )
}
