export interface userDb {
  username: string
  email: string
  password: string
}

export interface userTokenRequest {
  uid: string
  email: string
}

export namespace NodeJS {
  export interface ProcessEnv {
    PORT: string
    MONGO_URI: string
    JWT_SEED: string
  }
}

declare module 'jsonwebtoken' {
  export interface userValidatedJWT extends JwtPayload {
    id: string
    email: string
  }
}

declare module 'express' {
  export interface Request {
    uid?: string
    email?: string
  }
}
