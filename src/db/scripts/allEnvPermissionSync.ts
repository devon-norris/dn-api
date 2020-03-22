import dbConfig from '../config'
import Permissions from '../models/permissions'
import _find from 'lodash/find'
import _isEmpty from 'lodash/isEmpty'
import { argv } from 'yargs'
import mongoose from 'mongoose'
require('dotenv').config()
const { DB_URL } = process.env
const { development, staging, production } = dbConfig.environments

const permissionsNotInSync: string[] = []

const getPermissions = async (env: string): Promise<any> => {
  const dbUrl = `${DB_URL}/${env}?${dbConfig.urlQueryParams}`
  await mongoose.connect(dbUrl, dbConfig.options)
  console.log('Connected to:', env)
  const permissions = await Permissions.find()
  mongoose.connection.close()
  return permissions
}

const compareArrays = (setOne: any[], setTwo: any[], isPermName = false): boolean => {
  const oneInTwo = setOne.every(oneField => {
    const foundInOther = setTwo.some(twoField => oneField === twoField)
    if (isPermName && !foundInOther) permissionsNotInSync.push(oneField)
    return foundInOther
  })
  const twoInOne = setTwo.every(twoField => {
    const foundInOther = setOne.some(oneField => twoField === oneField)
    if (isPermName && !foundInOther) permissionsNotInSync.push(twoField)
    return foundInOther
  })
  return oneInTwo && twoInOne
}

const compareRoles = (setOne: any[], setTwo: any[]): boolean => {
  const oneInTwo = setOne.every(onePerm => {
    const twoPerm = _find(setTwo, { name: onePerm.name })
    if (!twoPerm) {
      permissionsNotInSync.push(onePerm.name)
      return false
    }
    const rolesInSync = compareArrays(onePerm.roles, twoPerm.roles)
    if (!rolesInSync) permissionsNotInSync.push(onePerm.name)
    return rolesInSync
  })
  const twoInOne = setTwo.every(twoPerm => {
    const onePerm = _find(setOne, { name: twoPerm.name })
    if (!onePerm) {
      permissionsNotInSync.push(twoPerm.name)
      return false
    }
    const rolesNotInSync = compareArrays(twoPerm.roles, onePerm.roles)
    if (!rolesNotInSync) permissionsNotInSync.push(twoPerm.name)
    return rolesNotInSync
  })
  return oneInTwo && twoInOne
}

const compareNames = (setOne: any[], setTwo: any[]): boolean => {
  const setOneNames = setOne.map(perm => perm.name)
  const setTwoNames = setTwo.map(perm => perm.name)
  return compareArrays(setOneNames, setTwoNames, true)
}

const compareTwoPerms = (setOne: any[], setTwo: any[]): boolean =>
  compareNames(setOne, setTwo) && compareRoles(setOne, setTwo)

const checkAllEnvPerms = async (): Promise<void> => {
  const devPerms = await getPermissions(development)
  const stgPerms = await getPermissions(staging)
  const prodPerms = await getPermissions(production)
  if (!_isEmpty(argv._)) {
    const name = argv._[0]
    console.log('Development:', _find(devPerms, { name }))
    console.log('Staging:', _find(stgPerms, { name }))
    console.log('Production:', _find(prodPerms, { name }))
  }
  const devEqualsStg = compareTwoPerms(devPerms, stgPerms)
  const devEqualsProd = compareTwoPerms(devPerms, prodPerms)
  const allPermsInSync = devEqualsStg && devEqualsProd
  if (!allPermsInSync) {
    console.log('DEV equals STG?', devEqualsStg)
    console.log('DEV equals PROD?', devEqualsProd)
    throw new Error('Permission sets not in sync')
  }
  console.log('Permission sets are in sync!')
}

checkAllEnvPerms()
