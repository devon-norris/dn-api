import permissions from './permissions'
import routes from './routes'

export interface RoutePermissions {
  [route: string]: {
    GET?: string[]
    POST?: string[]
    PUT?: string[]
    DELETE?: string[]
  }
}

const {
  pub,
  users_r,
  users_u,
  users_d,
  organizations_c,
  organizations_u,
  organizations_d,
  longLivedToken_c,
} = permissions

const { health, users, usersAuthenticate, usersLogout, organizations, longLivedToken } = routes

const user = {
  [users]: { GET: [users_r], POST: [pub], PUT: [users_u], DELETE: [users_d] } as RoutePermissions,
  [usersAuthenticate]: { GET: [users_r], POST: [pub] } as RoutePermissions,
  [usersLogout]: { POST: [pub] } as RoutePermissions,
  [longLivedToken]: { POST: [longLivedToken_c] } as RoutePermissions,
}

const organization = {
  [organizations]: {
    GET: [pub],
    POST: [organizations_c],
    PUT: [organizations_u],
    DELETE: [organizations_d],
  } as RoutePermissions,
}

export default {
  [health]: { GET: [pub] } as RoutePermissions,
  ...user,
  ...organization,
} as RoutePermissions
