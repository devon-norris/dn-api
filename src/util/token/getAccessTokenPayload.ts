import jwt from 'jsonwebtoken'
import _get from 'lodash/get'
import { AccessTokenPayload } from './generateToken'
import { ACCESS_TOKEN } from '../cookieConfig'
import { Request } from '../../types'

interface GetAccessTokenParams {
  token?: string
  req?: Request
}

export const extractAccessTokenFromRequest = ({ signedCookies, headers }: Request): string => {
  const cookieAccessToken = _get(signedCookies, ACCESS_TOKEN)
  const authHeaderToken = _get(headers, 'authorization', '').replace('Bearer ', '')
  return cookieAccessToken || authHeaderToken
}

export const getAccessTokenExpiration = ({ token = '', req }: GetAccessTokenParams): number => {
  const accessToken = req ? extractAccessTokenFromRequest(req) : token
  const decoded = jwt.decode(accessToken)
  return _get(decoded, 'exp', 0)
}

export default ({ token = '', req }: GetAccessTokenParams): AccessTokenPayload => {
  const accessToken = req ? extractAccessTokenFromRequest(req) : token
  const decoded = jwt.decode(accessToken)
  return {
    fName: _get(decoded, 'fName', ''),
    lName: _get(decoded, 'lName', ''),
    email: _get(decoded, 'email', ''),
    userId: _get(decoded, 'userId', ''),
    orgId: _get(decoded, 'orgId', ''),
    role: _get(decoded, 'role', ''),
    permissions: _get(decoded, 'permissions', []),
  }
}
