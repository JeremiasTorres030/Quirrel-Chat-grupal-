import mongoose from 'mongoose'
import { MONGO_URI } from '../env.config'

export const connectDB = async () => {
  try {
    const db = await mongoose.connect(MONGO_URI())
    console.log('se conecto a la base de datos ' + db.connection.name)
  } catch (error) {
    console.log(error)
  }
}
