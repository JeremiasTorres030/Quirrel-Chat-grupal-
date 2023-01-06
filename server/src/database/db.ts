import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    const db = await mongoose.connect(
      'mongodb+srv://Jeremias:d0K8cdKddJWmF5Ya@cluster0.bhekfst.mongodb.net/?retryWrites=true&w=majority'
    )
    console.log('se conecto a la base de datos ' + db.connection.name)
  } catch (error) {
    console.log(error)
  }
}
