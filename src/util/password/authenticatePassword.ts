import bcrypt from 'bcrypt'
import Users from '../../db/models/users'
import _get from 'lodash/get'

interface AuthenticatePasswordParams {
  email: string
  password: string
}

interface AuthenticatePasswordResponse {
  isValid: boolean
  userId: string
}

export default async ({ email, password }: AuthenticatePasswordParams): Promise<AuthenticatePasswordResponse> => {
  try {
    const dbUser = await Users.findOne({ email })
    if (!dbUser) return { isValid: false, userId: '' }

    const isValid = await bcrypt.compare(password, _get(dbUser, 'password'))
    return { isValid, userId: _get(dbUser, '_id', '').toString() }
  } catch (err) {
    console.error('Bcrypt error:', err)
    return { isValid: false, userId: '' }
  }
}
