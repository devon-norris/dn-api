interface Role {
  name: string
  accessLevel: number
}

export enum RoleNames {
  custom = 'custom',
  user = 'user',
  admin = 'admin',
  orgAdmin = 'orgadmin',
  superAdmin = 'superadmin',
}

export const isValidRole = (roleToCheck: string): boolean => Object.values(RoleNames).some(role => roleToCheck === role)

const roles: Role[] = [
  { name: RoleNames.custom, accessLevel: 0 },
  { name: RoleNames.user, accessLevel: 1 },
  { name: RoleNames.admin, accessLevel: 2 },
  { name: RoleNames.orgAdmin, accessLevel: 3 },
  { name: RoleNames.superAdmin, accessLevel: 4 },
]

export default roles
