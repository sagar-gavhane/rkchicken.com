import size from 'lodash.size'
import { isEqual, subDays, set } from 'date-fns'
import { Types } from 'mongoose'
import isValidObjectId from 'utils/isValidObjectId'

export const invoiceFilter = (query) => {
  const { customerId, from, to } = query

  if (!size(query)) return null
  if (!from && !to) return null

  if (!isValidObjectId(customerId)) {
    return {
      $match: {
        invoiceDate: isEqual(new Date(to), new Date(from))
          ? {
              $lte: set(new Date(to), { hours: 24 }),
              $gte: set(new Date(to), { hours: 0 }),
            }
          : {
              $lte: set(new Date(to), { hours: 24 }),
              $gte: set(new Date(from), { hours: 0 }),
            },
      },
    }
  }

  return {
    $match: {
      $and: [
        isValidObjectId(query.customerId)
          ? {
              customerId: Types.ObjectId(customerId),
            }
          : null,
        {
          invoiceDate: isEqual(new Date(to), new Date(from))
            ? {
                $lte: set(new Date(to), { hours: 24 }),
                $gte: set(new Date(to), { hours: 0 }),
              }
            : {
                $lte: set(new Date(to), { hours: 24 }),
                $gte: set(new Date(from), { hours: 0 }),
              },
        },
      ].filter(Boolean),
    },
  }
}
