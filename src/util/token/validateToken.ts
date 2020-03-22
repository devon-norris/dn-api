import jwt from 'jsonwebtoken'
import config from '../../config'
import generateToken from './generateToken'
import getAccessTokenPayload, { extractAccessTokenFromRequest, getAccessTokenExpiration } from './getAccessTokenPayload'
import generateAccessTokenPayload, { defaultAccessToken } from './generateAccessTokenPayload'
import getRefreshTokenPayload, { extractRefreshTokenFromRequest } from './getRefreshTokenPayload'
import { AccessTokenPayload } from './generateToken'
import { Request } from '../../types'

interface ValidateToken {
  isValid: boolean
  accessToken: string
  refreshToken: string
  user: AccessTokenPayload
}

const verifyToken = (token: string): boolean => {
  try {
    jwt.verify(token, config.tokenSecret)
    return true
  } catch (err) {
    return false
  }
}

export default async (req: Request): Promise<ValidateToken> => {
  const refreshToken = extractRefreshTokenFromRequest(req)
  const accessToken = extractAccessTokenFromRequest(req)
  try {
    if (verifyToken(accessToken)) {
      const { userId } = getAccessTokenPayload({ token: accessToken })
      const newAccessTokenPayload = await generateAccessTokenPayload(userId)
      const accessTokenExpiration = getAccessTokenExpiration({ token: accessToken })
      const originalExpirationSecs = Number((accessTokenExpiration - Date.now() / 1000).toFixed(0))
      const newAccessToken = generateToken({
        tokenPayload: newAccessTokenPayload,
        expirationSecs: originalExpirationSecs,
      })
      return { isValid: true, accessToken: newAccessToken, refreshToken, user: newAccessTokenPayload }
    }
    if (verifyToken(refreshToken)) {
      const { userId } = getRefreshTokenPayload({ token: refreshToken })
      const newAccessTokenPayload = await generateAccessTokenPayload(userId)
      return {
        isValid: true,
        accessToken: generateToken({ tokenPayload: newAccessTokenPayload }),
        refreshToken,
        user: newAccessTokenPayload,
      }
    }
    throw new Error('Refresh/Access token is invalid')
  } catch (err) {
    return {
      isValid: false,
      accessToken: '',
      refreshToken: '',
      user: defaultAccessToken,
    }
  }
}
