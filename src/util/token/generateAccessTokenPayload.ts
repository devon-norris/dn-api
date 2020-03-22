import Users from '../../db/models/users'
import Permissions from '../../db/models/permissions'
import _get from 'lodash/get'
import { AccessTokenPayload } from './generateToken'

export const defaultAccessToken: AccessTokenPayload = {
  fName: '',
  lName: '',
  email: '',
  userId: '',
  orgId: '',
  role: '',
  permissions: [],
}

export default async (id: string): Promise<AccessTokenPayload> => {
  const [dbUser, dbPermissions] = await Promise.all([Users.findById(id), Permissions.find()])
  if (!dbUser || !dbPermissions) throw new Error('User not found')
  const role = _get(dbUser, 'role', '')
  const permissions: string[] = []
  dbPermissions.forEach((dbPerm: any): void => {
    const dbPermRoles = _get(dbPerm, 'roles', [])
    const dbPermName = _get(dbPerm, 'name', '')
    const dbPermIncludesUserRole = dbPermRoles.some((permRole: string) => permRole === role)
    if (dbPermIncludesUserRole) permissions.push(dbPermName)
  })
  return {
    fName: _get(dbUser, 'fName', ''),
    lName: _get(dbUser, 'lName', ''),
    email: _get(dbUser, 'email', ''),
    userId: _get(dbUser, '_id', '').toString(),
    orgId: _get(dbUser, 'orgId', ''),
    role,
    permissions,
  }
}
