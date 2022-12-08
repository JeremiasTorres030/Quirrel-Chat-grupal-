import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  }
})

const groupSchema = new mongoose.Schema({
  groupname: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  image: {
    type: String,
    required: true
  },
  messages: [messageSchema],

  members: { type: Array }
})

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  groups: { type: Array },
  invitations: { type: Array }
})

export const user = mongoose.model('user', userSchema)
export const group = mongoose.model('group', groupSchema)
