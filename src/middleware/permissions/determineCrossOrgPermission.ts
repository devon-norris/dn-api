import { RoleNames } from '../../db/roles'

export default (role: string): boolean => role === RoleNames.superAdmin
