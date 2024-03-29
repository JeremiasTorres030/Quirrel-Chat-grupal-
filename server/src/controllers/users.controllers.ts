import { Request, Response } from 'express'
import { user } from '../models/user.model'
import { genSaltSync, hashSync, compareSync } from 'bcryptjs'
import { jwtGenerator } from '../helpers/jwtGenerator'
export const getAllUsers = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const response = await user.find()

    if (response !== null) {
      const userData = response.map((user) => {
        return { uid: user.id, username: user.username, image: user.image }
      })

      res.status(200).json({
        ok: true,
        data: userData,
      })

      return
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({
      ok: false,
    })
  }
}

export const getUserInvitations = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params
  try {
    const response = await user.findById(id)
    if (response !== null) {
      res.status(200).json({
        ok: true,
        data: response?.invitations,
      })
      return
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({
      ok: false,
    })
  }
}

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  let { email, username, password, image } = req.body

  if (image === '') {
    image =
      'https://res.cloudinary.com/drifqbdtu/image/upload/v1663803554/Chat/profileImages/userDefaultImage_ci19ss.jpg'
  }

  const checkEmail = await user.findOne({ email })
  const checkUsername = await user.findOne({ username })

  if (checkEmail !== null) {
    res.status(400).json({
      ok: false,
      msg: 'El correo ya esta en uso',
    })
    return
  }

  if (checkUsername !== null) {
    res.status(400).json({
      ok: false,
      msg: 'El nombre de usuario ya esta en uso',
    })
    return
  }

  try {
    const salt: string = genSaltSync(10)
    password = hashSync(password, salt)
    const response = await user.create({ email, username, password, image })
    const token = await jwtGenerator(email, response.id)

    if (response !== null && token !== undefined) {
      res.status(200).json({
        ok: true,
        msg: 'Creado con exito',
        data: {
          id: response?.id,
          email,
          username,
          image,
          groups: response?.groups,
          token,
        },
      })
      return
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Error en el servidor',
    })
  }
}

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params
  try {
    const response = await user.findByIdAndDelete(id)
    if (response !== null) {
      res.status(200).json({
        ok: true,
        msg: 'El usuario se elimino con exito',
      })
      return
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({
      ok: false,
    })
  }
}

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body

  try {
    const emailValidation = await user.findOne({ email })
    if (emailValidation === null) {
      res.status(404).json({
        ok: false,
        msg: 'El correo no existe',
      })
      return
    }
    if (emailValidation?.password !== undefined) {
      const passwordValidation: boolean = compareSync(
        password,
        emailValidation?.password
      )

      if (!passwordValidation) {
        res.status(404).json({
          ok: false,
          msg: 'La contraseña es incorrecta',
        })
        return
      }
    }

    const token = await jwtGenerator(email, emailValidation?.id)

    res.status(200).json({
      ok: true,
      data: {
        uid: emailValidation?.id,
        token,
        email,
        image: emailValidation?.image,
        username: emailValidation?.username,
        groups: emailValidation?.groups,
      },
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Error en el servidor',
    })
  }
}

export const renovarToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { uid, email } = req

  if (uid !== undefined && email !== undefined) {
    const token: string | undefined = await jwtGenerator(email, uid)

    const userDB = await user.findById(uid)

    if (userDB !== null) {
      res.json({
        ok: true,
        data: {
          uid: userDB?.id,
          email,
          image: userDB?.image,
          username: userDB?.username,
          groups: userDB?.groups,
          invitations: userDB?.invitations,
          token,
        },
      })
    }
  }
}
export const editUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params
  const body = req.body

  if (body.username !== undefined) {
    const usernameFind = await user.findOne({ username: body.username })

    if (usernameFind !== null) {
      res.status(400).json({
        ok: false,
        msg: 'El nombre de usuario ya esta en uso',
      })
      return
    }
  }

  const data: any = {}

  const keys = Object.keys(body)
  const values = Object.values(body)

  keys.forEach((key, index) => {
    if (values[index] === '') {
      return
    }
    data[key] = values[index]
  })

  try {
    const response = await user.findByIdAndUpdate(id, data, { new: true })

    if (response !== null) {
      res.status(200).json({
        ok: true,
        data: {
          image: response?.image,
          username: response?.username,
        },
        msg: 'Editado con exito',
      })
      return
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hubo un error en el servidor',
    })
  }
}

declare module 'express' {
  export interface Request {
    uid?: string
    email?: string
  }
}
