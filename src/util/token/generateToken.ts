import jwt from 'jsonwebtoken'
import config from '../../config'

export interface AccessTokenPayload {
  fName: string
  lName: string
  email: string
  userId: string
  orgId: string
  role: string
  permissions: string[]
}

export interface RefreshTokenPayload {
  userId: string
}

interface GenerateTokenParams {
  tokenPayload: AccessTokenPayload | RefreshTokenPayload
  expirationDays?: number
  expirationSecs?: number
}

export default ({ tokenPayload, expirationDays, expirationSecs }: GenerateTokenParams): string => {
  const fifteenMinutesInSeconds = 60 * 15
  const secondsInDay = 60 * 60 * 24

  let expiresIn = fifteenMinutesInSeconds
  if (expirationDays) expiresIn = expirationDays * secondsInDay
  if (expirationSecs) expiresIn = expirationSecs

  return jwt.sign(tokenPayload, config.tokenSecret, { expiresIn })
}
