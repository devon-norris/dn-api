import _isEmpty from 'lodash/isEmpty'
import Permissions, { Permission } from '../models/permissions'
import { RoleNames, isValidRole } from '../roles'
import mongoose from 'mongoose'
import dbConfig from '../config'
require('dotenv').config()
const { DB_URL } = process.env

const db = async (env: string): Promise<any> => {
  const dbUrl = `${DB_URL}/${env}?${dbConfig.urlQueryParams}`
  console.log('Connecting to:', env)
  return mongoose.connect(dbUrl, dbConfig.options)
}

const preparePermissions = (permissions: Permission[]): Permission[] =>
  permissions.map(
    (permission: Permission): Permission => ({
      name: permission.name.trim(),
      roles: [...new Set([...permission.roles, RoleNames.superAdmin])],
    })
  )

const validatePermissions = (permissions: Permission[]): boolean => {
  const names = permissions.map(p => p.name)
  const findDuplicateNames = names.filter((n, i) => names.indexOf(n) !== i)
  return (
    _isEmpty(findDuplicateNames) &&
    permissions.every(({ name, roles }) => !_isEmpty(name) && roles.every(role => isValidRole(role)))
  )
}

export const add = async (env: string, permissions: Permission[]): Promise<void> => {
  try {
    await db(env)
    const permissionsToAdd = preparePermissions(permissions)
    if (!validatePermissions(permissionsToAdd)) throw new Error('Invalid permissions given')
    for await (const permission of permissionsToAdd) {
      const existingPermission = await Permissions.findOne({ name: permission.name })
      if (existingPermission) throw new Error('Permission already exists')
      const permissionAdded = await new Permissions(permission).save()
      console.log('Permission added:', permissionAdded)
    }
    mongoose.connection.close()
  } catch (err) {
    mongoose.connection.close()
    console.error('Error adding permission:', err)
    console.error('ENVIRONMENT:', env)
  }
}

export const modify = async (env: string, permissions: Permission[]): Promise<void> => {
  try {
    await db(env)
    const permissionsToModify = preparePermissions(permissions)
    if (!validatePermissions(permissionsToModify)) throw new Error('Invalid permissions given')
    for await (const permission of permissionsToModify) {
      const permissionModified = await Permissions.findOneAndUpdate({ name: permission.name }, permission)
      console.log('Permission modified:', permissionModified)
    }
    mongoose.connection.close()
  } catch (err) {
    mongoose.connection.close()
    console.error('Error modifying permission:', err)
    console.error('ENVIRONMENT:', env)
  }
}

export const deletePerm = async (env: string, permissions: string[]): Promise<void> => {
  try {
    await db(env)
    for await (const name of permissions) {
      const permissionDeleted = await Permissions.findOneAndDelete({ name })
      console.log('Permission deleted:', permissionDeleted)
    }
    mongoose.connection.close()
  } catch (err) {
    mongoose.connection.close()
    console.error('Error deleting permission:', err)
    console.error('ENVIRONMENT:', env)
  }
}
