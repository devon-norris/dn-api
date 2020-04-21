import mongoose from 'mongoose'
import config from '../config'
const { db } = config

export default async (): Promise<void> => {
  await mongoose.connect(db.url, db.config)
}
