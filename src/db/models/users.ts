import mongoose from 'mongoose'
import Organizations from './organizations'
import { isValidRole } from '../roles'

export default mongoose.model(
  'Users',
  new mongoose.Schema(
    {
      fName: {
        type: String,
        required: true,
        trim: true,
      },
      lName: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
        match: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      },
      password: {
        type: String,
        required: false,
        default: '',
      },
      role: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        validate: (v: string): boolean => isValidRole(v),
      },
      orgId: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        validate: async (v: string): Promise<boolean> => {
          const org = await Organizations.findById(v)
          return Boolean(org)
        },
      },
      googleSignup: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true }
  )
)
