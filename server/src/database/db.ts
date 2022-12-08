import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    const db = await mongoose.connect('mongodb://127.0.0.1:27017/chat')
    console.log('se conecto a la base de datos ' + db.connection.name)
  } catch (error) {
    console.log(error)
  }
}
