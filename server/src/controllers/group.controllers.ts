import { Request, Response } from 'express'
import { group, user } from '../models/user.model'
export const getAllGroups = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const response = await group.find()

    if (response !== null) {
      res.status(200).json({
        ok: true,
        data: response,
      })
      return
    }

    res.status(404).json({
      ok: false,
      msg: 'No se encontro ningun grupo',
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hubo un error en el servidor',
    })
  }
}

export const getUnicGroup = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params

  try {
    const response = await group.findById(id)

    if (response !== null) {
      const membersData = await Promise.all(
        response.members.map(async (users) => {
          const userData = await user.findById(users.uid)

          return {
            username: userData?.username,
            uid: userData?.id,
            image: userData?.image,
            rol: users.rol,
          }
        })
      )

      res.status(200).json({
        ok: true,
        groupData: response,
        membersData,
      })
      return
    }

    res.status(404).json({
      ok: false,
      msg: 'No se econtro ningun grupo',
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hubo un error en el servidor',
    })
  }
}

export const createGroup = async (
  req: Request,
  res: Response
): Promise<void> => {
  let { groupname, image } = req.body

  if (image === '') {
    image =
      'https://res.cloudinary.com/drifqbdtu/image/upload/v1663803197/Chat/groupImages/GroupImageDefault_bkwkek.jpg'
  }

  try {
    const response = await group.create({ groupname, image })

    res.status(200).json({
      ok: true,
      data: response,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hubo un error en el servidor',
    })
  }
}

export const deleteGroup = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { gid } = req.params

  try {
    const deleteGroup = await group.findByIdAndDelete(gid)

    if (deleteGroup !== null) {
      deleteGroup.members.forEach(async ({ uid }) => {
        const findUsers = await user.findById(uid)
        if (findUsers !== null) {
          findUsers.groups = findUsers?.groups.filter((group) => group !== gid)
          await user.findByIdAndUpdate(findUsers.id, {
            groups: findUsers.groups,
          })
        }
        return
      })
    }

    res.status(200).json({
      ok: true,
      msg: 'Grupo eliminado',
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hubo un error en el servidor',
    })
  }
}

export const addMemberGroup = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { uid, gid } = req.body
  try {
    const findGroup = await group.findById(gid)
    const findUser = await user.findById(uid)
    if (findGroup !== null && findUser !== null) {
      if (findGroup.members.length === 0) {
        findGroup.members.push({ uid, rol: 'admin' })
      } else {
        findGroup.members.push({ uid, rol: 'member' })
      }

      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      findGroup.messages.push({
        uid: findUser?.id,
        message: `${findUser?.username} se ha unido al grupo`,
        type: 'member',
      })
      findUser.groups.push(gid)
      findUser.invitations = findUser.invitations.filter(
        (inv) => inv.groupID !== gid
      )
      await group.findByIdAndUpdate(
        gid,
        { members: findGroup?.members, messages: findGroup?.messages },
        { new: true }
      )
      await user.findByIdAndUpdate(
        uid,
        { groups: findUser?.groups, invitations: findUser?.invitations },
        { new: true }
      )
      res.status(200).json({
        ok: true,
        msg: 'Usuario agregado con exito',
        data: { gid },
      })

      return
    }
    res.status(404).json({
      ok: false,
      msg: 'El grupo no se econtro',
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hubo un error en el servidor',
    })
  }
}

export const allUserGroup = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params

  try {
    const response = await user.findById(id)

    if (response !== null) {
      const groupData = await Promise.all(
        response?.groups?.map(async (groupID) => {
          return await group.findById(groupID)
        })
      )

      if (groupData.length !== 0) {
        res.status(200).json({
          ok: true,
          groupData,
        })

        return
      }

      res.status(200).json({
        ok: true,
        data: [],
      })

      return
    }

    res.status(404).json({
      ok: false,
      msg: 'El usuario proveido no existe',
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hubo un error en el servidor',
    })
  }
}

export const getMessagesGroup = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params

  try {
    const response = await group.findById(id)

    if (response !== null) {
      res.status(200).json({
        ok: true,
        messages: response.messages,
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hubo un error en el servidor',
    })
  }
}

export const inviteMemberGroup = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { gid, uid, inviteid } = req.body

  try {
    const response = await user.findById(inviteid)
    const userHost = await user.findById(uid)
    const groupInvitation = await group.findById(gid)

    if (response !== null && userHost !== null && groupInvitation !== null) {
      if (
        groupInvitation.members.find((user) => {
          return user.uid === inviteid
        }) !== undefined
      ) {
        res.status(400).json({
          ok: false,
          msg: 'El usuario ya esta en el grupo',
        })
        return
      }

      response.invitations.push({
        groupID: gid,
        username: userHost?.username,
        groupName: groupInvitation?.groupname,
      })

      await user.findByIdAndUpdate(
        inviteid,
        { invitations: response?.invitations },
        { new: true }
      )

      res.status(200).json({
        ok: true,
        msg: 'Invitacion enviada',
        data: {
          gid,
          user: userHost?.username,
          groupname: groupInvitation?.groupname,
          userInvited: inviteid,
        },
      })

      return
    }

    res.status(404).json({
      ok: false,
      msg: 'Parece que algunos de los elementos no existen',
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      ok: false,
      msg: 'Hubo un error en el servidor',
    })
  }
}

export const deleteInvitationGroup = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { uid, gid } = req.params

  try {
    const response = await user.findById(uid)

    if (response !== null) {
      response.invitations = response.invitations.filter(
        (inv) => inv.groupID !== gid
      )

      await user.findByIdAndUpdate(uid, { invitations: response.invitations })

      res.status(200).json({
        ok: true,
        msg: 'Invitacion rechazada con exito',
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hubo un error en el servidor',
    })
  }
}

export const exitGroup = async (req: Request, res: Response): Promise<void> => {
  const { uid, gid } = req.params

  try {
    const findUser = await user.findById(uid)
    const findGroup = await group.findById(gid)

    if (findUser !== null && findGroup !== null) {
      findUser.groups = findUser?.groups.filter((groups) => groups !== gid)
      findGroup.members = findGroup?.members.filter(
        (members) => members.uid !== uid
      )

      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      findGroup.messages.push({
        message: `${findUser.username} ha salido del grupo`,
        type: 'member',
        uid: findUser.id,
      })

      await user.findByIdAndUpdate(uid, { groups: findUser?.groups })
      await group.findByIdAndUpdate(gid, {
        members: findGroup?.members,
        messages: findGroup.messages,
      })

      res.status(200).json({
        ok: true,
        msg: 'El usuario salio con exito',
      })

      return
    }

    res.status(404).json({
      ok: false,
      msg: 'El usuario o el grupo es inexistente',
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hubo un error en el servidor',
    })
  }
}

export const editGroup = async (req: Request, res: Response): Promise<void> => {
  const { gid } = req.params
  const body = req.body

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
    const response = await group.findByIdAndUpdate(gid, data, { new: true })

    res.status(200).json({
      ok: true,
      data: {
        image: response?.image,
        groupname: response?.groupname,
      },
      msg: 'Editado con exito',
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hubo un error en el servidor',
    })
  }
}
