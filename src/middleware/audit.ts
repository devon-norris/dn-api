import { Request } from '../types'
import _omit from 'lodash/omit'
import Audit from '../db/models/audit'
import logger from '../util/logger'
const childLogger = logger.child({ service: 'audit' })

interface AuditParams {
  req: Request
  message: string
  data: any
}

interface BlacklistOption {
  method: 'POST' | 'PUT' | 'DELETE'
  url: string
}

interface AuditData {
  baseUrl: string
  originalUrl: string
  method: string
  path: string
  reqOrgId: string
  reqId: string
  putDiff: any
  reqBody: any
  resData: any
  resMessage: string
  userName: string
  userId: string
  userOrgId: string
  userRole: string
}

const blackList: BlacklistOption[] = [{ method: 'POST', url: '/users/logout' }]

const isBlacklist = (method: string, originalUrl: string): boolean =>
  blackList.some(opt => originalUrl.includes(opt.url) && method === opt.method)

const extractPutDiff = (body: any, resData: any): any => {
  try {
    const diff: any = {}
    for (const key in body) {
      if (body[key] !== resData[key]) {
        diff[key] = body[key]
      }
    }
    return diff
  } catch (err) {
    childLogger.error('Error parsing PUT Diff', { error: err.toString() })
    return {}
  }
}

export default ({ req, message, data }: AuditParams): void => {
  const { method, user, route, baseUrl, originalUrl, query, params, body } = req
  try {
    if (method === 'GET' || isBlacklist(method, originalUrl)) return
    const filteredBody = _omit(body, ['password'])
    const auditData: AuditData = {
      baseUrl,
      originalUrl,
      method,
      path: route.path,
      reqOrgId: query.orgId ?? '',
      reqId: params.id ?? '',
      putDiff: method === 'PUT' ? extractPutDiff(filteredBody, data) : null,
      reqBody: filteredBody,
      resData: data,
      resMessage: message,
      userName: `${user?.fName} ${user?.lName}`,
      userId: user?.userId ?? '',
      userOrgId: user?.orgId ?? '',
      userRole: user?.role ?? '',
    }
    new Audit(auditData).save()
  } catch (err) {
    childLogger.error(`Audit error --> ${method} ${originalUrl}`, { user, body, params, query, error: err.toString() })
  }
}
