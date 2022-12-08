import { sign } from 'jsonwebtoken'
import { SECRET_JWT_SEED } from '../env.config'

export const jwtGenerator = async (email: string, id: string): Promise<undefined|string> => {
  return await new Promise((resolve, reject) => {
    sign({ email, id }, SECRET_JWT_SEED(), { expiresIn: '24h' }, (err, token) => {
      if (err !== null) {
        console.log(err)
        reject(err)
      }
      resolve(token)
    })
  })
}
