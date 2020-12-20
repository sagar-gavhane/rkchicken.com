import round from 'lodash.round'
import { Schema, connection, model as _model, models } from 'mongoose'
import { initialize, plugin } from 'mongoose-auto-increment'

const CompanySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: [
        3,
        'Company name field must be at least 3 characters in length.',
      ],
      maxlength: [
        120,
        'Company name field cannot exceed 120 characters in length.',
      ],
      required: [true, 'Company name field is required.'],
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
    address: {
      type: String,
      required: false,
    },
    outstandingAmount: {
      type: Number,
      default: 0,
      set: (value) => round(value, 2),
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

initialize(connection)

CompanySchema.plugin(plugin, {
  model: 'Company',
  field: 'companyId',
  startAt: 1,
})

export default models.Company || _model('Company', CompanySchema)
