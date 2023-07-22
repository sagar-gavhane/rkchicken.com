import mongoose from 'mongoose'

let cachedDb = null

export async function connectToDatabase() {
  if (cachedDb) return cachedDb

  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing...')

  mongoose.set('strictQuery', false)

  const db = await mongoose.connect(process.env.MONGODB_URI, {
    autoIndex: true,
  })

  cachedDb = db

  return db
}
