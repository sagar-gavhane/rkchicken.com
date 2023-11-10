export default function getSMSBalanceTextColor(balance) {
  if (balance > 1000) return 'txt-bold txt-green'
  if (balance > 100) return 'txt-bold txt-yellow'

  return 'txt-bold txt-red'
}
