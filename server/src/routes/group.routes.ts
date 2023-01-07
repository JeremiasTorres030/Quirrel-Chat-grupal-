/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { check } from 'express-validator'
import {
  addMemberGroup,
  createGroup,
  deleteGroup,
  getAllGroups,
  getUnicGroup,
  allUserGroup,
  inviteMemberGroup,
  getMessagesGroup,
  deleteInvitationGroup,
  exitGroup,
  editGroup,
} from '../controllers/group.controllers'
import { validarCampos } from '../middleware/validarCampos'

export const router = Router()

router.get('/api/group/all', getAllGroups)
router.get('/api/group/:id', getUnicGroup)

router.post(
  '/api/group/new',
  check('groupname', 'El nombre del grupo es obligatorio').isString(),
  validarCampos,
  createGroup
)

router.delete('/api/group/delete/:gid', deleteGroup)
router.put('/api/group/edit/:id')

router.post('/api/group/member/add', addMemberGroup)

router.post('/api/group/member/invite', inviteMemberGroup)

router.delete(
  '/api/group/member/invite/denied/:uid/:gid',
  deleteInvitationGroup
)
router.delete('/api/group/member/exit/:uid/:gid', exitGroup)

router.get('/api/group/usergroup/:id', allUserGroup)
router.get('/api/group/messages/:id', getMessagesGroup)

router.put('/api/group/edit/:gid', editGroup)
