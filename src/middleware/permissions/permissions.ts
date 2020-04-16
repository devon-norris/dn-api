interface Permissions {
  [permission: string]: string
}

const user: Permissions = {
  users_c: 'users_c',
  users_r: 'users_r',
  users_u: 'users_u',
  users_d: 'users_d',
  longLivedToken_c: 'longLivedToken_c',
}

const organization: Permissions = {
  organizations_c: 'organizations_c',
  organizations_r: 'organizations_r',
  organizations_u: 'organizations_u',
  organizations_d: 'organizations_d',
}

const permissions: Permissions = {
  permissions_r: 'permissions_r',
}

export default {
  pub: 'public',
  ...user,
  ...organization,
  ...permissions,
} as Permissions
