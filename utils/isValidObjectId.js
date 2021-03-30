import { Types } from 'mongoose'

export default function isValidObjectId(id) {
  return new Types.ObjectId(id).toString() === id
}
