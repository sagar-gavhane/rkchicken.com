import round from 'lodash.round'
import { Schema, connection, model as _model, models } from 'mongoose'
import { initialize, plugin } from 'mongoose-auto-increment'

const InvoiceSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: [true, 'Customer id field is required.'],
    },
    outstandingAmount: {
      type: Number,
      default: 0,
      set: (value) => round(value, 2),
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
    discountRate: {
      type: Number,
      min: [
        0,
        'Discount rate field must contain a number greater than or equal to 0.',
      ],
      default: 0,
      set: (value) => round(value, 2),
    },
    currentBillAmount: {
      type: Number,
      min: [
        0,
        'Current bill amount field must contain a number greater than or equal to 0.',
      ],
      default: 0,
      set: (value) => round(value, 2),
    },
    outstandingAmount: {
      type: Number,
      default: 0,
      set: (value) => round(value, 2),
    },
    totalAmount: {
      type: Number,
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
    remainingBalance: {
      type: Number,
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

InvoiceSchema.plugin(plugin, {
  model: 'Invoice',
  field: 'invoiceId',
  startAt: 1,
})

export default models.Invoice || _model('Invoice', InvoiceSchema)
