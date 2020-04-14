import _isEmpty from 'lodash/isEmpty'
import { isPublicRoute, extractRouteMethodPermissions } from '../middleware/permissions'
import validateToken from '../util/token/validateToken'
import { sendError, notFound } from '../util/responses'
import cookieConfig, { ACCESS_TOKEN, REFRESH_TOKEN } from '../util/cookieConfig'
import { Request, Response, NextFunction } from '../types'

export default async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  const { originalUrl, method } = req
  const routeMethodPermissions = extractRouteMethodPermissions(originalUrl, method)
  const { isValid, accessToken, refreshToken, user } = await validateToken(req)
  req.user = user

  if (_isEmpty(routeMethodPermissions)) return notFound(res)

  if (isPublicRoute(routeMethodPermissions)) return next()

  if (!isValid)
    return sendError({
      res,
      status: 401,
      message: 'Invalid token',
      error: 'Unauthorized',
    })

  res.cookie(ACCESS_TOKEN, accessToken, cookieConfig)
  res.cookie(REFRESH_TOKEN, refreshToken, cookieConfig)
  return next()
}
