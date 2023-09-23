import round from 'lodash.round'
import { Schema, connection, model as _model, models } from 'mongoose'
import { initialize, plugin } from 'mongoose-auto-increment'

const PurchaseInvoiceSchema = new Schema(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company id field is required.'],
    },
    birdsNumber: {
      type: Number,
      default: 0,
    },
    weight: {
      type: Number,
      min: [
        0,
        'Weight field must contain a number greater than or equal to 0.',
      ],
      default: 0,
    },
    currentBillAmount: {
      type: Number,
      // min: [
      //   0,
      //   'Current bill amount field must contain a number greater than or equal to 0.',
      // ],
      default: 0,
      set: (value) => round(value, 2),
    },
    paidAmount: {
      type: Number,
      min: [
        0,
        'Paid amount field must contain a number greater than or equal to 0.',
      ],
      default: 0,
      set: (value) => round(value, 2),
    },
    invoiceDate: {
      type: Date,
      default: Date.now(),
    },
    chickenRate: {
      type: Number,
      min: 0,
      default: 0,
      set: (value) => round(value, 2),
    },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

initialize(connection)

PurchaseInvoiceSchema.plugin(plugin, {
  model: 'PurchaseInvoice',
  field: 'invoiceId',
  startAt: 1,
})

export default models.PurchaseInvoice ||
  _model('PurchaseInvoice', PurchaseInvoiceSchema)
