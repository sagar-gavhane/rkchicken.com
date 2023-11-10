export const customer = {
  $lookup: {
    from: 'customers',
    localField: 'customerId',
    foreignField: '_id',
    as: 'customer',
  },
}
