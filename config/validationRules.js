const validationRules = {
  companyName: [
    {
      min: 3,
      message: 'Company name field must be at least 3 characters in length.',
    },
    { required: true, message: 'Company name field is required.' },
  ],
  customerName: [
    {
      min: 3,
      message: 'Customer name field must be at least 3 characters in length.',
    },
    { required: true, message: 'Customer name field is required.' },
  ],
  email: [
    {
      type: 'email',
      message: 'Please enter valid email address',
    },
    {
      required: true,
      message: 'Please enter your email address!',
    },
  ],
  mobileNumber: [
    {
      type: 'string',
      message: 'Mobile number field must contain only numbers.',
    },
    {
      min: 10,
      message: 'Mobile number field must be at least 10 digits in length.',
    },
    { max: 10, message: 'Mobile number cannot exceed 10 digits in length.' },
    { required: true, message: 'Mobile number field is required.' },
  ],
  alternativeMobileNumber: [
    {
      type: 'string',
      message: 'Alternative mobile number field must contain only numbers.',
    },
    {
      min: 10,
      message:
        'Alternative mobile number field must be at least 10 digits in length.',
    },
    {
      max: 13,
      message: 'Alternative mobile number cannot exceed 13 digits in length.',
    },
  ],
  password: [{ required: true, message: 'Please input your password!' }],
  outstandingAmount: [
    {
      required: true,
      message: 'Outstanding amount field is required.',
    },
  ],
  discountRate: [
    {
      required: true,
      message: 'Discount rate field is required.',
    },
  ],
}

export default validationRules
