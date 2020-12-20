import httpStatusCodes from 'http-status-codes'
import { Types } from 'mongoose'

import CompanyModel from 'models/Company'
import PurchaseInvoiceModel from 'models/PurchaseInvoice'
import purchaseInvoiceError from 'errors/purchaseInvoice'
import { connectToDatabase } from 'utils/connectToDatabase'
import { handleError } from 'utils/handleError'
import { company as companyLookup } from 'aggregation-pipelines/lookups'
import { purchaseInvoice as purchaseInvoiceProjection } from 'aggregation-pipelines/projections'
import { purchaseInvoiceFilter } from 'aggregation-pipelines/matches'

export default async function handler(req, res) {
  await connectToDatabase()

  switch (req.method) {
    case 'GET': {
      try {
        const pipeline = [
          companyLookup,
          purchaseInvoiceFilter(req.query),
          purchaseInvoiceProjection,
        ].filter(Boolean)

        const invoices = await PurchaseInvoiceModel.aggregate(pipeline)

        res.status(httpStatusCodes.OK).send({
          data: invoices,
          message: 'Purchase invoices has been successfully retrieved.',
        })
      } catch (err) {
        handleError(res, err)
      }

      break
    }

    case 'POST': {
      try {
        const companyId = req.body.companyId

        if (!Types.ObjectId.isValid(companyId)) {
          throw purchaseInvoiceError.PURCHASE_INVOICE_NOT_FOUND(companyId)
        }

        const customerExists = await CompanyModel.exists({ _id: companyId })

        if (!customerExists) {
          throw purchaseInvoiceError.CUSTOMER_NOT_FOUND(companyId)
        }

        const purchaseInvoice = await PurchaseInvoiceModel(req.body).save()

        if (typeof req.body.outstandingAmount !== 'undefined') {
          await CompanyModel.findByIdAndUpdate(companyId, {
            $inc: { outstandingAmount: req.body.outstandingAmount },
          })
        }

        res.status(httpStatusCodes.OK).send({
          data: purchaseInvoice,
          message: 'Purchase invoice has been successfully created.',
        })
      } catch (err) {
        handleError(res, err)
      }

      break
    }

    default: {
      res.setHeader('Allow', ['GET', 'POST'])
      res
        .status(httpStatusCodes.METHOD_NOT_ALLOWED)
        .end(`Method ${req.method} Not Allowed`)
    }
  }
}
