import Permissions from '../models/permissions'
import _get from 'lodash/get'
import permissions from '../../middleware/permissions/permissions'
import { RoleNames } from '../roles'
import dbConfig from '../config'
import mongoose from 'mongoose'
require('dotenv').config()
const { DB_URL } = process.env
const { development } = dbConfig.environments

const findInOtherArray = (arrOne: string[], arrTwo: string[]): boolean =>
  arrOne.every(permOne => arrTwo.some(permTwo => permOne === permTwo))

const isEqualPerms = (arrOne: string[], arrTwo: string[]): boolean => {
  const arrOneInTwo = findInOtherArray(arrOne, arrTwo)
  const arrTwoInOne = findInOtherArray(arrTwo, arrOne)
  return arrOneInTwo && arrTwoInOne
}

const hasSuperAdminPerm = (roles: string[]): boolean => roles.some(role => role === RoleNames.superAdmin)

const validatePermissions = async (): Promise<void> => {
  const dbUrl = `${DB_URL}/${development}?${dbConfig.urlQueryParams}`
  await mongoose.connect(dbUrl, dbConfig.options)
  const dbPermissions = await Permissions.find()
  const dbPermissionNames = dbPermissions.map(perm => _get(perm, 'name', ''))
  const superAdminInEveryDbPerm = dbPermissions.every(perm => hasSuperAdminPerm(_get(perm, 'roles', [])))
  const codePermissions = Object.values(permissions).filter(perm => perm !== permissions.PUBLIC)

  const codePermsEqualDbPerms = isEqualPerms(codePermissions, dbPermissionNames)

  if (!codePermsEqualDbPerms || !superAdminInEveryDbPerm) throw new Error('Permissions not in sync')
  console.log('Successfully validated DB permissions, CODE permissions and SUPER ADMIN permissions')
  mongoose.connection.close()
}

validatePermissions()
