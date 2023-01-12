/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { check } from 'express-validator'

import {
  createUser,
  deleteUser,
  editUser,
  getAllUsers,
  getUserInvitations,
  loginUser,
  renovarToken,
} from '../controllers/users.controllers'
import { validarCampos } from '../middleware/validarCampos'
import { verficarToken } from '../middleware/verificarToken'

export const router = Router()

// users routes
router.get('/api/user/all', getAllUsers)
router.get('/api/user/:id', getUserInvitations)
router.post(
  '/api/user/new',
  [
    check('username', 'El nombre de usuario es obligatorio').isString(),
    check('password', 'La contraseña es obligatoria').isString(),
    check('email', 'El email es obligatorio').isString().isEmail(),
    validarCampos,
  ],
  createUser
)
router.post(
  '/api/user/login',
  [
    check('email', 'El email es obligatorio').isString().isEmail(),
    check('password', 'La contraseña es obligatoria')
      .isString()
      .isLength({ min: 6 }),
    validarCampos,
  ],
  loginUser
)
router.put('/api/user/edit/:id', editUser)
router.delete('/api/user/delete/:id', deleteUser)
router.get('/api/user/token/validate', verficarToken, renovarToken)
