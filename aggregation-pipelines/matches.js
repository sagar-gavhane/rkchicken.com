import size from 'lodash.size'
import isEqual from 'date-fns/isEqual'
import subDays from 'date-fns/subDays'
import set from 'date-fns/set'

import { Types } from 'mongoose'

export const invoiceFilter = (query) => {
  const { customerId, from, to } = query

  if (!size(query)) return null

  return {
    $match: {
      $and: [
        {
          customerId: Types.ObjectId(customerId),
        },
        {
          invoiceDate: isEqual(new Date(to), new Date(from))
            ? {
                $gte: subDays(new Date(to), 1),
                $lt: set(new Date(to), {
                  hours: 24,
                }),
              }
            : {
                $lte: set(new Date(to), {
                  hours: 24,
                }),
                $gte: set(new Date(from), {
                  hours: 0,
                }),
              },
        },
      ],
    },
  }
}
