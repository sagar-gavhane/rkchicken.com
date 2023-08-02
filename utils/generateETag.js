import crypto from 'crypto'

export default function generateETag() {
  const date = new Date().toISOString()
  const hash = crypto.createHash('md5').update(date).digest('hex')

  return hash
}
