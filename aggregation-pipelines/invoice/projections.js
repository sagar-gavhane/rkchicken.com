export default {
  $project: {
    outstandingAmount: 1,
    birdsNumber: 1,
    weight: 1,
    discountRate: 1,
    currentBillAmount: 1,
    totalAmount: 1,
    paidAmount: 1,
    remainingBalance: 1,
    createdAt: 1,
    updatedAt: 1,
    invoiceId: 1,
    customer: {
      $arrayElemAt: ['$customer', 0],
    },
  },
}
