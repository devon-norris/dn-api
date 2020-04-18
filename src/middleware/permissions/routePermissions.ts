import permissions from './permissions'
import routes from './routes'
export interface RoutePermissions {
  GET?: string[]
  POST?: string[]
  PUT?: string[]
  DELETE?: string[]
}

const {
  PUBLIC,
  users_r,
  users_u,
  users_d,
  organizations_c,
  organizations_u,
  organizations_d,
  longLivedToken_c,
  permissions_r,
} = permissions

const {
  health,
  users,
  usersAuthenticate,
  usersLogout,
  organizations,
  longLivedToken,
  permissions: permissionsRoute,
} = routes

export default {
  [health]: { GET: [PUBLIC] } as RoutePermissions,
  [longLivedToken]: { POST: [longLivedToken_c] } as RoutePermissions,
  // Users
  [users]: { GET: [users_r], POST: [PUBLIC], PUT: [users_u], DELETE: [users_d] } as RoutePermissions,
  [usersAuthenticate]: { GET: [users_r], POST: [PUBLIC] } as RoutePermissions,
  [usersLogout]: { POST: [PUBLIC] } as RoutePermissions,
  // Organizations
  [organizations]: {
    GET: [PUBLIC],
    POST: [organizations_c],
    PUT: [organizations_u],
    DELETE: [organizations_d],
  } as RoutePermissions,
  // Permissions
  [permissionsRoute]: {
    GET: [permissions_r],
    POST: [permissions_r],
    PUT: [permissions_r],
    DELETE: [permissions_r],
  } as RoutePermissions,
}
