import express from 'express'
import { Server } from 'socket.io'
import { createServer } from 'http'
import { connectDB } from './database/db'
import { router as RouterUser } from './routes/users.routes'
import { router as RouterGroup } from './routes/group.routes'
import { router as RouterMessage } from './routes/message.routes'
import { join } from 'path'
import { PORT } from './env.config'
import cors from 'cors'

const app = express()
export const server = createServer(app)

const io = new Server(server, {
  cors: { origin: 'https://chat-production-fd71.up.railway.app/' },
})

let usersConnected: Array<{ userID: string; socketID: string }> = []

io.on('connection', (client) => {
  client.on('userID', (userID) => {
    if (usersConnected.find((user) => user.userID === userID) === undefined) {
      usersConnected.push({ userID, socketID: client.id })
    }
  })

  client.on('chat message', (uid: Array<string>) => {
    uid.forEach((uid) => {
      const user = usersConnected.find((user) => user.userID === uid)
      if (user !== undefined) {
        io.to(user.socketID).emit('chat message')
      }
    })
  })

  client.on('invitation', (data) => {
    const user = usersConnected.find((user) => user.userID === data.userInvited)
    if (user !== undefined) {
      io.to(user.socketID).emit('invitationClient', data)
    }
  })

  client.on('updateGroup', (uid: Array<string>) => {
    uid.forEach((uid) => {
      const user = usersConnected.find((user) => user.userID === uid)
      if (user !== undefined) {
        io.to(user.socketID).emit('updateGroup')
      }
    })
  })

  client.on('editGroup', (uid: Array<string>) => {
    uid.forEach((uid) => {
      const user = usersConnected.find((user) => user.userID === uid)
      if (user !== undefined) {
        io.to(user.socketID).emit('editGroup')
      }
    })
  })

  client.on('deleteGroup', (uid: Array<string>) => {
    uid.forEach((uid) => {
      const user = usersConnected.find((user) => user.userID === uid)
      if (user !== undefined) {
        io.to(user.socketID).emit('deleteGroup')
      }
    })
  })

  client.on('disconnect', () => {
    usersConnected = usersConnected.filter(
      (user) => user.socketID !== client.id
    )
  })
})

void connectDB()
app.use(cors())
app.use(express.json())

app.use(RouterUser)
app.use(RouterGroup)
app.use(RouterMessage)
app.use(express.static(join(__dirname, '../../client/build')))

app.get('*', (_req, res) => {
  res.sendFile(join(__dirname, '../../client/build/index.html'))
})

server.listen(PORT(), () => {
  console.log('El servidor esta corriendo en el puerto 3000')
})
