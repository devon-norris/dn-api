import jwt from 'jsonwebtoken'
import _get from 'lodash/get'
import { RefreshTokenPayload } from './generateToken'
import { REFRESH_TOKEN } from '../cookieConfig'
import { Request } from '../../types'

interface GetRefreshTokenParams {
  token?: string
  req?: Request
}

export const extractRefreshTokenFromRequest = ({ signedCookies }: Request): string =>
  _get(signedCookies, REFRESH_TOKEN, '')

export default ({ token = '', req }: GetRefreshTokenParams): RefreshTokenPayload => {
  const refreshToken = req ? extractRefreshTokenFromRequest(req) : token
  const decoded = jwt.decode(refreshToken)
  return { userId: _get(decoded, 'userId', '') }
}
