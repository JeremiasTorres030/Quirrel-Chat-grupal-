/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { createNewMessage } from '../controllers/message.controllers'

export const router = Router()

router.post('/api/message/new/:gid', createNewMessage)
