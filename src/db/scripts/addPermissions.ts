import { RoleNames } from '../roles'
import allPermisisons from '../../middleware/permissions/permissions'
import dbConfig from '../config'
import { Permission } from '../models/permissions'
// eslint-disable-next-line
import { add, modify, deletePerm } from './addPermissionsService'
// eslint-disable-next-line
const { user, admin, orgAdmin } = RoleNames
const { environments } = dbConfig

// Modify between lines
// -----------------------------------
const { users_u } = allPermisisons
const permissions: Permission[] = [
  {
    name: users_u,
    roles: [user, admin, orgAdmin],
  },
]

const action = modify
// -----------------------------------

const runScript = async (): Promise<void> => {
  const allEnvironments = Object.values(environments)
  for await (const env of allEnvironments) {
    await action(env, permissions)
  }
}

runScript()