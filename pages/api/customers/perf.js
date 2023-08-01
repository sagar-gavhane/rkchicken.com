import httpStatusCodes from 'http-status-codes'

export default async function handler(req, res) {
  res.status(httpStatusCodes.OK).send({
    status: 'Ok',
  })
}
