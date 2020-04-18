import roles from '../db/roles'
import Users from '../db/models/users'
import _isEmpty from 'lodash/isEmpty'
import { ValidatorResponse, ValidatorParams } from '../util/buildTableController'
import validatePassword from '../util/password/validatePassword'
import authenticatePassword from '../util/password/authenticatePassword'
import generateAccessTokenPayload, { defaultAccessToken } from '../util/token/generateAccessTokenPayload'
import generateRefreshTokenPayload from '../util/token/generateRefreshTokenPayload'
import generateToken from '../util/token/generateToken'
import { Request } from '../types'

interface AuthenticateUserParams {
  email: string
  password: string
}

interface AuthenticateUserResponse {
  accessToken: string
  refreshToken: string
  data: any
}

interface LongLivedToken {
  token: string
}

const getAccessLevel = (user: any): number => {
  const roleInfo = roles.find(role => role.name === user.role)
  if (roleInfo === undefined) return -1
  return roleInfo.accessLevel
}

// Validator Responses
const successResponse = (): ValidatorResponse => ({ isValid: true, message: '', status: 200 })
const invalidFieldResponse = (message: string): ValidatorResponse => ({ isValid: false, message, status: 422 })
const accessDeniedResponse = (message = 'Access denied'): ValidatorResponse => ({
  isValid: false,
  message,
  status: 403,
})

export const createUsersValidator = async ({ body, user: { userId } }: ValidatorParams): Promise<ValidatorResponse> => {
  const isSelfSignup = _isEmpty(userId)
  const userToCreateAccessLevel = getAccessLevel(body)
  if (userToCreateAccessLevel === -1) return invalidFieldResponse('Invalid Role')

  // Validate access level
  let userAccessLevel = 1
  if (!isSelfSignup) {
    const dbUser = await Users.findById(userId)
    if (!dbUser) return accessDeniedResponse('Requesting user unknown')
    userAccessLevel = getAccessLevel(dbUser)
    if (userAccessLevel === -1) return invalidFieldResponse('Invalid Role')
  }
  if (userToCreateAccessLevel > userAccessLevel) return accessDeniedResponse()

  // Validate password
  return validatePassword(body?.password || '') ? successResponse() : invalidFieldResponse('Invalid password')
}

export const modifyUsersValidator = async ({
  body,
  user: { userId },
  id: userToModifyId,
  method,
}: ValidatorParams): Promise<ValidatorResponse> => {
  // Validate access level
  const dbUser = await Users.findById(userId)
  const dbUserToModify = await Users.findById(userToModifyId)
  if (!dbUserToModify) return { isValid: false, message: 'Resource not found', status: 404 }
  if (!dbUser) return accessDeniedResponse('Requesting user unknown')
  const userAccessLevel = getAccessLevel(dbUser)
  const userToModifyAccessLevel = getAccessLevel(dbUserToModify)
  if (userAccessLevel === -1 || userToModifyAccessLevel === -1) return invalidFieldResponse('Invalid Role')
  const dbUserId = dbUser._id.toString()
  const dbUserToModifyId = dbUserToModify._id.toString()
  const isModifyingOwnSelf = method === 'PUT' && dbUserId === dbUserToModifyId
  if (!isModifyingOwnSelf && userToModifyAccessLevel >= userAccessLevel) {
    return accessDeniedResponse()
  }

  // Validate password
  const { password } = body
  return password === undefined || validatePassword(password) ? successResponse() : accessDeniedResponse()
}

export const authenticateUser = async ({
  email,
  password,
}: AuthenticateUserParams): Promise<AuthenticateUserResponse> => {
  const { isValid, userId } = await authenticatePassword({ email, password })
  if (!isValid) throw new Error('Authentication failed')
  const refreshTokenPayload = await generateRefreshTokenPayload(userId)
  const accessTokenPayload = await generateAccessTokenPayload(userId)
  const refreshToken = generateToken({ tokenPayload: refreshTokenPayload, expirationDays: 30 })
  const accessToken = generateToken({ tokenPayload: accessTokenPayload })
  return { refreshToken, accessToken, data: accessTokenPayload }
}

export const generateLongLivedToken = async ({ user }: Request): Promise<LongLivedToken> => ({
  token: generateToken({
    tokenPayload: user || defaultAccessToken,
    expirationDays: 365,
  }),
})
