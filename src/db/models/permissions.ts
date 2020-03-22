import mongoose from 'mongoose'
import { isValidRole } from '../roles'

export interface Permission {
  name: string
  roles: string[]
}

export default mongoose.model(
  'Permissions',
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    roles: {
      type: Array,
      required: true,
      validate: (roles: string[]): boolean => roles.every((role: string) => isValidRole(role)),
    },
  })
)
