import { Request, Response } from 'express'
import { group } from '../models/user.model'
export const createNewMessage = async (req: Request, res: Response): Promise<void> => {
  const { gid } = req.params
  const { uid, message, type } = req.body

  try {
    const response = await group.findById(gid)

    if (response !== null) {
      response?.messages.push({ userID: uid, message, type })
      await group.findByIdAndUpdate(gid, { messages: response.messages })

      res.status(200).json({
        ok: true,
        msg: 'Mensaje enviado con exito'
      })
      return
    }

    res.status(404).json({
      ok: false,
      msg: 'El grupo no existe'
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hubo un error en el servidor'
    })
  }
}
