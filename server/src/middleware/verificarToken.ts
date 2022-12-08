import { SECRET_JWT_SEED } from '../env.config'
import { userValidatedJWT, verify } from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'

export const verficarToken = (req: Request, res: Response, next: NextFunction): void => {
  const token: string | undefined = req.header('x-token')

  if (token === undefined || token === '') {
    res.status(400).json({
      ok: false,
      msg: 'El token no ha sido proveido'
    })
    return
  }
  try {
    const userValidated = verify(token, SECRET_JWT_SEED()) as userValidatedJWT

    req.uid = userValidated.id
    req.email = userValidated.email
  } catch (error) {
    console.log(error)
    res.status(400).json({
      ok: false,
      msg: error
    })
  }

  next()
}

declare module 'express' {
  export interface Request {
    uid?: string
    email?: string
  }
}

declare module 'jsonwebtoken' {
  export interface userValidatedJWT extends JwtPayload {
    id: string
    email: string
  }
}
