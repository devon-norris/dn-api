import Users from '../db/models/users'
import _isEmpty from 'lodash/isEmpty'
import _pick from 'lodash/pick'
import _isArray from 'lodash/isArray'
import { ValidatorResponse, ValidatorParams } from '../util/buildTableController'
import { Request } from '../types'
import { RoleNames } from '../db/roles'

export const deleteOrganizationValidator = async ({ id }: ValidatorParams): Promise<ValidatorResponse> => {
  const users = await Users.find({ orgId: id })
  const isValid = _isEmpty(users)
  const message = isValid ? '' : 'Organization with users cannot be deleted'
  const status = isValid ? 200 : 403
  return { isValid, message, status }
}

export const organizationResponseOmit = (data: any[], req: Request): any[] => {
  const { user } = req
  const isSuperAdmin = user?.role === RoleNames.superAdmin
  if (isSuperAdmin) return data
  const pickFields = ['name', '_id']
  // @ts-ignore
  return _isArray(data) ? data.map(org => _pick(org, pickFields)) : _pick(data, pickFields)
}
