import dotenv from 'dotenv'

dotenv.config()

export const SECRET_JWT_SEED = (): string => {
  if (process.env.SECRET_JWT_SEED !== undefined) {
    return process.env.SECRET_JWT_SEED
  }
  return ''
}

export const MONGO_URI = (): string => {
  if (process.env.MONGO_URI !== undefined) {
    return process.env.MONGO_URI
  }
  return ''
}
