import permissionDbService from '../db/scripts/permissionDbService'
import dbConfig from '../db/config'
import { Permission } from '../db/models/permissions'
import db from '../db'
import _isEmpty from 'lodash/isEmpty'
import logger from '../util/logger'
const childLogger = logger.child({ service: 'permissions' })
const allEnvironments = Object.values(dbConfig.environments)

const handlePermissionAction = async (action: any, name: string, permission?: Permission): Promise<any> => {
  const responses = []
  const errors = []
  for await (const env of allEnvironments) {
    try {
      const perm = await action(env, name, permission)
      responses.push({ env, perm })
    } catch (err) {
      errors.push(err.message)
    }
  }
  await db()
  if (!_isEmpty(errors)) {
    childLogger.error(`Error changing permissions`, { permission, errors })
    throw new Error(errors.toString())
  }
  return responses
}

const create = async (permission: Permission): Promise<any> => {
  childLogger.info(`Creating new permission: ${permission.name}`)
  return handlePermissionAction(permissionDbService.add, permission.name, permission)
}

const update = async (permission: Permission): Promise<any> => {
  childLogger.info(`Updating permission: ${permission.name}`)
  return handlePermissionAction(permissionDbService.modify, permission.name, permission)
}

const deletePermission = async (name: string): Promise<any> => {
  childLogger.info(`Deleting permission: ${name}`)
  return handlePermissionAction(permissionDbService.deletePerm, name)
}

export default { create, update, deletePermission }
