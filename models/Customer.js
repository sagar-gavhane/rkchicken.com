import round from 'lodash.round'
import { Schema, connection, model as _model, models } from 'mongoose'
import { initialize, plugin } from 'mongoose-auto-increment'

const CustomerSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: [
        3,
        'Customer name field must be at least 3 characters in length.',
      ],
      maxlength: [
        120,
        'Customer name field cannot exceed 120 characters in length.',
      ],
      required: [true, 'Customer name field is required.'],
    },
    mobileNumber: {
      type: String,
      trim: true,
      validate: [
        (value) => ('' + value).length === 10,
        'Mobile number field must be exactly 10 digits in length.',
      ],
      required: [true, 'Mobile number field is required.'],
    },
    alternativeMobileNumber: {
      type: String,
      trim: true,
      validate: [
        (value) => ('' + value).length === 10,
        'Alternative mobile number field must be exactly 10 digits in length.',
      ],
    },
    discountRate: {
      type: Number,
      default: 0,
      set: (value) => round(value, 2),
      min: [
        0,
        'Discount rate field must contain a number greater than or equal to 0',
      ],
    },
    outstandingAmount: {
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

CustomerSchema.plugin(plugin, {
  model: 'Customer',
  field: 'customerId',
  startAt: 1,
})

export default models.Customer || _model('Customer', CustomerSchema)
