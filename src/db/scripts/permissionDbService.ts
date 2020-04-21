import _isEmpty from 'lodash/isEmpty'
import Permissions, { Permission } from '../models/permissions'
import { RoleNames, isValidRole } from '../roles'
import mongoose from 'mongoose'
import dbConfig from '../config'
require('dotenv').config()
const { DB_URL } = process.env

const db = async (env: string): Promise<any> => {
  mongoose.connection.close()
  const dbUrl = `${DB_URL}/${env}?${dbConfig.urlQueryParams}`
  console.log('Connecting to:', env)
  return mongoose.connect(dbUrl, dbConfig.options)
}

const addSuperAdminToPerm = ({ name, roles }: Permission): Permission => ({
  name,
  roles: [...new Set([...roles, RoleNames.superAdmin])],
})

const validatePermission = (permission: Permission): boolean => {
  const permNameIsValid = !_isEmpty(permission.name)
  const permRolesAreValid = permission.roles.every(role => isValidRole(role))
  return permNameIsValid && permRolesAreValid
}

const add = async (env: string, permission: Permission): Promise<any> => {
  try {
    await db(env)
    const permissionToAdd = addSuperAdminToPerm(permission)
    if (!validatePermission(permissionToAdd)) throw new Error('Invalid permissions given')
    const existingPermission = await Permissions.findOne({ name: permission.name })
    if (existingPermission) throw new Error('Permission already exists')
    const permissionAdded = await new Permissions(permission).save()
    mongoose.connection.close()
    return permissionAdded
  } catch (err) {
    mongoose.connection.close()
    throw new Error(`Error adding permission - ENV: ${env} - ERR: ${err.toString()}`)
  }
}

const modify = async (env: string, permission: Permission, id: string): Promise<any> => {
  try {
    await db(env)
    const permissionToModify = addSuperAdminToPerm(permission)
    if (!validatePermission(permissionToModify)) throw new Error('Invalid permissions given')
    const existingPermission = await Permissions.findById(id)
    if (!existingPermission) throw new Error('Permission does not exist')
    const permissionModified = await Permissions.findByIdAndUpdate(id, permission)
    mongoose.connection.close()
    return permissionModified
  } catch (err) {
    mongoose.connection.close()
    throw new Error(`Error modifying permission - ENV: ${env} - ERR: ${err.toString()}`)
  }
}

const deletePerm = async (env: string, id: string): Promise<any> => {
  try {
    await db(env)
    const existingPermission = await Permissions.findById(id)
    if (!existingPermission) throw new Error('Permission does not exist')
    const deletedPermission = await Permissions.findByIdAndDelete(id)
    mongoose.connection.close()
    return deletedPermission
  } catch (err) {
    mongoose.connection.close()
    throw new Error(`Error deleting permission - ENV: ${env} - ERR: ${err.toString()}`)
  }
}

export default { add, modify, deletePerm }
