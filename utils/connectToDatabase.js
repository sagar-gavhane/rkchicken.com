import mongoose from 'mongoose'

let cachedDb = null

export async function connectToDatabase(uri) {
  if (cachedDb) return cachedDb

  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing...')

  const db = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    autoIndex: true,
  })

  cachedDb = db

  return db
}
