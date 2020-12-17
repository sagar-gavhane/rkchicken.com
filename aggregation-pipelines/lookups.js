export const customer = {
  $lookup: {
    from: 'customers',
    localField: 'customerId',
    foreignField: '_id',
    as: 'customer',
  },
}

export const company = {
  $lookup: {
    from: 'companies',
    localField: 'companyId',
    foreignField: '_id',
    as: 'company',
  },
}
