import Users from '../db/models/users'
import _isEmpty from 'lodash/isEmpty'
import { ValidatorResponse, ValidatorParams } from '../util/buildTableController'

export const deleteOrganizationValidator = async ({ id }: ValidatorParams): Promise<ValidatorResponse> => {
  const users = await Users.find({ orgId: id })
  const isValid = _isEmpty(users)
  const message = isValid ? '' : 'Organization with users cannot be deleted'
  const status = isValid ? 200 : 403
  return { isValid, message, status }
}
