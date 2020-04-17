import permissionsMap from './routePermissions'
import { accessDenied, notFound } from '../../util/responses'
import permissions from './permissions'
import _isArray from 'lodash/isArray'
import _isEmpty from 'lodash/isEmpty'
import { Request, Response, NextFunction } from '../../types'
import isMongoId from '../../util/isMongoId'

const extractRoute = (originalUrl: string): string => {
  const urlMinusQuery = originalUrl.split('?')[0]
  const urlArr = urlMinusQuery.split('/')
  const lastStr = urlArr[urlArr.length - 1] || ''
  const lastStrIsId = isMongoId(lastStr)
  if (lastStrIsId) urlArr.pop()
  return urlArr.join('/')
}

export const extractRouteMethodPermissions = (originalUrl: string, method: string): string[] => {
  const route = extractRoute(originalUrl)
  const routePermissions = permissionsMap[route] || {}

  // @ts-ignore
  const methodPermissions = routePermissions[method]
  if (!_isArray(methodPermissions)) return []
  return methodPermissions
}

const hasPermission = (userPermissions: string[], methodPermissions: string[]): boolean =>
  methodPermissions.some(methodPerm => userPermissions.some(userPerm => methodPerm === userPerm))

export const isPublicRoute = (methodPermissions: string[]): boolean =>
  methodPermissions.some(permission => permission === permissions.pub)

export default ({ originalUrl, method, user }: Request, res: Response, next: NextFunction): void | Response => {
  const userPermissions = user?.permissions || []
  const routeMethodPermissions = extractRouteMethodPermissions(originalUrl, method)

  if (_isEmpty(routeMethodPermissions)) return notFound(res)

  if (isPublicRoute(routeMethodPermissions)) return next()

  if (!hasPermission(userPermissions, routeMethodPermissions)) return accessDenied(res)
  return next()
}
